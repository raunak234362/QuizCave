/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import type {
  ContestData,
  QuestionData,
  ResultDetails,
} from "../../Interfaces";
import { Question } from "./ContestQuestion";
import { Counterdown } from "./Counterdown";
import Service from "../../../config/Service";
import toast from "react-hot-toast";

interface Props {
  contest: ContestData | null;
  resultDetails: ResultDetails | null;
  questionDetails: QuestionData[] | null;
  shuffleQuestions: (q: QuestionData[]) => QuestionData[];
  setAssessmentComplete: (completed: boolean) => void;
}

const AssessmentPage = ({
  resultDetails,
  contest,
  questionDetails,
  shuffleQuestions,
  setAssessmentComplete,
}: Props) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [questionStatuses, setQuestionStatuses] = useState<{
    [key: string]: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [_tabSwitchCount, setTabSwitchCount] = useState(0);
  const [_fullscreenWarnings, setFullscreenWarnings] = useState(0);
  const maxTabSwitches = 1; // 2 warnings before auto-submit
  const maxFullscreenWarnings = 1; // 2 warnings before auto-submit

  // Use a ref to hold a stable reference to the submission logic
  const performFinalSubmitRef = useRef<() => Promise<void>>(() =>
    Promise.resolve(),
  );

  const performFinalSubmit = async () => {
    if (!resultDetails?._id) {
      toast.error("Missing result ID. Cannot submit.");
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    const loadingToast = toast.loading("Submitting your answers...");

    try {
      const response = await Service.finalSubmitAnswers({
        resultId: resultDetails._id,
      });
      console.log("Final submission response:", response);
      console.log("Submission success:", response.data.success);
      if (response.success) {
        toast.success("Assessment submitted successfully! 🎉", {
          id: loadingToast,
        });
        setAssessmentComplete(true);
      } else {
        toast.error("Submission failed. Please try again.", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission failed. Please try again.", { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  // Update the ref whenever the performFinalSubmit function changes
  useEffect(() => {
    performFinalSubmitRef.current = performFinalSubmit;
  }, [performFinalSubmit]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (questionDetails?.length ?? 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      toast("You have reached the end of the exam.", { icon: "ℹ️" });
    }
  };

  useEffect(() => {
    // 🔒 Disable Right Click
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      toast.error("Right-click is disabled during the assessment.");
    };
    document.addEventListener("contextmenu", disableRightClick);

    // 🔒 Disable Keyboard Shortcuts (DevTools, Screenshots, Copy/Paste)
    const disableKeys = (e: KeyboardEvent) => {
      // Block DevTools
      if (
        e.key === "F12" ||
        (e.ctrlKey &&
          e.shiftKey &&
          (e.key === "I" || e.key === "C" || e.key === "J")) ||
        (e.ctrlKey && e.key === "U") ||
        (e.metaKey &&
          e.altKey &&
          (e.key === "I" || e.key === "C" || e.key === "J"))
      ) {
        e.preventDefault();
        toast.error("Inspection tools are disabled during assessment.");
        return;
      }

      // Block Screenshots (Windows, Mac, Linux)
      if (
        e.key === "PrintScreen" ||
        (e.metaKey &&
          e.shiftKey &&
          (e.key === "3" || e.key === "4" || e.key === "5")) || // Mac
        (e.ctrlKey && e.key === "PrintScreen") || // Windows
        (e.shiftKey && e.key === "PrintScreen") || // Some Windows variants
        (e.metaKey && e.shiftKey && e.key === "s") || // Windows Snipping Tool
        (e.ctrlKey && e.shiftKey && e.key === "s") // Windows Snip & Sketch
      ) {
        e.preventDefault();
        toast.error("Screenshots are not allowed during the assessment.");
        return;
      }

      // Block Copy/Cut/Paste
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "C")) ||
        (e.ctrlKey && (e.key === "x" || e.key === "X")) ||
        (e.ctrlKey && (e.key === "v" || e.key === "V")) ||
        (e.metaKey && (e.key === "c" || e.key === "C")) ||
        (e.metaKey && (e.key === "x" || e.key === "X")) ||
        (e.metaKey && (e.key === "v" || e.key === "V"))
      ) {
        e.preventDefault();
        toast.error("Copy/Paste operations are disabled during assessment.");
        return;
      }
    };
    window.addEventListener("keydown", disableKeys);

    // 🔒 Disable Copy/Cut/Paste via Context Menu
    const disableCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error("Copy/Paste operations are disabled during assessment.");
    };
    document.addEventListener("copy", disableCopyPaste);
    document.addEventListener("cut", disableCopyPaste);
    document.addEventListener("paste", disableCopyPaste);

    // 🔒 Prevent drag and drop
    const preventDragDrop = (e: DragEvent) => {
      e.preventDefault();
    };
    document.addEventListener("dragstart", preventDragDrop);
    document.addEventListener("drop", preventDragDrop);

    // 🔒 Disable text selection
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      window.removeEventListener("keydown", disableKeys);
      document.removeEventListener("copy", disableCopyPaste);
      document.removeEventListener("cut", disableCopyPaste);
      document.removeEventListener("paste", disableCopyPaste);
      document.removeEventListener("dragstart", preventDragDrop);
      document.removeEventListener("drop", preventDragDrop);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
    };
  }, []);

  // 🔒 Enhanced DevTools Detection
  useEffect(() => {
    let checkInterval: any;

    const detectDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;

      if (widthDiff || heightDiff) {
        toast.error("Developer tools detected! Auto-submitting assessment...");
        performFinalSubmitRef.current();
      }
    };

    checkInterval = setInterval(detectDevTools, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  const handleSaveAnswer = (
    qid: string,
    value: any,
    status: string = "attempted",
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: value,
    }));
    setQuestionStatuses((prev) => ({
      ...prev,
      [qid]: status,
    }));
  };

  const handleFinalSubmit = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium text-gray-800">Submit Assessment?</p>
          <p className="text-sm text-gray-600">
            You won't be able to change your answers afterward.
          </p>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 font-medium transition-colors"
              onClick={() => {
                toast.dismiss(t.id);
                performFinalSubmit();
              }}
            >
              Yes, Submit
            </button>
            <button
              className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-sm hover:bg-gray-300 font-medium transition-colors"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 8000,
        position: "top-center",
        style: {
          background: "#fff",
          color: "#000",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      },
    );
  };

  const handleTimeUp = async () => {
    toast("⏰ Time is up! Submitting your answers...", { icon: "⏰" });
    performFinalSubmit();
  };

  // 🔒 Request Fullscreen on Mount (backup in case ContestCard fails)
  useEffect(() => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen?.({ navigationUI: "hide" })
        .catch((err) => {
          console.warn("Fullscreen request failed:", err);
        });
    }
  }, []);

  // 🔒 Fullscreen Exit Detection with 2 Warnings
  useEffect(() => {
    const handleFullscreenExit = () => {
      if (!document.fullscreenElement) {
        setFullscreenWarnings((prev) => {
          const newCount = prev + 1;

          if (newCount > maxFullscreenWarnings) {
            toast.error(
              "🚨 You exited fullscreen mode too many times! Auto-submitting the test.",
            );
            performFinalSubmitRef.current();
          } else {
            const remainingWarnings = maxFullscreenWarnings - newCount;
            toast.error(
              `Warning ${newCount}/${maxFullscreenWarnings}: You exited fullscreen mode! ` +
                `You have ${remainingWarnings} warning${remainingWarnings !== 1 ? "s" : ""} remaining.`,
              { duration: 5000 },
            );

            // Try to re-enter fullscreen
            document.documentElement
              .requestFullscreen?.({ navigationUI: "hide" })
              .catch((err) => {
                console.warn("Failed to re-enter fullscreen:", err);
              });
          }

          return newCount;
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenExit);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenExit);
  }, []);

  // 🔒 Tab/Window Switching Detection with 2 Warnings
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;

          if (newCount > maxTabSwitches) {
            toast.error(
              "🚨 Tab switching limit exceeded! Auto-submitting test.",
            );
            performFinalSubmitRef.current();
          } else {
            const remainingWarnings = maxTabSwitches - newCount;
            toast.error(
              `Warning ${newCount}/${maxTabSwitches}: Switching tabs/windows is not allowed! ` +
                `You have ${remainingWarnings} warning${remainingWarnings !== 1 ? "s" : ""} remaining.`,
              { duration: 5000 },
            );
          }

          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // 🔒 Prevent Browser Back/Forward and Refresh
  useEffect(() => {
    const warnBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);

    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, []);

  if (!contest || !resultDetails || !questionDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">
            Error Loading Assessment
          </h2>
          <p className="text-gray-600">
            Missing required data to display the assessment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 🔹 Header with Timer */}
      <div className="flex justify-between items-center bg-white shadow p-4">
        <h1 className="text-xl font-bold text-gray-800">
          {contest?.name || "Assessment"}
        </h1>
        <Counterdown
          duration={Number(contest?.duration) || 30}
          onCountdownEnd={handleTimeUp}
        />
      </div>

      {/* 🔹 Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side: Question */}
        <div className="w-3/4 p-6 overflow-y-auto">
          {questionDetails[currentQuestionIndex] && (
            <Question
              key={questionDetails[currentQuestionIndex]._id}
              Question={{
                ...questionDetails[currentQuestionIndex],
                type: questionDetails[currentQuestionIndex].type as
                  | "short"
                  | "numerical"
                  | "long"
                  | "multiple"
                  | "mcq",
                difficult: ["easy", "medium", "hard"].includes(
                  questionDetails[currentQuestionIndex].difficult,
                )
                  ? (questionDetails[currentQuestionIndex].difficult as
                      | "easy"
                      | "medium"
                      | "hard")
                  : undefined,
              }}
              resultId={resultDetails?._id}
              number={currentQuestionIndex + 1}
              shuffleQuestions={shuffleQuestions}
              handleNextQuestion={handleNextQuestion}
              onSaveAnswer={handleSaveAnswer}
              isLastQuestion={
                currentQuestionIndex === questionDetails.length - 1
              }
              onFinalSubmit={handleFinalSubmit}
              answer={answers[questionDetails[currentQuestionIndex]._id]}
            />
          )}
        </div>

        {/* Right side: Question Panel */}
        <div className="w-1/4 p-5 border-l bg-white shadow-inner h-[50vh] overflow-y-auto flex flex-col">
          <h3 className="text-lg font-bold mb-4 text-gray-700">
            Question Panel
          </h3>
          <div className="grid grid-cols-5 gap-3 h-[40vh] overflow-y-auto">
            {questionDetails.map((q, index) => {
              const status = questionStatuses[q._id];
              let buttonClass =
                "bg-gray-200 text-black hover:scale-105 transition-transform duration-200";

              if (status === "attempted") {
                buttonClass =
                  "bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-transform duration-200";
              } else if (status === "review") {
                buttonClass =
                  "bg-yellow-400 text-black hover:bg-yellow-500 hover:scale-105 transition-transform duration-200";
              }

              if (index === currentQuestionIndex) {
                buttonClass =
                  "bg-blue-500 text-white ring-2 ring-blue-300 hover:bg-blue-600 hover:scale-110 transition-transform duration-200";
              }

              return (
                <button
                  key={q._id}
                  className={`p-3 rounded-xl text-sm font-bold border shadow-sm ${buttonClass}`}
                  onClick={() => setCurrentQuestionIndex(index)}
                  title={
                    status === "attempted"
                      ? "Attempted"
                      : status === "review"
                        ? "Marked for Review"
                        : "Unattempted"
                  }
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-green-500"></span>
              <span>Attempted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-yellow-400"></span>
              <span>Marked for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-gray-300"></span>
              <span>Unattempted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-blue-500"></span>
              <span>Current Question</span>
            </div>
          </div>

          {/* Final Submit Button */}
          <div className="mt-8">
            <button
              onClick={handleFinalSubmit}
              disabled={submitting}
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {submitting ? "Submitting..." : "Final Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
