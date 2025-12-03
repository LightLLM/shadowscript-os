import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { TerminalLine } from '../../types/app.types'
import styles from './Terminal.module.css'

export interface TerminalProps {
  onCommand: (command: string) => void;
  history: TerminalLine[];
}

export default function Terminal({ onCommand, history }: TerminalProps) {
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    if (input.trim()) {
      onCommand(input.trim())
      setCommandHistory(prev => [...prev, input.trim()])
      setInput('')
      setHistoryIndex(-1)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setInput('')
        } else {
          setHistoryIndex(newIndex)
          setInput(commandHistory[newIndex])
        }
      }
    }
  }

  const getLineClass = (type: TerminalLine['type']) => {
    switch (type) {
      case 'error': return styles.error
      case 'ghost': return styles.ghost
      case 'input': return styles.input
      default: return styles.output
    }
  }

  return (
    <div className={styles.terminal}>
      <div className={styles.output} ref={outputRef}>
        {history.map((line, index) => (
          <div key={index} className={getLineClass(line.type)}>
            {line.type === 'input' && <span className={styles.prompt}>{'>'} </span>}
            {line.content}
          </div>
        ))}
      </div>
      <div className={styles.inputLine}>
        <span className={styles.prompt}>{'>'} </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.inputField}
          spellCheck={false}
          autoComplete="off"
        />
        <span className={styles.cursor}>_</span>
      </div>
    </div>
  )
}
