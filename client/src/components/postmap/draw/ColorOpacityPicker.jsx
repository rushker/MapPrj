// src/components/ui/ColorOpacityPicker.jsx
import { RgbaColorPicker } from "react-colorful";

export default function ColorOpacityPicker({
  label,
  color = { r: 51, g: 136, b: 255, a: 1 },
  onChange,
}) {
  const handleColorChange = (newColor) => {
    onChange?.(newColor);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-4">
        <div className="w-28 h-28">
          <RgbaColorPicker color={color} onChange={handleColorChange} />
        </div>
        <div className="flex-1 space-y-2">
          <div
            className="h-10 w-full rounded"
            style={{
              backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
            }}
          />
          <label className="block text-xs text-gray-600">Opacity: {Math.round(color.a * 100)}%</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={color.a}
            onChange={(e) =>
              handleColorChange({ ...color, a: parseFloat(e.target.value) })
            }
            className="w-full accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
