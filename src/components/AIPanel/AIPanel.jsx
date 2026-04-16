import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './AIPanel.module.css'

const PRESET_QUESTIONS = [
  { label: 'Explain this algorithm', icon: '💡' },
  { label: "What's the time complexity?", icon: '⏱️' },
  { label: 'When should I use this?', icon: '🎯' },
  { label: 'How does this compare to similar algorithms?', icon: '⚖️' },
  { label: 'What should I watch for?', icon: '👁️' },
]

const ALGORITHM_WELCOME = {
  "Dijkstra's Algorithm": "Now watching Dijkstra's — the gold standard for shortest paths. Ask me anything!",
  'A* Search': "Now watching A* Search — it uses a heuristic to find paths faster. Ask me anything!",
  'Breadth-First Search (BFS)': 'Now watching BFS — watch it explore in perfect rings outward. Ask me anything!',
  'Depth-First Search (DFS)': 'Now watching DFS — watch it dive deep before backtracking. Ask me anything!',
  'Greedy Best-First Search': 'Now watching Greedy Best-First — it beelines toward the goal. Ask me anything!',
  'Bubble Sort': 'Now watching Bubble Sort — the classic teaching algorithm. Ask me anything!',
  'Selection Sort': 'Now watching Selection Sort — minimal swaps, same comparisons. Ask me anything!',
  'Insertion Sort': 'Now watching Insertion Sort — surprisingly fast on nearly-sorted data. Ask me anything!',
  'Merge Sort': 'Now watching Merge Sort — guaranteed O(n log n), always. Ask me anything!',
  'Quick Sort': 'Now watching Quick Sort — the fastest sort in practice. Ask me anything!',
  'Binary Search Tree': 'Now watching BST — the foundation of ordered data structures. Ask me anything!',
  'Heap Data Structure': 'Now watching Heaps — the most efficient priority queue. Ask me anything!',
  'Binary Search': 'Now watching Binary Search — halving the search space each step. Ask me anything!',
}

function TypingIndicator() {
  return (
    <div className={styles.typingIndicator}>
      <span /><span /><span />
    </div>
  )
}

function MessageBubble({ message, onCopy }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
    onCopy && onCopy()
  }

  if (message.role === 'status') {
    return <div className={styles.statusMsg}>{message.content}</div>
  }

  return (
    <div className={`${styles.bubble} ${styles[message.role]} ${message.isError ? styles.errorBubble : ''}`}>
      {message.role === 'assistant' && (
        <div className={styles.bubbleHeader}>
          <span className={styles.aiLabel}>✦ Claude</span>
          {!message.isStreaming && message.content && (
            <button className={styles.copyBtn} onClick={handleCopy} title="Copy response">
              {copied ? '✓' : '⎘'}
            </button>
          )}
        </div>
      )}
      <div className={styles.bubbleContent}>
        {message.isStreaming && !message.content ? (
          <TypingIndicator />
        ) : (
          <span className={styles.messageText}>{message.content}</span>
        )}
        {message.isStreaming && message.content && (
          <span className={styles.streamCursor}>▋</span>
        )}
      </div>
    </div>
  )
}

