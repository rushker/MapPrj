// components/sidebars/areas/OpacitySlider.jsx
export default function OpacitySlider({ value = 0.2, onChange, label = 'Độ trong suốt viền:' }) {
  return (
    <div className="mt-4">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-orange-500"
      />
      <div className="text-sm text-gray-600 mt-1 text-right">{(value * 100).toFixed(0)}%</div>
    </div>
  );
}
