import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, Navigation, RefreshCw, Send, HelpCircle } from 'lucide-react'
import { parseIntent, generateSmartAnswer } from '../utils/nluEngine.js'
import { api } from '../api/index.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import './VoiceAssistant.css'

const SpeechRecognition = typeof window !== 'undefined' 
  ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
  : null

export default function VoiceAssistant({ isOpenExternal, onCloseExternal }) {
  const { lang: appLang } = useLanguage()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [speechLang, setSpeechLang] = useState(appLang === 'ta' ? 'ta-IN' : 'en-IN') // 'ta-IN' or 'en-IN'
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: (appLang === 'ta')
        ? "வணக்கம்! நான் உங்கள் GraniteX குரல் உதவியாளன். மைக்கை தொட்டு பேசத் தொடங்குங்கள் (தமிழ் / English)."
        : "Hello! I am your GraniteX Voice Assistant. Tap the microphone and speak your query in Tamil or English."
    }
  ])

  const recognitionRef = useRef(null)
  const chatScrollRef = useRef(null)

  // Sync external open state if controlled from navbar
  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal)
    }
  }, [isOpenExternal])

  // Sync speech language when app language changes
  useEffect(() => {
    setSpeechLang(appLang === 'ta' ? 'ta-IN' : 'en-IN')
  }, [appLang])

  // Auto-scroll chat body
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [messages, isListening, isProcessing, interimTranscript])

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (!SpeechRecognition) return

    const rec = new SpeechRecognition()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = speechLang

    rec.onstart = () => {
      setIsListening(true)
      setInterimTranscript('')
    }

    rec.onresult = (event) => {
      let currentInterim = ''
      let finalSpeech = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const trans = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalSpeech += trans
        } else {
          currentInterim += trans
        }
      }

      setInterimTranscript(currentInterim)
      if (finalSpeech) {
        setTranscript(finalSpeech)
        handleUserVoiceInput(finalSpeech)
      }
    }

    rec.onerror = (event) => {
      console.warn('Speech recognition error:', event.error)
      setIsListening(false)
      if (event.error !== 'no-speech') {
        pushMessage('assistant', speechLang.startsWith('ta') 
          ? "மன்னிக்கவும், உங்கள் குரல் தெளிவாகக் கேட்கவில்லை. மீண்டும் முயற்சி செய்யவும்."
          : "Sorry, I couldn't hear clearly. Please tap the mic and try again."
        )
      }
    }

    rec.onend = () => {
      setIsListening(false)
      setInterimTranscript('')
    }

    recognitionRef.current = rec

    return () => {
      if (rec) rec.abort()
    }
  }, [speechLang])

  // Stop TTS on unmount or close
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }

  // Text-to-Speech (TTS Audio Response)
  const speakResponse = (text) => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return

    stopSpeech()

    // Strip Markdown symbols for clean audio readouts
    const cleanText = text
      .replace(/[#*•_`~]/g, '')
      .replace(/₹/g, 'Rupees ')
      .replace(/https?:\/\/\S+/g, '')

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = speechLang === 'ta-IN' ? 'ta-IN' : 'en-IN'
    utterance.rate = 1.0

    // Try finding Tamil voice if ta-IN
    const voices = window.speechSynthesis.getVoices()
    if (speechLang === 'ta-IN') {
      const taVoice = voices.find(v => v.lang.includes('ta'))
      if (taVoice) utterance.voice = taVoice
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const toggleListening = () => {
    stopSpeech()
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported on this browser. Please use Google Chrome or Microsoft Edge.")
      return
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop()
    } else {
      try {
        setTranscript('')
        setInterimTranscript('')
        recognitionRef.current.lang = speechLang
        recognitionRef.current.start()
      } catch (e) {
        console.error("Error starting speech recognition:", e)
      }
    }
  }

  const pushMessage = (sender, text, navPath = null) => {
    setMessages(prev => [...prev, { sender, text, navPath }])
    if (sender === 'assistant') {
      speakResponse(text)
    }
  }

  // Handle Spoken or Typed Queries
  const handleUserVoiceInput = async (userInputText) => {
    const query = userInputText.trim()
    if (!query) return

    pushMessage('user', query)
    setIsProcessing(true)

    try {
      const res = await generateSmartAnswer(query, speechLang, api)
      setIsProcessing(false)
      pushMessage('assistant', res.text, res.navPath)
      if (res.shouldNavigate && res.navPath) {
        navigate(res.navPath)
      }
    } catch (err) {
      console.error("Voice assistant query processing error:", err)
      setIsProcessing(false)
      pushMessage('assistant', speechLang.startsWith('ta') 
        ? "மன்னிக்கவும், தகவல் பெற முடியவில்லை. மீண்டும் முயற்சி செய்க."
        : "Sorry, I couldn't process your query. Please try again.")
    }
  }

  const handleClose = () => {
    stopSpeech()
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsOpen(false)
    if (onCloseExternal) onCloseExternal()
  }

  const quickPrompts = speechLang.startsWith('ta') ? [
    "⚠️ குறைந்த சரக்கு நிலை காட்டு",
    "💰 மாதாந்திர லாபம் எவ்வளவு?",
    "💎 கிரானைட் சதுர அடி விலை என்ன?",
    "🚚 சமீபத்திய விற்பனை ஆணைகள்"
  ] : [
    "⚠️ Show Low Stock Items",
    "💰 What is the Monthly Profit?",
    "💎 Granite Slab Price Per Sq.ft",
    "🚚 Track Recent Sales Orders"
  ]

  return (
    <div className="voice-assistant-root">
      {/* Floating Mic Launcher Button */}
      {!isOpen && (
        <button 
          className={`voice-fab ${isListening ? 'listening' : ''}`}
          onClick={() => setIsOpen(true)}
          title="Open GraniteX Voice Assistant (Tamil & English)"
          aria-label="Open Voice Assistant"
        >
          <Mic size={22} />
          <span className="voice-fab-badge">AI Voice</span>
          <span className="voice-pulse-ring" />
        </button>
      )}

      {/* Voice Assistant Modal Overlay */}
      {isOpen && (
        <div className="voice-modal-backdrop">
          <div className="voice-modal-card">
            {/* Header */}
            <div className="voice-modal-header">
              <div className="voice-title-group">
                <div className="voice-icon-halo">
                  <Sparkles size={18} className="sparkle-icon" />
                </div>
                <div>
                  <h3 className="voice-title">GraniteX Voice Assistant</h3>
                  <span className="voice-subtitle">Bilingual Voice Command &amp; Speech-to-Text</span>
                </div>
              </div>

              <div className="voice-header-actions">
                {/* Language Switcher */}
                <div className="speech-lang-pill">
                  <button 
                    className={`lang-btn ${speechLang === 'ta-IN' ? 'active' : ''}`}
                    onClick={() => setSpeechLang('ta-IN')}
                  >
                    தமிழ் (TA)
                  </button>
                  <button 
                    className={`lang-btn ${speechLang === 'en-IN' ? 'active' : ''}`}
                    onClick={() => setSpeechLang('en-IN')}
                  >
                    English (EN)
                  </button>
                </div>

                {/* TTS Audio Toggle */}
                <button 
                  className={`voice-icon-btn ${ttsEnabled ? 'active' : ''}`}
                  onClick={() => {
                    if (ttsEnabled) stopSpeech()
                    setTtsEnabled(!ttsEnabled)
                  }}
                  title={ttsEnabled ? "Mute Voice Responses" : "Enable Voice Responses"}
                >
                  {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>

                <button className="voice-icon-btn" onClick={handleClose} aria-label="Close Voice Assistant">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Conversation Log Body */}
            <div className="voice-chat-body" ref={chatScrollRef}>
              {messages.map((m, idx) => (
                <div key={idx} className={`voice-bubble ${m.sender}`}>
                  <div className="bubble-content">{m.text}</div>
                  {m.navPath && (
                    <button className="voice-nav-chip" onClick={() => navigate(m.navPath)}>
                      <Navigation size={12} /> Open Page
                    </button>
                  )}
                </div>
              ))}

              {isProcessing && (
                <div className="voice-bubble assistant processing">
                  <RefreshCw size={14} className="spin-icon" />
                  <span>Understanding Speech &amp; Querying ERP Database...</span>
                </div>
              )}

              {isSpeaking && (
                <div className="voice-speaking-bar">
                  <Volume2 size={14} className="pulse-icon" />
                  <span>Speaking response aloud...</span>
                </div>
              )}
            </div>

            {/* Live Speech Recognition Soundwave & Transcript Display */}
            <div className="voice-recording-panel">
              {isListening ? (
                <div className="soundwave-container">
                  <div className="soundwave-bar bar-1" />
                  <div className="soundwave-bar bar-2" />
                  <div className="soundwave-bar bar-3" />
                  <div className="soundwave-bar bar-4" />
                  <div className="soundwave-bar bar-5" />
                  <span className="listening-label">
                    {speechLang === 'ta-IN' ? "பேசுங்கள்... (Listening...)" : "Listening now... Speak your query"}
                  </span>
                </div>
              ) : (
                <div className="idle-label">
                  <HelpCircle size={14} />
                  <span>
                    {speechLang === 'ta-IN' 
                      ? "மைக் பொத்தானை அழுத்தி தமிழில் அல்லது ஆங்கிலத்தில் பேசுங்கள்." 
                      : "Tap the big mic below to start speaking in English or Tamil."}
                  </span>
                </div>
              )}

              {(interimTranscript || transcript) && (
                <div className="live-transcript-box">
                  <span className="transcript-label">Live Speech:</span> "{interimTranscript || transcript}"
                </div>
              )}

              {/* Big Pulsing Microphone Button */}
              <div className="big-mic-wrapper">
                <button 
                  className={`big-mic-btn ${isListening ? 'active' : ''}`}
                  onClick={toggleListening}
                  aria-label={isListening ? "Stop listening" : "Start speech recognition"}
                >
                  {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                  <span className="mic-glow-ring" />
                </button>
                <span className="mic-subtext">
                  {isListening ? "Tap to Stop / முடி" : "Tap to Speak / பேசு"}
                </span>
              </div>
            </div>

            {/* Quick Voice Prompt Shortcuts */}
            <div className="voice-quick-prompts">
              <span className="prompts-label">Try Asking:</span>
              <div className="prompts-chips">
                {quickPrompts.map((p, idx) => (
                  <button 
                    key={idx} 
                    className="prompt-chip"
                    onClick={() => handleUserVoiceInput(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
