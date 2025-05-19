//src/components/MarkerSidebar.jsx
export default function MarkerSidebar({ markers, onSelect }) {
  return (
    <div className="space-y-2">
      {markers.map((m) => (
        <div
          key={m._id}
          className="border p-2 rounded hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelect(m)}
        >
          <strong>{m.name}</strong>
          <div className="text-sm text-gray-600">{m.type}</div>
        </div>
      ))}
    </div>
  );
}
