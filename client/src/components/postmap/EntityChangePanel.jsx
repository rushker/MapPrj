// src/components/postmap/EntityChangePanel.jsx

import { useState, useRef, useEffect } from 'react';
import { useAreaContext } from '../../context/AreaContext';
import { ChevronDown, ChevronUp, ListChecks, Move, X } from 'lucide-react';

export default function EntityChangePanel({ changes, onSelectEntity }) {
  const { entities: allEntities } = useAreaContext();
  const panelRef = useRef(null);

  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('entityPanelPos');
    return saved ? JSON.parse(saved) : { x: 16, y: 16 };
  });

  const [open, setOpen] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const { area, entities: changedEntities = [] } = changes ?? {};
  const changedIds = new Set(changedEntities?.map((e) => e._id));

  const handleMouseDown = (e) => {
    setDragging(true);
    const rect = panelRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
      localStorage.setItem('entityPanelPos', JSON.stringify(position));
    }
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const rect = panelRef.current.getBoundingClientRect();
    offset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
    setDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - offset.current.x,
      y: touch.clientY - offset.current.y,
    });
  };

  const handleTouchEnd = () => {
    if (dragging) {
      setDragging(false);
      localStorage.setItem('entityPanelPos', JSON.stringify(position));
    }
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragging]);

  const handleTogglePanel = () => {
    if (open) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setOpen(false);
        setIsAnimatingOut(false);
      }, 300); // match animation duration
    } else {
      setOpen(true);
    }
  };

  if (!changes) return null;

  return (
    <div
      ref={panelRef}
      className="fixed z-[1000]"
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* 🎯 Floating button */}
      <button
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleTogglePanel}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition cursor-move touch-none"
      >
        <Move className="w-4 h-4 opacity-70" />
        <ListChecks className="w-4 h-4" />
        {open && !isAnimatingOut ? 'Ẩn thay đổi' : 'Xem thay đổi'}
        {open && !isAnimatingOut ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {/* Panel content */}
      {open && (
        <div
          className={`
            mt-2 w-[320px] max-h-[60vh] overflow-y-auto p-4 bg-white border shadow-xl rounded-lg space-y-4 relative
            ${isAnimatingOut ? 'animate-slide-out-right' : 'animate-slide-in-right'}
          `}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
            onClick={handleTogglePanel}
          >
            <X className="w-4 h-4" />
          </button>

          {area && (
            <div className="text-red-600 font-semibold">⚠️ Khu vực đã thay đổi</div>
          )}

          {changedEntities.length > 0 ? (
            <div>
              <h2 className="font-bold mb-1">📝 Entity đã chỉnh sửa ({changedEntities.length})</h2>
              <ul className="list-disc pl-6 space-y-1">
                {changedEntities.map((e) => (
                  <li
                    key={e._id}
                    className="cursor-pointer hover:underline text-blue-600"
                    onClick={() => onSelectEntity?.(e._id)}
                  >
                    {e.name || 'Không tên'}{' '}
                    <span className="text-xs text-gray-500">
                      ({e.metadataUpdated ? 'metadata' : ''} {e.geometryUpdated ? 'geometry' : ''})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-gray-500 italic">Không có thay đổi ở entity</div>
          )}

          <div>
            <h2 className="font-bold mt-3">📦 Tất cả entity ({allEntities.length})</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              {allEntities.map((e) => (
                <li key={e._id}>
                  {e.name || 'Không tên'}{' '}
                  {changedIds.has(e._id) && (
                    <span className="text-orange-500 text-sm">(đã chỉnh)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
