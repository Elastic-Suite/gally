import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface EventLogEntry {
  id: number;
  type: string;
  detail: string;
  time: string;
}

interface EventLogContextType {
  entries: EventLogEntry[];
  log: (type: string, detail: string) => void;
  visible: boolean;
  toggleVisible: () => void;
}

const EventLogContext = createContext<EventLogContextType | null>(null);

let nextId = 0;

export function EventLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<EventLogEntry[]>([]);
  const [visible, setVisible] = useState(false);

  const log = useCallback((type: string, detail: string) => {
    const entry: EventLogEntry = {
      id: nextId++,
      type,
      detail,
      time: new Date().toLocaleTimeString(),
    };
    setEntries(prev => [entry, ...prev].slice(0, 50));
  }, []);

  const toggleVisible = useCallback(() => setVisible(v => !v), []);

  return (
    <EventLogContext.Provider value={{ entries, log, visible, toggleVisible }}>
      {children}
    </EventLogContext.Provider>
  );
}

export function useEventLog() {
  const ctx = useContext(EventLogContext);
  if (!ctx) throw new Error('useEventLog must be used inside EventLogProvider');
  return ctx;
}
