import { Email } from '../../types/app.types'
import styles from './Inbox.module.css'

export interface InboxProps {
  emails: Email[];
  onEmailSelect: (email: Email) => void;
  onCompose: () => void;
}

export default function Inbox({ emails, onEmailSelect, onCompose }: InboxProps) {
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${month}-${day}-${year} ${hours}:${minutes}`
  }

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className={styles.inbox}>
      <div className={styles.header}>
        <h2 className={styles.title}>INBOX</h2>
        <button className={styles.composeButton} onClick={onCompose}>
          [+] Compose
        </button>
      </div>

      {emails.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No messages in your inbox.</p>
          <p className={styles.ghostText}>👻 The dead are silent... for now.</p>
        </div>
      ) : (
        <div className={styles.messageList}>
          <div className={styles.listHeader}>
            <span className={styles.columnFrom}>FROM</span>
            <span className={styles.columnSubject}>SUBJECT</span>
            <span className={styles.columnDate}>DATE</span>
          </div>
          {emails.map(email => (
            <div
              key={email.id}
              className={`${styles.messageItem} ${!email.isRead ? styles.unread : ''}`}
              onClick={() => onEmailSelect(email)}
            >
              <span className={styles.columnFrom}>
                {!email.isRead && <span className={styles.unreadIndicator}>●</span>}
                {truncateText(email.from, 20)}
              </span>
              <span className={styles.columnSubject}>
                {truncateText(email.subject, 35)}
              </span>
              <span className={styles.columnDate}>
                {formatTimestamp(email.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
