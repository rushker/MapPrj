// src/components/SidebarInfoPanel.jsx
import React, { useState } from 'react';

export default function SidebarInfoPanel({ polygon, markers, onDeleteMarker }) {
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState(null);

  const handleDeleteClick = (idx) => {
    setConfirmDeleteIdx(idx);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteIdx !== null) {
      onDeleteMarker(confirmDeleteIdx);
      setConfirmDeleteIdx(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteIdx(null);
  };

  const renderPolygonInfo = () => (
    <section className="mb-6">
      <h3 className="text-md font-semibold">Polygon</h3>
      {polygon ? (
        <p className="text-sm text-gray-700">
          {polygon.geometry?.coordinates?.[0]?.length || 0} points
        </p>
      ) : (
        <p className="text-sm text-gray-500">No polygon drawn.</p>
      )}
    </section>
  );

  const renderMarkerItem = (marker, idx) => (
    <div key={idx} className="bg-gray-100 rounded p-2 mb-2 text-sm">
      <p><strong>Name:</strong> {marker.name || `Marker ${idx + 1}`}</p>
      <p><strong>Type:</strong> {marker.type || 'N/A'}</p>
      <p><strong>Coords:</strong> {marker.latlng.lat.toFixed(4)}, {marker.latlng.lng.toFixed(4)}</p>

      {marker.imageUrl && (
        <img
          src={marker.imageUrl}
          alt={`marker-${idx}`}
          className="w-full h-auto mt-1 rounded"
        />
      )}

      {confirmDeleteIdx === idx ? (
        <div className="mt-2">
          <button
            onClick={handleConfirmDelete}
            className="text-red-500 text-xs mr-2 hover:underline"
          >
            Confirm Delete
          </button>
          <button
            onClick={handleCancelDelete}
            className="text-gray-500 text-xs hover:underline"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => handleDeleteClick(idx)}
          className="text-red-500 text-xs mt-1 hover:underline"
        >
          Delete
        </button>
      )}
    </div>
  );

  return (
    <aside className="w-72 bg-white shadow-lg p-4 overflow-y-auto h-full border-l border-gray-300">
      <h2 className="text-lg font-bold mb-4">Map Details</h2>

      {renderPolygonInfo()}

      <section>
        <h3 className="text-md font-semibold mb-2">Markers ({markers.length})</h3>
        {markers.length === 0 ? (
          <p className="text-sm text-gray-500">No markers added yet.</p>
        ) : (
          markers.map(renderMarkerItem)
        )}
      </section>
    </aside>
  );
}
