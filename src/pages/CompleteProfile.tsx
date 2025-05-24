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
      setError("Please enter a valid age between 5 and 18.");
      return false;
    }
    if (!grade) {
      setError("Please select a grade.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateInputs()) return;
    setLoading(true);
    onSubmit(age, grade);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Overlay />
      <Dialog.Content>
        <Dialog.Title>Complete Your Profile</Dialog.Title>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <input
            type="text"
            placeholder="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
          {error && <p>{error}</p>}
          <button type="button" onClick={handleSubmit} disabled={loading}>
            Submit
          </button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CompleteProfile;