import React from "react";
import parse from "html-react-parser";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface ContestRulesProps {
  rules: string;
  onStart: () => void;
  onCancel: () => void;
}



const ContestRules = ({ rules, onStart, onCancel }: ContestRulesProps) => {
  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onCancel}>
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-gray-900 text-center"
                >
                  Contest Rules & Regulations
                </Dialog.Title>
                <div className="mt-4 text-lg p-4 border rounded-lg bg-gray-50 max-h-96 overflow-y-auto">
                  {rules ? (
                    parse(rules)
                  ) : (
                    <p>No rules available for this contest.</p>
                  )}
                </div>
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    onClick={async () => {
                      const confirmation = window.confirm(
                        "Please read the rules carefully before starting. Do you want to start the assessment?"
                      );
                      if (confirmation) {
                        onStart();
                      }
                    }}
                  >
                    Start Assessment
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ContestRules