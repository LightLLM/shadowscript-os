import { useEffect, useState, useRef } from 'react'
import CRTDisplay from './components/CRTDisplay/CRTDisplay'
import Terminal from './components/Terminal/Terminal'
import GhostAgent, { GhostAgentHandle } from './components/GhostAgent/GhostAgent'
import GhostPaint from './apps/GhostPaint/GhostPaint'
import DeadMail from './apps/DeadMail/DeadMail'
import BootSequence from './components/BootSequence/BootSequence'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import { createDefaultParser } from './components/Terminal/CommandParser'
import { VirtualFileSystem } from './services/mcp/VirtualFileSystem'
import { MessageRewriter } from './services/mcp/MessageRewriter'
import { FileMutationHook } from './services/hooks/FileMutationHook'
import { useAppContext } from './context/AppContext'
import { initializeFilesystem } from './utils/initializeFilesystem'

function App() {
  const { state, dispatch } = useAppContext()
  const [parser] = useState(() => createDefaultParser())
  const [filesystem] = useState(() => new VirtualFileSystem())
  const [messageRewriter] = useState(() => new MessageRewriter())
  const [fileMutationHook] = useState(() => new FileMutationHook(filesystem))
  const [isInitialized, setIsInitialized] = useState(false)
  const ghostAgentRef = useRef<GhostAgentHandle>(null)

  useEffect(() => {
    // Initialize filesystem with default structure on first load
    const initFs = async () => {
      await initializeFilesystem(filesystem)
      
      // Set up file creation listener to auto-register files for mutation
      fileMutationHook.onFileCreated((path) => {
        fileMutationHook.registerFile(path)
        console.log(`░▒▓ File registered for haunting: ${path} ▓▒░`)
      })
      
      // Start random mutations
      fileMutationHook.startRandomMutations(30000, 180000)
      
      setIsInitialized(true)
    }
    initFs()
  }, [filesystem, fileMutationHook])

  const handleBootComplete = () => {
    dispatch({ type: 'SET_BOOTED', payload: true })
    // Set initial ghost personality
    dispatch({ type: 'SET_GHOST_PERSONALITY', payload: 'playful' })
  }

  const handleCommand = (command: string) => {
    const result = parser.execute(command)
    
    // Update last interaction time
    dispatch({ type: 'UPDATE_LAST_INTERACTION', payload: Date.now() })
    
    // Trigger file mutation on command execution
    fileMutationHook.onCommandExecution(command)
    
    // Trigger ghost agent response to command
    if (ghostAgentRef.current) {
      ghostAgentRef.current.respondToCommand(command)
    }
    
    // Special case: clear command
    if (command.toLowerCase() === 'clear') {
      dispatch({ type: 'CLEAR_TERMINAL' })
    } else if (command.toLowerCase() === 'ghostpaint') {
      dispatch({ type: 'ADD_TERMINAL_LINES', payload: result })
      dispatch({ type: 'SET_CURRENT_APP', payload: 'ghostpaint' })
    } else if (command.toLowerCase() === 'deadmail') {
      dispatch({ type: 'ADD_TERMINAL_LINES', payload: result })
      dispatch({ type: 'SET_CURRENT_APP', payload: 'deadmail' })
    } else {
      dispatch({ type: 'ADD_TERMINAL_LINES', payload: result })
    }
  }

  const handleGhostMessage = (message: string) => {
    // Map personality to intensity for MessageRewriter
    const intensityMap = {
      'playful': 0.3,      // Subtle transformations
      'mischievous': 0.6,  // Moderate transformations
      'ominous': 0.9       // Extreme transformations
    }
    
    const intensity = intensityMap[state.ghost.personality]
    const rewrittenMessage = messageRewriter.rewrite(message, intensity)
    
    // Trigger file mutation on ghost interaction
    fileMutationHook.onGhostInteraction('message')
    
    dispatch({
      type: 'ADD_TERMINAL_LINE',
      payload: {
        type: 'ghost',
        content: rewrittenMessage,
        timestamp: Date.now()
      }
    })
    
    dispatch({
      type: 'ADD_GHOST_MESSAGE',
      payload: {
        id: `ghost-${Date.now()}`,
        content: rewrittenMessage,
        timestamp: Date.now(),
        isRewritten: true
      }
    })
  }

  const handleCloseApp = () => {
    dispatch({ type: 'SET_CURRENT_APP', payload: null })
  }

  const handleAppError = () => {
    // Return to terminal on app crash
    dispatch({ type: 'SET_CURRENT_APP', payload: null })
    dispatch({
      type: 'ADD_TERMINAL_LINE',
      payload: {
        type: 'error',
        content: '░▒▓█ Application crashed! The spirits have been exorcised. █▓▒░',
        timestamp: Date.now()
      }
    })
  }

  // Don't render anything until filesystem is initialized
  if (!isInitialized) {
    return null
  }

  return (
    <CRTDisplay 
      phosphorColor={state.effects.phosphorColor} 
      scanlineOpacity={state.effects.scanlineOpacity}
      glitchIntensity={state.effects.glitchIntensity}
    >
      {!state.boot.isBooted ? (
        <BootSequence onComplete={handleBootComplete} />
      ) : (
        <>
          <GhostAgent 
            ref={ghostAgentRef}
            onMessage={handleGhostMessage}
            personality={state.ghost.personality}
            showGreeting={state.boot.isBooted}
          />
          <Terminal 
            onCommand={handleCommand} 
            history={state.terminal.history} 
          />
          {state.apps.current === 'ghostpaint' && (
            <ErrorBoundary onReset={handleAppError}>
              <GhostPaint 
                onClose={handleCloseApp} 
                filesystem={filesystem}
              />
            </ErrorBoundary>
          )}
          {state.apps.current === 'deadmail' && (
            <ErrorBoundary onReset={handleAppError}>
              <DeadMail 
                onClose={handleCloseApp} 
                filesystem={filesystem}
              />
            </ErrorBoundary>
          )}
        </>
      )}
    </CRTDisplay>
  )
}

export default App
