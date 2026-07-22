import { useEventLog } from '../contexts/EventLogContext';

export default function EventLog() {
  const { entries, visible, toggleVisible } = useEventLog();

  if (!visible) {
    return (
      <button className="event-log-toggle" onClick={toggleVisible}>
        📊 Events ({entries.length})
      </button>
    );
  }

  return (
    <>
      <button className="event-log-toggle" onClick={toggleVisible} style={{ bottom: '270px' }}>
        ✕ Close
      </button>
      <div className="event-log">
        <div className="event-log-title">🔴 Tracking Events (live)</div>
        {entries.length === 0 && <div style={{ opacity: 0.5 }}>No events yet…</div>}
        {entries.map(e => (
          <div key={e.id} className="event-log-entry">
            <span style={{ color: '#ffab91' }}>{e.time}</span>{' '}
            <span style={{ color: '#80cbc4' }}>[{e.type}]</span>{' '}
            {e.detail}
          </div>
        ))}
      </div>
    </>
  );
}
