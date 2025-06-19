// src/components/postmap/PostMapWrapper.jsx
import { useState, useEffect, useRef } from 'react';
import LeafletMap from './draw/LeafletMap';
import SidebarContainer from './sidebars/SidebarContainer';
import { useTempAreaId } from '../../hooks/local/useTempAreaId';
import { useAreaContext } from '../../context/AreaContext';
import useAutoSave from '../../hooks/local/useAutoSave';
import { useEnsureValidAreaId } from '../../utils/useEnsureValidAreaId';
import { useSidebarContext } from '../../context/SidebarContext';
import {
  createAreaHandler,
  updatePolygonHandler,
  updateEntityGeometryHandler,
  createEntityHandler,
  saveAreaMetadataHandler,
  saveEntityMetadataHandler,
} from './postmapHandlers';

export default function PostMapWrapper({  }) {
  const mapRef = useRef(null);
  useEnsureValidAreaId(() => null, 18);

  const { saveAreaId } = useTempAreaId();
  const {
    areaId,
    areaMetadata,
    setAreaMetadata,
    addEntity,
    updateEntityMetadata: contextUpdateEntityMetadata,
    updateEntityGeometry: contextUpdateEntityGeometry,
    clearEntities,
    isEditMode,
  } = useAreaContext();

  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [isCreatingArea, setIsCreatingArea] = useState(false);
  useAutoSave();

  const { openSidebar } = useSidebarContext();

  useEffect(() => {
    setSelectedEntityId(null);
    clearEntities?.();
  }, [areaId]);
  const handleCreateArea = createAreaHandler({
    mapRef,
    setIsCreatingArea,
    saveAreaId,
    openSidebar,
  });
  return (
      <div className="flex h-screen w-full relative">
        <div className="flex-1">
          <LeafletMap
            areaMetadata={areaMetadata}
            selectedEntityId={selectedEntityId}
            onSelectEntity={setSelectedEntityId}
            isEditMode={isEditMode}
            enableDraw={isEditMode}
            drawShape={null}
            enableEdit={isEditMode}
            enableDrag={isEditMode}
            enableRemove={isEditMode}
            onCreateArea={handleCreateArea} // SỬA THÀNH HANDLER ĐÃ TẠO
            onUpdatePolygon={({ coordinates }) => 
            updatePolygonHandler({ areaId, coordinates, setAreaMetadata })
          }
          onUpdateEntityGeometry={({ entityId, coordinates }) => 
            updateEntityGeometryHandler({
              areaId,
              entityId,
              coordinates,
              contextUpdateEntityGeometry, // THÊM DÒNG NÀY
            })
          }
            onCreateEntity={createEntityHandler({
              areaId,
              addEntity,
              setSelectedEntityId,
            })}
            isCreatingArea={isCreatingArea}
            mapRef={mapRef}
          />
        </div>

        <SidebarContainer
          onSaveAreaMetadata={(metadata) =>
            saveAreaMetadataHandler({ areaId, metadata, setAreaMetadata })
          }
          onSaveEntity={(entityId, metadata) =>
            saveEntityMetadataHandler({
              areaId,
              entityId,
              metadata,
              contextUpdateEntityMetadata,
            })
          }
        />
      </div>
  );
}