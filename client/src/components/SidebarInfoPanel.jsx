// src/components/SidebarInfoPanel.jsx
import React, { useState } from 'react';

/**
 * SidebarInfoPanel
 * Props:
 *  - polygon: array of [lat, lng]
 *  - markers: array of { id?, lat, lng, name, type, description, imageUrl }
 *  - onDeleteMarker: fn(markerId or index)
 */
export default function SidebarInfoPanel({ polygon = [], markers = [], onDeleteMarker }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDeleteClick = (id) => setConfirmDelete(id);
  const handleConfirm = () => {
    onDeleteMarker(confirmDelete);
    setConfirmDelete(null);
  };
  const handleCancel = () => setConfirmDelete(null);

  const pointCount = polygon.length;

  return (
    <aside className="w-72 bg-white shadow-lg p-4 overflow-y-auto h-full border-l border-gray-300">
      <h2 className="text-lg font-bold mb-4">Map Details</h2>

      <section className="mb-6">
        <h3 className="font-semibold">Polygon</h3>
        <p className="text-sm text-gray-700">{pointCount} points</p>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Markers ({markers.length})</h3>
        {markers.length === 0 ? (
          <p className="text-sm text-gray-500">No markers added.</p>
        ) : (
          markers.map((marker, idx) => (
            <div key={marker.id || idx} className="mb-4 p-2 bg-gray-100 rounded">
              <p><strong>Name:</strong> {marker.name || 'Untitled'}</p>
              <p><strong>Type:</strong> {marker.type || 'N/A'}</p>
              <p><strong>Coords:</strong> {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}</p>
              {marker.imageUrl && (
                <img
                  src={marker.imageUrl}
                  alt={marker.name}
                  className="mt-1 w-full h-auto rounded"
                />
              )}

              {confirmDelete === (marker.id ?? idx) ? (
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={handleConfirm}
                    className="text-red-600 text-xs"
                  >Confirm</button>
                  <button
                    onClick={handleCancel}
                    className="text-gray-600 text-xs"
                  >Cancel</button>
                </div>
              ) : (
                <button
                  onClick={() => handleDeleteClick(marker.id ?? idx)}
                  className="text-red-600 text-xs mt-2"
                >Delete</button>
              )}
            </div>
          ))
        )}
      </section>
    </aside>
);
}
