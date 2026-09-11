import { useTranslation } from 'react-i18next';
import { useEventLog } from '../contexts/EventLogContext';

export default function EventLog() {
  const { t } = useTranslation('demo');
  const { entries, visible, toggleVisible } = useEventLog();

  if (!visible) {
    return (
      <button className="event-log-toggle" onClick={toggleVisible}>
        {t('eventLog.toggleShow', { count: entries.length })}
      </button>
    );
  }

  return (
    <>
      <button className="event-log-toggle" onClick={toggleVisible} style={{ bottom: '270px' }}>
        {t('eventLog.close')}
      </button>
      <div className="event-log">
        <div className="event-log-title">{t('eventLog.title')}</div>
        {entries.length === 0 && <div style={{ opacity: 0.5 }}>{t('eventLog.empty')}</div>}
        {entries.map(e => (
          <div key={e.id} className="event-log-entry">
            <span style={{ color: '#ffab91' }}>{e.time}</span>{' '}
            <span style={{ color: '#80cbc4' }}>[{e.type}]</span>{' '}
            {e.detail}
            {e.meaning && (
              <div className="event-log-meaning">💡 {e.meaning}</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
