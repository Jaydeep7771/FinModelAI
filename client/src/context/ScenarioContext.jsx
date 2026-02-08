import { createContext, useContext, useMemo, useState } from 'react';

const ScenarioContext = createContext(null);

export function ScenarioProvider({ children }) {
  const [scenarios, setScenarios] = useState(() => JSON.parse(localStorage.getItem('finmodel-scenarios') || '{}'));

  const saveScenario = (modelId, payload) => {
    const next = { ...scenarios, [modelId]: payload };
    setScenarios(next);
    localStorage.setItem('finmodel-scenarios', JSON.stringify(next));
  };

  const value = useMemo(() => ({ scenarios, saveScenario }), [scenarios]);

  return <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>;
}

export const useScenario = () => useContext(ScenarioContext);
