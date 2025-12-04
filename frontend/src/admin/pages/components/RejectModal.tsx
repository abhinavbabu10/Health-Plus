import React from "react";

interface RejectModalProps {
  reason: string;
  setReason: (reason: string) => void;
  onClose: () => void;
  onReject: () => void;
}

const RejectModal: React.FC<RejectModalProps> = ({
  reason,
  setReason,
  onClose,
  onReject,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Reject Doctor Application
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Please provide a reason for rejecting this doctor's application. This
          will be shared with the doctor.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
          rows={4}
          placeholder="Enter rejection reason..."
          autoFocus
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onReject}
            disabled={!reason.trim()}
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              reason.trim()
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Reject Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;