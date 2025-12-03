import { ReactNode, useEffect, useState } from 'react'
import styles from './CRTDisplay.module.css'

export interface CRTDisplayProps {
  children: ReactNode;
  glitchIntensity?: number; // 0-1
  scanlineOpacity?: number; // 0-1
  phosphorColor?: 'green' | 'amber' | 'white';
}

export default function CRTDisplay({ 
  children, 
  scanlineOpacity = 0.12,
  phosphorColor = 'green'
}: CRTDisplayProps) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 250)
      
      // Schedule next glitch between 7-15 seconds for better balance
      const nextGlitch = 7000 + Math.random() * 8000
      setTimeout(triggerGlitch, nextGlitch)
    }

    // Start first glitch after random delay
    const initialDelay = 7000 + Math.random() * 8000
    const timeoutId = setTimeout(triggerGlitch, initialDelay)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div 
      className={`${styles.crtDisplay} ${isGlitching ? styles.glitching : ''}`}
      data-phosphor={phosphorColor}
      style={{
        '--scanline-opacity': scanlineOpacity,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
