import { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { Personality, getRandomMessage, getContextualResponse } from './messageTemplates'
import styles from './GhostAgent.module.css'

export interface GhostAgentProps {
  onMessage: (message: string) => void;
  triggerInterval?: [number, number]; // min/max seconds
  personality?: Personality;
  showGreeting?: boolean; // Control when to show greeting
}

export interface GhostAgentHandle {
  respondToCommand: (command: string) => void;
}

const GhostAgent = forwardRef<GhostAgentHandle, GhostAgentProps>(({ 
  onMessage, 
  triggerInterval = [30, 120],
  personality = 'mischievous',
  showGreeting = false
}, ref) => {
  const [currentPersonality, setCurrentPersonality] = useState<Personality>(personality)
  const [hasGreeted, setHasGreeted] = useState(false)

  // Expose method to respond to commands
  useImperativeHandle(ref, () => ({
    respondToCommand: (command: string) => {
      const response = getContextualResponse(command, currentPersonality)
      onMessage(response)
    }
  }))

  useEffect(() => {
    // Initial greeting after boot sequence completes
    if (showGreeting && !hasGreeted) {
      const greetingTimeout = setTimeout(() => {
        const greeting = '👻 Greetings, mortal... I am the Ghost Agent of ShadowScript OS.\n   I\'ll be your guide through these haunted digital halls...\n   But beware - I may play tricks on you from time to time... 😈'
        onMessage(greeting)
        setHasGreeted(true)
      }, 2000)

      return () => clearTimeout(greetingTimeout)
    }
  }, [onMessage, showGreeting, hasGreeted])

  useEffect(() => {
    let timeoutId: number | null = null
    let isActive = true

    const triggerRandomMessage = () => {
      if (!isActive) return

      const message = getRandomMessage(currentPersonality)
      onMessage(message)

      // Randomly shift personality (30% chance)
      if (Math.random() < 0.3) {
        const personalities: Personality[] = ['mischievous', 'ominous', 'playful']
        const newPersonality = personalities[Math.floor(Math.random() * personalities.length)]
        setCurrentPersonality(newPersonality)
      }

      // Schedule next message
      if (isActive) {
        const [min, max] = triggerInterval
        const nextDelay = (min + Math.random() * (max - min)) * 1000
        timeoutId = window.setTimeout(triggerRandomMessage, nextDelay)
      }
    }

    // Start first random message
    const [min, max] = triggerInterval
    const initialDelay = (min + Math.random() * (max - min)) * 1000
    timeoutId = window.setTimeout(triggerRandomMessage, initialDelay)

    return () => {
      isActive = false
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }
  }, [currentPersonality, onMessage, triggerInterval])

  return (
    <div className={styles.ghostAgent}>
      <div className={styles.ghostIcon}>👻</div>
    </div>
  )
})

GhostAgent.displayName = 'GhostAgent'

export default GhostAgent
