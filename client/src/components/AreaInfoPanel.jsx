//src/components/AreaInfoPanel.jsx
export default function AreaInfoPanel({ area, onPublish }) {
  return (
    <div className="p-2 border rounded-lg bg-gray-100 space-y-2">
      <div><strong>ID:</strong> {area._id}</div>
      <div><strong>Name:</strong> {area.name}</div>
      <div><strong>Type:</strong> {area.type}</div>
      <button
        onClick={() => onPublish(area._id)}
        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        Publish
      </button>
    </div>
  );
}
