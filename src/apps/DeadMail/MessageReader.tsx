import { Email } from '../../types/app.types'
import styles from './MessageReader.module.css'

export interface MessageReaderProps {
  email: Email;
  onBack: () => void;
}

export default function MessageReader({ email, onBack }: MessageReaderProps) {
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${month}-${day}-${year} ${hours}:${minutes}`
  }

  return (
    <div className={styles.messageReader}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Inbox
        </button>
      </div>

      <div className={styles.messageHeader}>
        <div className={styles.headerRow}>
          <span className={styles.headerLabel}>FROM:</span>
          <span className={styles.headerValue}>{email.from}</span>
        </div>
        <div className={styles.headerRow}>
          <span className={styles.headerLabel}>TO:</span>
          <span className={styles.headerValue}>{email.to}</span>
        </div>
        <div className={styles.headerRow}>
          <span className={styles.headerLabel}>DATE:</span>
          <span className={styles.headerValue}>{formatTimestamp(email.timestamp)}</span>
        </div>
        <div className={styles.headerRow}>
          <span className={styles.headerLabel}>SUBJECT:</span>
          <span className={styles.headerValue}>{email.subject}</span>
        </div>
      </div>

      <div className={styles.messageBody}>
        <div className={styles.bodyContent}>
          {email.body.split('\n').map((line, index) => (
            <p key={index} className={styles.bodyLine}>
              {line || '\u00A0'}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
