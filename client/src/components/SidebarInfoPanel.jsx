  // src/components/SidebarInfoPanel.jsx
  import React, { useState } from 'react';

  export default function SidebarInfoPanel({ polygon = null, markers = [], onDeleteMarker }) {
    const [confirmDeleteIdx, setConfirmDeleteIdx] = useState(null);
  
    const handleDeleteClick = (idx) => setConfirmDeleteIdx(idx);
    const handleConfirmDelete = () => {
      if (confirmDeleteIdx !== null) {
        onDeleteMarker(confirmDeleteIdx);
        setConfirmDeleteIdx(null);
      }
    };
    const handleCancelDelete = () => setConfirmDeleteIdx(null);
  
    const getPolygonPointCount = () => {
      return (
        polygon?.geometry?.coordinates?.[0]?.length || 0
      );
    };
  
    const renderPolygonInfo = () => (
      <section className="mb-6">
        <h3 className="text-md font-semibold">Polygon</h3>
        <p className="text-sm text-gray-700">
          {getPolygonPointCount()} points
        </p>
      </section>
    );
  
    const renderMarkerItem = (marker, idx) => {
      const lat = marker?.latlng?.lat ?? null;
      const lng = marker?.latlng?.lng ?? null;
  
      return (
        <div key={idx} className="bg-gray-100 rounded p-2 mb-2 text-sm">
          <p><strong>Name:</strong> {marker.name || `Marker ${idx + 1}`}</p>
          <p><strong>Type:</strong> {marker.type || 'N/A'}</p>
          {lat !== null && lng !== null && (
            <p><strong>Coords:</strong> {lat.toFixed(4)}, {lng.toFixed(4)}</p>
          )}
  
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
    };
  
    return (
      <aside className="w-72 bg-white shadow-lg p-4 overflow-y-auto h-full border-l border-gray-300">
        <h2 className="text-lg font-bold mb-4">Map Details</h2>
  
        {renderPolygonInfo()}
  
        <section>
          <h3 className="text-md font-semibold mb-2">
            Markers ({markers?.length || 0})
          </h3>
          {markers?.length === 0 ? (
            <p className="text-sm text-gray-500">No markers added yet.</p>
          ) : (
            markers.map(renderMarkerItem)
          )}
        </section>
      </aside>
    );
  }
  