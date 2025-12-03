import { useState } from 'react'
import { PixelGrid as PixelGridType } from '../../types/app.types'
import styles from './PixelGrid.module.css'

export interface PixelGridProps {
  grid: PixelGridType;
  selectedColor: string;
  selectedTool: 'pen' | 'eraser' | 'fill';
  onPixelChange: (x: number, y: number, color: string) => void;
}

export default function PixelGrid({ grid, selectedColor, selectedTool, onPixelChange }: PixelGridProps) {
  const [hoveredPixel, setHoveredPixel] = useState<{ x: number; y: number } | null>(null)

  const handlePixelClick = (x: number, y: number) => {
    if (selectedTool === 'pen') {
      onPixelChange(x, y, selectedColor)
    } else if (selectedTool === 'eraser') {
      onPixelChange(x, y, 'transparent')
    } else if (selectedTool === 'fill') {
      // Fill tool will be handled by parent component
      floodFill(x, y)
    }
  }

  const floodFill = (startX: number, startY: number) => {
    const targetColor = grid.pixels[startY][startX]
    if (targetColor === selectedColor) return

    const stack: Array<[number, number]> = [[startX, startY]]
    const visited = new Set<string>()

    while (stack.length > 0) {
      const [x, y] = stack.pop()!
      const key = `${x},${y}`

      if (visited.has(key)) continue
      if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) continue
      if (grid.pixels[y][x] !== targetColor) continue

      visited.add(key)
      onPixelChange(x, y, selectedColor)

      // Add adjacent pixels
      stack.push([x + 1, y])
      stack.push([x - 1, y])
      stack.push([x, y + 1])
      stack.push([x, y - 1])
    }
  }

  const handlePixelMouseEnter = (x: number, y: number) => {
    setHoveredPixel({ x, y })
  }

  const handlePixelMouseLeave = () => {
    setHoveredPixel(null)
  }

  return (
    <div className={styles.pixelGridContainer}>
      <div 
        className={styles.pixelGrid}
        style={{
          gridTemplateColumns: `repeat(${grid.width}, 1fr)`,
          gridTemplateRows: `repeat(${grid.height}, 1fr)`
        }}
      >
        {grid.pixels.map((row, y) =>
          row.map((color, x) => {
            const isHovered = hoveredPixel?.x === x && hoveredPixel?.y === y
            return (
              <div
                key={`${x}-${y}`}
                className={`${styles.pixel} ${isHovered ? styles.pixelHovered : ''}`}
                style={{
                  backgroundColor: color === 'transparent' ? 'var(--color-black)' : color
                }}
                onClick={() => handlePixelClick(x, y)}
                onMouseEnter={() => handlePixelMouseEnter(x, y)}
                onMouseLeave={handlePixelMouseLeave}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
