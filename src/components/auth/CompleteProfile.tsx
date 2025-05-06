import React, { useState, useEffect } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setAge("");
      setGrade("");
      setError(null);
      setLoading(false);
    }
  }, [open]);

  const validateInputs = () => {
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 5 || ageNum > 18) {
      setError("Please enter a valid age between 5 and 18");
      return false;
    }
    if (!grade.trim()) {
      setError("Please enter your grade");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateInputs()) return;

    try {
      setLoading(true);
      await onSubmit(age, grade);
      // Note: Don't close the modal here, let the parent handle it after successful submission
    } catch (err: any) {
      setError(err.message || "Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => {
      if (!isOpen && !loading) {
        onClose();
      }
    }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[400px] max-w-[90vw]">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Complete Your Profile
          </Dialog.Title>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  setError(null);
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="5"
                max="18"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                Grade
              </label>
              <input
                id="grade"
                type="text"
                placeholder="Enter your grade (e.g., 5th, 10th)"
                value={grade}
                onChange={(e) => {
                  setGrade(e.target.value);
                  setError(null);
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !age || !grade}
                className={`px-4 py-2 rounded text-white ${
                  loading || !age || !grade
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Creating Profile..." : "Create Profile"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CompleteProfile;
