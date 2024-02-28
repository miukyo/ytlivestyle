import React from "react";

interface ModalProps {
  label?: string;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = ({ label, children, isOpen, setIsOpen }: ModalProps) => {
  return (
    <>
      {label ? (
        <label className="btn btn-primary" htmlFor="modal-1" onClick={() => setIsOpen(!isOpen)}>
          {label}
        </label>
      ) : null}

      <input className="modal-state" id="modal-1" type="checkbox" readOnly checked={isOpen} />
      <div className="modal">
        <label
          className="modal-overlay"
          htmlFor="modal-1"
          onClick={() => setIsOpen(!isOpen)}></label>
        <div className="modal-content flex flex-col max-w-md gap-5">
          <label
            htmlFor="modal-1"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setIsOpen(!isOpen)}>
            ✕
          </label>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
