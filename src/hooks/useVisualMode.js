import { useState } from 'react';

export default function useVisualMode(initial) {
  // const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

const transition = (newMode, replace = false) => {
    if(replace) {
      setHistory([...history.slice(0, -1), newMode]);
      return;
    }
    const newHistory = [...history];
    newHistory.push(newMode);
    setHistory(newHistory);
 };

 const back = () => {
    if (history.length < 2) {
      return;
    }
    setHistory(prev => {
      const newHistory = [...prev];
      newHistory.pop();
      setHistory(newHistory);
      return newHistory;

    });
  };

  const mode = history.slice(-1)[0];

  return { mode, transition, back};
}