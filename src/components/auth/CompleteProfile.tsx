import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface CompleteProfileModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (age: string, grade: string) => void;
}

const CompleteProfile: React.FC<CompleteProfileModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState("");

  const handleSubmit = () => {
    if (!age || !grade) return;
    onSubmit(age, grade); // This will trigger the onSubmit function passed from the parent
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Complete Your Profile
          </Dialog.Title>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Enter your grade (e.g., 5th, 10th)"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={!age || !grade}
              className={`px-4 py-2 rounded text-white ${
                !age || !grade
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Submit
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CompleteProfile;
