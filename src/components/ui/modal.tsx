import React from "react";

interface ModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

const Modal = ({ onConfirm, onCancel, children }: ModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
      <div className="mb-4">{children}</div>
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={onConfirm}
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
);

export default Modal;