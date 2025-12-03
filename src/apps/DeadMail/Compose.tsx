import { useState } from 'react'
import { Email } from '../../types/app.types'
import styles from './Compose.module.css'

export interface ComposeProps {
  onSend: (email: Email) => Promise<boolean>;
  onCancel: () => void;
}

export default function Compose({ onSend, onCancel }: ComposeProps) {
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSending, setIsSending] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!recipient.trim()) {
      newErrors.recipient = 'Recipient is required'
    } else if (!recipient.includes('@')) {
      newErrors.recipient = 'Invalid email format'
    }

    if (!subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!body.trim()) {
      newErrors.body = 'Message body is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSend = async () => {
    if (!validateForm()) {
      return
    }

    setIsSending(true)

    const email: Email = {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from: 'you@shadowscript.os',
      to: recipient.trim(),
      subject: subject.trim(),
      body: body.trim(),
      timestamp: Date.now(),
      isRead: true // Sent emails are marked as read
    }

    const success = await onSend(email)
    
    setIsSending(false)

    if (success) {
      // Form will be closed by parent component
    } else {
      setErrors({ general: 'Failed to send message. Please try again.' })
    }
  }

  return (
    <div className={styles.compose}>
      <div className={styles.header}>
        <h2 className={styles.title}>COMPOSE MESSAGE</h2>
      </div>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>TO:</label>
          <input
            type="text"
            className={`${styles.input} ${errors.recipient ? styles.inputError : ''}`}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="recipient@domain.os"
            disabled={isSending}
          />
          {errors.recipient && (
            <span className={styles.errorText}>{errors.recipient}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>SUBJECT:</label>
          <input
            type="text"
            className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Message subject"
            disabled={isSending}
          />
          {errors.subject && (
            <span className={styles.errorText}>{errors.subject}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>MESSAGE:</label>
          <textarea
            className={`${styles.textarea} ${errors.body ? styles.inputError : ''}`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your haunted message here..."
            rows={10}
            disabled={isSending}
          />
          {errors.body && (
            <span className={styles.errorText}>{errors.body}</span>
          )}
        </div>

        {errors.general && (
          <div className={styles.generalError}>
            {errors.general}
          </div>
        )}

        <div className={styles.actions}>
          <button
            className={styles.sendButton}
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? '📤 Sending...' : '📤 Send'}
          </button>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isSending}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
