import styles from './ToolSelector.module.css'

export interface ToolSelectorProps {
  selectedTool: 'pen' | 'eraser' | 'fill';
  onToolSelect: (tool: 'pen' | 'eraser' | 'fill') => void;
}

const tools: Array<{ id: 'pen' | 'eraser' | 'fill'; name: string; icon: string }> = [
  { id: 'pen', name: 'Pen', icon: '✎' },
  { id: 'eraser', name: 'Eraser', icon: '⌫' },
  { id: 'fill', name: 'Fill', icon: '▓' }
]

export default function ToolSelector({ selectedTool, onToolSelect }: ToolSelectorProps) {
  return (
    <div className={styles.toolSelector}>
      <div className={styles.toolTitle}>┌─ TOOLS ─┐</div>
      <div className={styles.toolList}>
        {tools.map((tool) => {
          const isSelected = tool.id === selectedTool
          return (
            <button
              key={tool.id}
              className={`${styles.toolButton} ${isSelected ? styles.toolButtonSelected : ''}`}
              onClick={() => onToolSelect(tool.id)}
            >
              <span className={styles.toolIcon}>{tool.icon}</span>
              <span className={styles.toolName}>{tool.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
