import React from "react";

type RejectModalProps = {
  reason: string;
  setReason: (value: string) => void;
  onClose: () => void;
  onReject: () => void;
};

const RejectModal: React.FC<RejectModalProps> = ({ reason, setReason, onClose, onReject }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40">
    <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
      <h2 className="text-lg font-semibold mb-3">Reject Doctor</h2>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Enter rejection reason..."
        className="w-full h-24 border rounded p-2"
      />
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onReject}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reject
        </button>
      </div>
    </div>
  </div>
);

export default RejectModal;
