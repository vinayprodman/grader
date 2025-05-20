import React from 'react';
import '../../styles/ChapterDetail.css';

interface PopModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const PopModal: React.FC<PopModalProps> = ({
  isOpen,
  title = 'Start Quiz',
  message,
  confirmText = 'Start',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-message">{message}</div>
        <div className="modal-actions">
          <button className="btn start-quiz-btn" onClick={onConfirm}>{confirmText}</button>
          <button className="btn btn-ghost" onClick={onCancel}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
};

export default PopModal;
