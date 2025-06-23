// src/components/ConfirmDialog.jsx
const ConfirmDialog = ({ isOpen, title, message, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-[400px]">
        <h2 className="text-lg font-semibold mb-3">{title || 'Xác nhận'}</h2>
        <p>{message || 'Bạn có chắc chắn thực hiện hành động này không?'}</p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border text-gray-700"
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
