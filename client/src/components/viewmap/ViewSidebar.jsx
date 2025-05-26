// src/components/viewmap/ViewSidebar.jsx
import { useState } from 'react';

export default function ViewSidebar({ area, khuCs, markers }) {
  const [tab, setTab] = useState('info');

  return (
    <div className="w-[300px] bg-white shadow-lg h-screen overflow-y-auto border-l z-[1000]">
      <div className="flex border-b">
        {['info', 'khuCs', 'markers'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium ${
              tab === t ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            {t === 'info' ? 'Thông tin' : t === 'khuCs' ? 'Khu vực C' : 'Markers'}
          </button>
        ))}
      </div>

      <div className="p-4 text-sm">
        {tab === 'info' && (
          <>
            <h2 className="font-semibold text-lg mb-2">{area?.name || 'Chưa có tên'}</h2>
            <p><strong>Mô tả:</strong> {area?.description || 'Không có'}</p>
          </>
        )}

        {tab === 'khuCs' && (
          <>
            <h3 className="font-medium mb-2">Danh sách Khu vực C</h3>
            <ul className="space-y-1">
              {khuCs.length ? (
                khuCs.map((khu) => (
                  <li key={khu._id} className="p-2 border rounded">{khu.name}</li>
                ))
              ) : (
                <p>Không có khu vực C.</p>
              )}
            </ul>
          </>
        )}

        {tab === 'markers' && (
          <>
            <h3 className="font-medium mb-2">Danh sách Markers</h3>
            <ul className="space-y-1">
              {markers.length ? (
                markers.map((m) => (
                  <li key={m._id} className="p-2 border rounded">{m.name}</li>
                ))
              ) : (
                <p>Không có marker.</p>
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
