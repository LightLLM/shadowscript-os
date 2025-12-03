import { useState, useEffect } from 'react'
import { GhostPaintState, PixelGrid } from '../../types/app.types'
import { VirtualFileSystem } from '../../services/mcp/VirtualFileSystem'
import Window from '../../components/Window/Window'
import PixelGridComponent from './PixelGrid'
import ColorPalette from './ColorPalette'
import ToolSelector from './ToolSelector'
import styles from './GhostPaint.module.css'

export interface GhostPaintProps {
  onClose: () => void;
  filesystem: VirtualFileSystem;
}

const createEmptyGrid = (width: number, height: number): PixelGrid => {
  const pixels: string[][] = []
  for (let y = 0; y < height; y++) {
    pixels[y] = []
    for (let x = 0; x < width; x++) {
      pixels[y][x] = 'transparent'
    }
  }
  return { width, height, pixels }
}

export default function GhostPaint({ onClose, filesystem }: GhostPaintProps) {
  const [state, setState] = useState<GhostPaintState>({
    canvas: createEmptyGrid(32, 32),
    selectedColor: '#55FF55',
    selectedTool: 'pen',
    palette: [
      '#55FF55', // bright green
      '#5555FF', // bright blue
      '#FF5555', // bright red
      '#FFFF55', // yellow
      '#55FFFF', // bright cyan
      '#FF55FF', // bright magenta
      '#FFFFFF', // white
      '#AAAAAA', // light gray
    ]
  })
  const [corruptionFlash, setCorruptionFlash] = useState(false)

  // Random pixel corruption effect
  useEffect(() => {
    const corruptPixel = () => {
      // Only corrupt if there are non-transparent pixels
      const hasPixels = state.canvas.pixels.some(row => 
        row.some(pixel => pixel !== 'transparent')
      )

      if (!hasPixels) return

      // Randomly corrupt 1-2 pixels (sparingly)
      const corruptionCount = Math.random() < 0.7 ? 1 : 2

      setState(prev => {
        const newPixels = prev.canvas.pixels.map(row => [...row])
        
        for (let i = 0; i < corruptionCount; i++) {
          const x = Math.floor(Math.random() * prev.canvas.width)
          const y = Math.floor(Math.random() * prev.canvas.height)
          
          // 50% chance to corrupt to random color, 50% to make transparent
          if (Math.random() < 0.5) {
            const randomColor = prev.palette[Math.floor(Math.random() * prev.palette.length)]
            newPixels[y][x] = randomColor
          } else {
            newPixels[y][x] = 'transparent'
          }
        }

        return {
          ...prev,
          canvas: {
            ...prev.canvas,
            pixels: newPixels
          }
        }
      })

      // Visual feedback
      setCorruptionFlash(true)
      setTimeout(() => setCorruptionFlash(false), 200)
    }

    // Trigger corruption every 45-90 seconds (sparingly)
    const minInterval = 45000
    const maxInterval = 90000
    
    const scheduleNextCorruption = () => {
      const delay = minInterval + Math.random() * (maxInterval - minInterval)
      return setTimeout(() => {
        corruptPixel()
        scheduleNextCorruption()
      }, delay)
    }

    const timeoutId = scheduleNextCorruption()

    return () => clearTimeout(timeoutId)
  }, [state.canvas.pixels, state.palette])

  const handlePixelChange = (x: number, y: number, color: string) => {
    setState(prev => {
      const newPixels = prev.canvas.pixels.map(row => [...row])
      newPixels[y][x] = color
      return {
        ...prev,
        canvas: {
          ...prev.canvas,
          pixels: newPixels
        }
      }
    })
  }

  const handleColorSelect = (color: string) => {
    setState(prev => ({
      ...prev,
      selectedColor: color
    }))
  }

  const handleToolSelect = (tool: 'pen' | 'eraser' | 'fill') => {
    setState(prev => ({
      ...prev,
      selectedTool: tool
    }))
  }

  const handleSave = async () => {
    try {
      const timestamp = Date.now()
      const filename = `artwork_${timestamp}.json`
      const path = `/ghostpaint/${filename}`
      
      // Ensure directory exists
      const dirExists = await filesystem.exists('/ghostpaint')
      if (!dirExists) {
        await filesystem.createDirectory('/ghostpaint')
      }

      // Serialize artwork
      const artworkData = {
        width: state.canvas.width,
        height: state.canvas.height,
        pixels: state.canvas.pixels,
        timestamp,
        version: '1.0'
      }

      await filesystem.createFile(path, JSON.stringify(artworkData, null, 2))
      alert(`░▒▓ Artwork saved as ${filename} ▓▒░`)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error('GhostPaint save error:', error)
      alert(`░▒▓█ ERROR: The spirits reject your creation! █▓▒░\n\n${errorMsg}`)
    }
  }

  const handleLoad = async () => {
    try {
      const dirExists = await filesystem.exists('/ghostpaint')
      if (!dirExists) {
        alert('░▒▓ No saved artworks found in the void... ▓▒░')
        return
      }

      const files = await filesystem.listDirectory('/ghostpaint')
      if (files.length === 0) {
        alert('░▒▓ No saved artworks found in the void... ▓▒░')
        return
      }

      // Load the most recent file
      const sortedFiles = files.sort((a, b) => b.modified - a.modified)
      const latestFile = sortedFiles[0]
      
      const content = await filesystem.readFile(latestFile.path)
      const artworkData = JSON.parse(content)

      setState(prev => ({
        ...prev,
        canvas: {
          width: artworkData.width,
          height: artworkData.height,
          pixels: artworkData.pixels
        }
      }))

      alert(`░▒▓ Summoned ${latestFile.name} from the depths ▓▒░`)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error('GhostPaint load error:', error)
      alert(`░▒▓█ ERROR: Failed to resurrect artwork! █▓▒░\n\n${errorMsg}`)
    }
  }

  return (
    <div className={corruptionFlash ? styles.corruptionFlash : ''}>
      <Window title="GHOSTPAINT" onClose={onClose}>
        <div className={styles.content}>
          <div className={styles.mainArea}>
            <PixelGridComponent
              grid={state.canvas}
              selectedColor={state.selectedColor}
              selectedTool={state.selectedTool}
              onPixelChange={handlePixelChange}
            />
          </div>
          <div className={styles.sidebar}>
            <ToolSelector
              selectedTool={state.selectedTool}
              onToolSelect={handleToolSelect}
            />
            <ColorPalette
              colors={state.palette}
              selectedColor={state.selectedColor}
              onColorSelect={handleColorSelect}
            />
            <div className={styles.actions}>
              <button className={styles.actionButton} onClick={handleSave}>
                💾 Save
              </button>
              <button className={styles.actionButton} onClick={handleLoad}>
                📂 Load
              </button>
            </div>
          </div>
        </div>
      </Window>
    </div>
  )
}
