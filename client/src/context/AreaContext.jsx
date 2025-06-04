// contexts/AreaContext.jsx
import { createContext, useContext, useState } from 'react';

const AreaContext = createContext();

export function AreaProvider({ children }) {
  const [areaId, setAreaId] = useState(null);
  const [areaMetadata, setAreaMetadata] = useState(null);
  const [entities, setEntities] = useState([]);

  const value = {
    areaId,
    setAreaId,
    areaMetadata,
    setAreaMetadata,
    entities,
    setEntities,
    addEntity: (entity) => setEntities(prev => [...prev, entity]),
    updateEntity: (id, updates) => setEntities(prev => 
      prev.map(e => e._id === id ? {...e, ...updates} : e)
    ),
    removeEntity: (id) => setEntities(prev => prev.filter(e => e._id !== id))
  };

  return <AreaContext.Provider value={value}>{children}</AreaContext.Provider>;
}

export const useAreaContext = () => useContext(AreaContext);