export default function AIPanel({ currentAlgorithm, currentTab, vizStatus }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showExplainBtn, setShowExplainBtn] = useState(false)
  const [vizBanner, setVizBanner] = useState(null)

  const abortRef = useRef(null)
  const chatRef = useRef(null)
  const inputRef = useRef(null)
  const prevAlgorithmRef = useRef(currentAlgorithm)
  const prevVizStatusRef = useRef(vizStatus)
  const historyRef = useRef([]) // clean history for API

  // First-time tooltip
  useEffect(() => {
    if (!localStorage.getItem('dsa_ai_tooltip_seen')) {
      setTimeout(() => setShowTooltip(true), 2000)
    }
  }, [])

  const dismissTooltip = () => {
    setShowTooltip(false)
    localStorage.setItem('dsa_ai_tooltip_seen', '1')
  }

  // Algorithm change → clear conversation
  useEffect(() => {
    if (currentAlgorithm && currentAlgorithm !== prevAlgorithmRef.current) {
      prevAlgorithmRef.current = currentAlgorithm
      historyRef.current = []
      const welcome = ALGORITHM_WELCOME[currentAlgorithm]
        || `Now watching ${currentAlgorithm}. Ask me anything!`
      setMessages([{ role: 'status', content: welcome }])
      setShowExplainBtn(false)
      setVizBanner(null)
    }
  }, [currentAlgorithm])

  // Viz status → banners and buttons
  useEffect(() => {
    if (vizStatus === prevVizStatusRef.current) return
    prevVizStatusRef.current = vizStatus

    if (vizStatus === 'running') {
      setVizBanner('Visualization running — I can explain what you\'re seeing')
      setShowExplainBtn(false)
    } else if (vizStatus === 'maze_running') {
      setVizBanner('Generating maze — ask me how recursive division works!')
      setShowExplainBtn(false)
    } else if (vizStatus === 'complete') {
      setVizBanner(null)
      setShowExplainBtn(true)
    } else {
      setVizBanner(null)
    }
  }, [vizStatus])

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  // Keyboard shortcut: press / to open
  useEffect(() => {
    const handleKey = (e) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 150)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const buildContext = useCallback(() => {
    const parts = []
    if (vizStatus === 'running') parts.push('visualization is currently running')
    if (vizStatus === 'complete') parts.push('visualization just completed')
    if (vizStatus === 'paused') parts.push('visualization is paused')
    return parts.join(', ')
  }, [vizStatus])

  const sendMessage = useCallback(async (question) => {
    if (!question.trim() || isStreaming) return

    const q = question.trim()
    setInput('')
    setIsStreaming(true)
    setRateLimited(true)
    setTimeout(() => setRateLimited(false), 1000)

    // Stop any existing stream
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    // Append user message
    setMessages(prev => [...prev, { role: 'user', content: q }])
    // Placeholder streaming bubble
    setMessages(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }])

    const historySnapshot = [...historyRef.current]

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm: currentAlgorithm || 'Unknown',
          context: buildContext(),
          question: q,
          history: historySnapshot,
        }),
        signal: controller.signal,
      })

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // Keep incomplete last line

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.type === 'text') {
              fullText += data.text
              setMessages(prev => {
                const next = [...prev]
                next[next.length - 1] = { role: 'assistant', content: fullText, isStreaming: true }
                return next
              })
            } else if (data.type === 'done') {
              setMessages(prev => {
                const next = [...prev]
                next[next.length - 1] = { role: 'assistant', content: fullText, isStreaming: false }
                return next
              })
              // Update history
              historyRef.current = [
                ...historySnapshot,
                { role: 'user', content: q },
                { role: 'assistant', content: fullText },
              ]
            } else if (data.type === 'error') {
              setMessages(prev => {
                const next = [...prev]
                next[next.length - 1] = {
                  role: 'assistant',
                  content: data.message,
                  isStreaming: false,
                  isError: true,
                }
                return next
              })
            }
          } catch (_) { /* ignore parse errors */ }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setMessages(prev => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last?.isStreaming) {
            next[next.length - 1] = { ...last, isStreaming: false, content: last.content || '(stopped)' }
          }
          return next
        })
      } else {
        setMessages(prev => {
          const next = [...prev]
          next[next.length - 1] = {
            role: 'assistant',
            content: `Connection error. Is the Flask backend running on port 5000?\n\n${err.message}`,
            isStreaming: false,
            isError: true,
          }
          return next
        })
      }
    } finally {
      setIsStreaming(false)
    }
  }, [currentAlgorithm, buildContext, isStreaming])

  const stopGeneration = () => {
    if (abortRef.current) abortRef.current.abort()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handlePreset = (question) => {
    if (isStreaming) return
    sendMessage(question)
  }

  const handleExplainNow = () => {
    sendMessage('Explain what just happened in that visualization')
    setShowExplainBtn(false)
  }

  const togglePanel = () => {
    setIsOpen(o => !o)
    if (!isOpen) dismissTooltip()
  }

  return (
    <>
      {/* First-time tooltip */}
      {showTooltip && !isOpen && (
        <div className={styles.tooltip} onClick={dismissTooltip}>
          <span>✨ New! Ask Claude to explain any algorithm</span>
          <button className={styles.tooltipClose} onClick={dismissTooltip}>✕</button>
        </div>
      )}

      {/* Toggle button */}
      <button
        className={`${styles.toggleBtn} ${isOpen ? styles.toggleOpen : ''}`}
        onClick={togglePanel}
        title={isOpen ? 'Close AI panel (/)' : 'Open AI assistant (/)'}
        aria-label="Toggle AI panel"
      >
        {isOpen ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C5.58172 2 2 5.58172 2 10C2 11.8487 2.63584 13.551 3.70846 14.9028L2.29289 16.2929C1.90237 16.6834 2.17155 17.3536 2.70711 17.3536H10C14.4183 17.3536 18 13.7719 18 9.35355C18 4.93527 14.4183 1.35355 10 1.35355" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="7" cy="10" r="1.2" fill="currentColor"/>
            <circle cx="10" cy="10" r="1.2" fill="currentColor"/>
            <circle cx="13" cy="10" r="1.2" fill="currentColor"/>
          </svg>
        )}
        {!isOpen && <span className={styles.toggleLabel}>AI</span>}
      </button>

      {/* Panel */}
      <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`} aria-hidden={!isOpen}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>✦</span>
            <span className={styles.headerTitle}>Claude AI</span>
            <span className={styles.headerSub}>DSA Tutor</span>
          </div>
          {currentAlgorithm && (
            <span className={styles.algorithmBadge}>
              {currentAlgorithm}
            </span>
          )}
        </div>

        {/* Preset buttons */}
        <div className={styles.presets}>
          {PRESET_QUESTIONS.map(({ label, icon }) => (
            <button
              key={label}
              className={styles.presetBtn}
              onClick={() => handlePreset(label)}
              disabled={isStreaming}
              title={label}
            >
              <span className={styles.presetIcon}>{icon}</span>
              <span className={styles.presetLabel}>{label}</span>
            </button>
          ))}
        </div>

        {/* Viz status banner */}
        {vizBanner && (
          <div className={styles.vizBanner}>
            <span className={styles.vizDot} />
            {vizBanner}
          </div>
        )}

        {/* Chat area */}
        <div className={styles.chat} ref={chatRef}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>✦</div>
              <p>Ask me about <strong>{currentAlgorithm || 'this algorithm'}</strong>.</p>
              <p className={styles.emptyHint}>Press <kbd>/</kbd> to open this panel anytime.</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))
          )}
        </div>

        {/* Explain what happened button */}
        {showExplainBtn && (
          <div className={styles.explainBanner}>
            <button className={styles.explainBtn} onClick={handleExplainNow}>
              🔍 Explain what just happened
            </button>
          </div>
        )}

        {/* Input area */}
        <form className={styles.inputArea} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Ask about ${currentAlgorithm || 'this algorithm'}…`}
            disabled={isStreaming}
            maxLength={500}
          />
          {isStreaming ? (
            <button
              type="button"
              className={`${styles.sendBtn} ${styles.stopBtn}`}
              onClick={stopGeneration}
              title="Stop generation"
            >
              ◼
            </button>
          ) : (
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!input.trim() || rateLimited}
              title="Send message"
            >
              ↑
            </button>
          )}
        </form>

        <div className={styles.footer}>
          Powered by Claude · Press <kbd>/</kbd> to toggle
        </div>
      </div>

      {/* Mobile overlay backdrop */}
      {isOpen && <div className={styles.backdrop} onClick={togglePanel} />}
    </>
  )
}
