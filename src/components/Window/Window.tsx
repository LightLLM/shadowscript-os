import { ReactNode } from 'react'
import styles from './Window.module.css'

export interface WindowProps {
  title: string;
  onClose?: () => void;
  children: ReactNode;
  width?: string;
  height?: string;
}

export default function Window({ title, onClose, children, width, height }: WindowProps) {
  return (
    <div className={styles.windowOverlay}>
      <div 
        className={styles.window}
        style={{
          width: width || 'auto',
          height: height || 'auto'
        }}
      >
        <div className={styles.titleBar}>
          <span className={styles.topLeft}>┌</span>
          <span className={styles.titleBorder}>─</span>
          <span className={styles.title}> {title} </span>
          <span className={styles.titleBorder}>─</span>
          {onClose && (
            <button className={styles.closeButton} onClick={onClose}>
              ✕
            </button>
          )}
          <span className={styles.topRight}>┐</span>
        </div>
        <div className={styles.content}>
          <span className={styles.leftBorder}>│</span>
          <div className={styles.innerContent}>
            {children}
          </div>
          <span className={styles.rightBorder}>│</span>
        </div>
        <div className={styles.footer}>
          <span className={styles.bottomLeft}>└</span>
          <span className={styles.bottomBorder}>─</span>
          <span className={styles.bottomRight}>┘</span>
        </div>
      </div>
    </div>
  )
}
