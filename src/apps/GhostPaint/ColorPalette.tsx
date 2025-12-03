import styles from './ColorPalette.module.css'

export interface ColorPaletteProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export default function ColorPalette({ colors, selectedColor, onColorSelect }: ColorPaletteProps) {
  return (
    <div className={styles.colorPalette}>
      <div className={styles.paletteTitle}>┌─ COLORS ─┐</div>
      <div className={styles.colorGrid}>
        {colors.map((color) => {
          const isSelected = color === selectedColor
          return (
            <div
              key={color}
              className={`${styles.colorSwatch} ${isSelected ? styles.colorSwatchSelected : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              title={color}
            >
              {isSelected && (
                <div className={styles.selectedIndicator}>✓</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
