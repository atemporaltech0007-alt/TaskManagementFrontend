import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: 'alert' | 'confirm';
}

export default function Modal({ isOpen, onClose, onConfirm, title, message, type = 'alert' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          {type === 'confirm' ? (
            <>
              <button onClick={onClose} className="btn btn-secondary">Cancel</button>
              <button onClick={handleConfirm} className="btn btn-danger">Confirm</button>
            </>
          ) : (
            <button onClick={onClose} className="btn btn-primary">OK</button>
          )}
        </div>
      </div>
    </div>
  );
}
