import { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state to display fallback UI
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call optional reset callback
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorBox}>
            <div className={styles.errorHeader}>
              ┌{'─'.repeat(58)}┐
            </div>
            <div className={styles.errorContent}>
              <div className={styles.errorTitle}>
                │ ░▒▓█ FATAL ERROR: GHOST IN THE MACHINE █▓▒░
              </div>
              <div className={styles.errorMessage}>
                │
              </div>
              <div className={styles.errorMessage}>
                │ The spirits have corrupted this application...
              </div>
              <div className={styles.errorMessage}>
                │
              </div>
              <div className={styles.errorDetails}>
                │ Error: {this.state.error?.message || 'Unknown error'}
              </div>
              <div className={styles.errorMessage}>
                │
              </div>
              <div className={styles.errorMessage}>
                │ Press [RETURN] to exorcise the demons and return
              </div>
              <div className={styles.errorMessage}>
                │ to the terminal...
              </div>
            </div>
            <div className={styles.errorFooter}>
              └{'─'.repeat(58)}┘
            </div>
            <button 
              className={styles.resetButton}
              onClick={this.handleReset}
              autoFocus
            >
              [RETURN TO TERMINAL]
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
