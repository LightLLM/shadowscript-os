import { useState, useEffect } from 'react'
import { DeadMailState, Email } from '../../types/app.types'
import { VirtualFileSystem } from '../../services/mcp/VirtualFileSystem'
import Window from '../../components/Window/Window'
import Inbox from './Inbox'
import Compose from './Compose'
import MessageReader from './MessageReader'
import styles from './DeadMail.module.css'

export interface DeadMailProps {
  onClose: () => void;
  filesystem: VirtualFileSystem;
}

export default function DeadMail({ onClose, filesystem }: DeadMailProps) {
  const [state, setState] = useState<DeadMailState>({
    inbox: [],
    currentView: 'inbox',
    selectedEmail: null
  })

  // Load messages from filesystem on mount
  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const dirExists = await filesystem.exists('/deadmail')
      if (!dirExists) {
        await filesystem.createDirectory('/deadmail')
        return
      }

      const files = await filesystem.listDirectory('/deadmail')
      const emails: Email[] = []

      for (const file of files) {
        if (file.type === 'file' && file.name.endsWith('.json')) {
          try {
            const content = await filesystem.readFile(file.path)
            const email = JSON.parse(content) as Email
            emails.push(email)
          } catch (error) {
            console.error(`░▒▓ Failed to summon email ${file.name} from the void:`, error)
          }
        }
      }

      // Sort by timestamp, newest first
      emails.sort((a, b) => b.timestamp - a.timestamp)

      setState(prev => ({
        ...prev,
        inbox: emails
      }))
    } catch (error) {
      console.error('░▒▓█ ERROR: Failed to load messages from the afterlife:', error)
      // Don't show alert on initial load failure, just log it
    }
  }

  const handleViewChange = (view: 'inbox' | 'compose' | 'read') => {
    setState(prev => ({
      ...prev,
      currentView: view
    }))
  }

  const handleEmailSelect = (email: Email) => {
    // Mark as read
    const updatedEmail = { ...email, isRead: true }
    
    setState(prev => ({
      ...prev,
      currentView: 'read',
      selectedEmail: updatedEmail,
      inbox: prev.inbox.map(e => e.id === email.id ? updatedEmail : e)
    }))

    // Update in filesystem
    updateEmailInFilesystem(updatedEmail)
  }

  const handleSendEmail = async (email: Email) => {
    try {
      const filename = `${email.id}.json`
      const path = `/deadmail/${filename}`

      // Ensure directory exists
      const dirExists = await filesystem.exists('/deadmail')
      if (!dirExists) {
        await filesystem.createDirectory('/deadmail')
      }

      // Save email
      await filesystem.createFile(path, JSON.stringify(email, null, 2))

      // Add to inbox
      setState(prev => ({
        ...prev,
        inbox: [email, ...prev.inbox],
        currentView: 'inbox'
      }))

      return true
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error('░▒▓█ ERROR: Failed to send email to the void:', error)
      alert(`░▒▓█ ERROR: Message lost in the ether! █▓▒░\n\n${errorMsg}`)
      return false
    }
  }

  const updateEmailInFilesystem = async (email: Email) => {
    try {
      const filename = `${email.id}.json`
      const path = `/deadmail/${filename}`
      await filesystem.updateFile(path, JSON.stringify(email, null, 2))
    } catch (error) {
      console.error('░▒▓ Failed to update email in the void:', error)
      // Silent failure for read status updates - not critical
    }
  }

  const handleBackToInbox = () => {
    setState(prev => ({
      ...prev,
      currentView: 'inbox',
      selectedEmail: null
    }))
  }

  return (
    <Window title="DEADMAIL" onClose={onClose} width="800px">
      <div className={styles.content}>
        {state.currentView === 'inbox' && (
          <Inbox
            emails={state.inbox}
            onEmailSelect={handleEmailSelect}
            onCompose={() => handleViewChange('compose')}
          />
        )}
        {state.currentView === 'compose' && (
          <Compose
            onSend={handleSendEmail}
            onCancel={handleBackToInbox}
          />
        )}
        {state.currentView === 'read' && state.selectedEmail && (
          <MessageReader
            email={state.selectedEmail}
            onBack={handleBackToInbox}
          />
        )}
      </div>
    </Window>
  )
}
