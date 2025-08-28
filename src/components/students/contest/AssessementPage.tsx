/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment } from "react";
import { Question } from "./ContestQuestion"; // Corrected import path
import { CompletedAssessment } from "./CompletedAssessment";
import { Counterdown } from "./Counterdown";
import { Dialog, Transition } from "@headlessui/react";
import Service from "../../../config/Service";

interface QuestionType {
  _id: string;
  question?: string;
  text?: string;
  type: "short" | "numerical" | "long" | "multiple" | "mcq";
  difficult?: "easy" | "medium" | "hard";
  questionImage?: string;
  multipleQuestion?: string[];
  mcqOptions?: string[];
  options?: Array<{ label: string; value: string }>;
}

interface AssessmentPageProps {
  contest: any;
  questions: QuestionType[];
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({
  contest,
  questions,
}) => {
  const [next, setNext] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [quesAppear, setQuestionAppear] = useState<boolean[]>(
    Array.from({ length: questions?.length || 0 }, () => false)
  );
  const [showWarning, setShowWarning] = useState(false);

  const handleTabChange = () => {
    setShowWarning(true);
    setTimeout(() => {
      submitOnViolation();
    }, 5000);
  };

  const submitOnViolation = async () => {
    const token = sessionStorage.getItem("token") || "";
    try {
      await Service.studentContestSubmit({
        id: contest?._id,
        token,
        answers: answers,
      });
      alert("Contest submitted due to violation!");
    } catch (error) {
      console.error("Error submitting contest due to violation:", error);
    }
    setNext(questions.length);
  };

  const submitOnTimeOver = async () => {
    const token = sessionStorage.getItem("token") || "";
    try {
      await Service.studentContestSubmit({
        id: contest?._id,
        token,
        answers: answers,
      });
      alert("Time is up! The contest has been submitted.");
    } catch (error) {
      console.error("Error submitting contest:", error);
    }
    setNext(questions.length);
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      e.key === "F11" ||
      e.key === "Escape" ||
      (e.ctrlKey && e.shiftKey && e.key === "I")
    ) {
      e.preventDefault();
      handleTabChange();
    }
  };

  const handleSaveAnswer = (qid: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    const newQuesAppear = [...quesAppear];
    newQuesAppear[next] = true;
    setQuestionAppear(newQuesAppear);
    setNext((prev) => prev + 1);
  };

  useEffect(() => {
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("visibilitychange", handleTabChange);
    document.documentElement.requestFullscreen().catch((err) => {
      console.error("Fullscreen request failed:", err);
    });

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("visibilitychange", handleTabChange);
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  return (
    <>
      {next < (questions?.length || 0) ? (
        <section className={`grid grid-cols-[75%_25%] mx-5 bg-white h-[90vh]`}>
          <div className="overflow-y-auto my-5 mx-10">
            <Question
              key={questions[next]?._id}
              Question={questions[next]}
              number={next + 1}
              onSaveAnswer={handleSaveAnswer}
            />
          </div>
          <div className="border-2 border-gray-500 rounded-xl m-3">
            <div className="mx-3 my-2">
              <span className="text-black text-xl font-bold">Time Left:</span>
              <Counterdown
                duration={contest?.duration}
                onCountdownEnd={submitOnTimeOver}
              />
            </div>
            <div className="mx-5 my-2 h-[76vh]">
              <span className="text-black text-xl font-bold">
                Question Attempted
              </span>
              <div className="overflow-y-auto h-[73vh] my-2">
                <div className="flex flex-row flex-wrap">
                  {quesAppear.map((appear, index) => (
                    <div
                      key={index}
                      className={`p-3 m-5 w-12 h-12 text-center rounded-full cursor-not-allowed ${
                        index > next
                          ? "text-white bg-slate-400"
                          : appear
                          ? "text-white bg-green-500"
                          : "text-black bg-red-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <CompletedAssessment result={answers} contest={contest} />
      )}

      <Transition appear show={showWarning} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setShowWarning(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-red-600"
                  >
                    Warning: Tab Switched!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      You have switched tabs or lost focus on the assessment
                      window. The test will be submitted automatically in 5
                      seconds.
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => setShowWarning(false)}
                    >
                      I Understand
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
