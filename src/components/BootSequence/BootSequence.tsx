import { useEffect, useState } from 'react'
import styles from './BootSequence.module.css'

export interface BootSequenceProps {
  onComplete: () => void;
}

const bootSteps = [
  '╔═══════════════════════════════════════════════════════════╗',
  '║                                                           ║',
  '║   SHADOWSCRIPT BIOS v1.0.0                                ║',
  '║   Copyright (C) 2024 Haunted Systems Inc.                 ║',
  '║                                                           ║',
  '╚═══════════════════════════════════════════════════════════╝',
  '',
  'Performing POST (Power-On Self Test)...',
  'Memory Test: 640K OK',
  'Extended Memory: 15360K OK',
  'Detecting Spectral Entities... Found: 1 Ghost',
  '',
  'Loading SHADOWSCRIPT OS...',
  '█░░░░░░░░░ 10%',
  '███░░░░░░░ 30%',
  '█████░░░░░ 50%',
  '███████░░░ 70%',
  '█████████░ 90%',
  '██████████ 100%',
  '',
  '╔═══════════════════════════════════════════════════════════╗',
  '║                                                           ║',
  '║   ░▒▓█ SHADOWSCRIPT OS v1.0.0 █▓▒░                       ║',
  '║                                                           ║',
  '║   A Haunted Computing Experience                          ║',
  '║                                                           ║',
  '║   "Where the dead code comes alive..."                    ║',
  '║                                                           ║',
  '╚═══════════════════════════════════════════════════════════╝',
  '',
  'System initialized successfully.',
  'Type "help" for available commands...',
  ''
]

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (currentStep >= bootSteps.length) {
      // Boot sequence complete
      const completeTimeout = setTimeout(() => {
        onComplete()
      }, 500)
      return () => clearTimeout(completeTimeout)
    }

    // Determine delay based on line content
    let delay = 80 // Default delay
    const currentLine = bootSteps[currentStep]
    
    if (currentLine.includes('█')) {
      // Progress bar lines - faster
      delay = 150
    } else if (currentLine.includes('╔') || currentLine.includes('╚')) {
      // Box drawing - slightly slower for effect
      delay = 100
    } else if (currentLine === '') {
      // Empty lines - very fast
      delay = 50
    } else if (currentLine.includes('Loading') || currentLine.includes('Detecting')) {
      // Loading messages - add suspense
      delay = 300
    }

    const timeout = setTimeout(() => {
      setDisplayedLines(prev => [...prev, bootSteps[currentStep]])
      setCurrentStep(prev => prev + 1)
    }, delay)

    return () => clearTimeout(timeout)
  }, [currentStep, onComplete])

  return (
    <div className={styles.bootSequence}>
      {displayedLines.map((line, index) => (
        <div 
          key={index} 
          className={`${styles.bootLine} ${
            line.includes('█') ? styles.progressBar : ''
          } ${
            line.includes('╔') || line.includes('║') || line.includes('╚') 
              ? styles.boxDrawing 
              : ''
          }`}
        >
          {line}
        </div>
      ))}
      {currentStep < bootSteps.length && (
        <span className={styles.cursor}>_</span>
      )}
    </div>
  )
}
