import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Trash2, 
  Bot, 
  Mic, 
  MicOff, 
  Sparkles, 
  AlertTriangle, 
  Radio, 
  Disc, 
  Info 
} from "lucide-react";
import { ScanResult } from "../types";

interface ChatbotProps {
  lastScanResult: ScanResult | null;
  translations: any;
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface VoiceTranscript {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export default function Chatbot({ lastScanResult, translations }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMode, setChatMode] = useState<"text" | "voice">("text");
  
  // --- Text Mode States ---
  const [inputMsg, setInputMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-msg",
      sender: "bot",
      text: "Greetings! I am the AuthentiScan AI Verification Companion. Ask me details about product stamps, packaging indicators, supply-line risk scores, or instructions to dispute fraudulent purchases.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Voice Mode States ---
  const [voiceStatus, setVoiceStatus] = useState<"offline" | "connecting" | "streaming">("offline");
  const [voiceError, setVoiceError] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isConnectingVoice, setIsConnectingVoice] = useState(false);
  const [isSimulation, setIsSimulation] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [transcripts, setTranscripts] = useState<VoiceTranscript[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceHelperText, setVoiceHelperText] = useState("");

  // WebSocket / Audio system references
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextInputRef = useRef<AudioContext | null>(null);
  const audioContextOutputRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<any>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const isMutedRef = useRef(false);
  const isSimulationRef = useRef(false);

  // Sync mute state ref
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Auto-suggest notifications based on physical scans
  useEffect(() => {
    if (lastScanResult) {
      setMessages(prev => [
        ...prev,
        {
          id: `con-msg-${Date.now()}`,
          sender: "bot",
          text: `🚨 Core alert: I have synchronized scan details of [${lastScanResult.productName}] (${lastScanResult.status}). Feel free to ask: 'Is my product really fake?' or 'How should I report this counterfeit?'`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
  }, [lastScanResult]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleOpenVoice = (e: Event) => {
      setIsOpen(true);
      setChatMode("voice");
      const customEv = e as CustomEvent;
      if (customEv.detail?.startSession) {
        setTimeout(() => {
          startVoiceSession();
        }, 200);
      }
    };
    window.addEventListener("open-voice-portal", handleOpenVoice);
    return () => {
      window.removeEventListener("open-voice-portal", handleOpenVoice);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // --- VOICE SESSION ENGINE (Live API via Server-Side WebSocket bridge) ---
  const startVoiceSession = async () => {
    setIsConnectingVoice(true);
    setVoiceStatus("connecting");
    setVoiceError("");
    setIsSimulation(false);
    isSimulationRef.current = false;
    setTranscripts([
      { id: "v-init", sender: "bot", text: "Establishing dual-duplex quantum stream gate..." }
    ]);

    try {
      // Connect to the HTTP upgrade WebSocket path
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const socketUrl = `${protocol}//${window.location.host}/api/live-chat`;
      const ws = new WebSocket(socketUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        console.log("Audio gateway stream established. Initializers allocating nodes...");
        setVoiceStatus("streaming");
        setIsVoiceActive(true);
        setIsConnectingVoice(false);
        setTranscripts([
          { id: "v-ready", sender: "bot", text: "Secure voice portal connected. Tap Muted to toggle mic. Speak naturally!" }
        ]);

        if (lastScanResult) {
          setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
              const scanReportMessage = `Explain this scanned product representing brand "${lastScanResult.brand}", product name "${lastScanResult.productName}". Its integrity score is analyzed as ${lastScanResult.authenticityScore}% and the verification status as ${lastScanResult.status}. Dynamic analysis findings are: ${lastScanResult.explanations.map(e => e.title + ' (' + e.description + ')').join(', ')}. Please give me a warm, brief 2-sentence conversational voice breakdown of what this audit flags.`;
              ws.send(JSON.stringify({ text: scanReportMessage }));
              setTranscripts(prev => [
                ...prev,
                { id: `vt-auto-${Date.now()}`, sender: "user", text: `AI voice explanation requested: Describe ${lastScanResult.productName}` }
              ]);
            }
          }, 800);
        }
        
        try {
          // Playback audio context (model outputs synthesized at 24kHz sampling rate)
          const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          audioContextOutputRef.current = outCtx;
          nextStartTimeRef.current = outCtx.currentTime;

          // Request browser microphone
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStreamRef.current = stream;

          // Input audio context (mic captures downsampled at 16kHz Little-Endian PCM)
          const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
          audioContextInputRef.current = inCtx;

          const source = inCtx.createMediaStreamSource(stream);
          const processor = inCtx.createScriptProcessor(4096, 1, 1);
          scriptProcessorRef.current = processor;

          source.connect(processor);
          processor.connect(inCtx.destination);

          // Handle micro-auditory inputs
          processor.onaudioprocess = (e) => {
            if (ws.readyState === WebSocket.OPEN && !isMutedRef.current) {
              const channelData = e.inputBuffer.getChannelData(0);
              const pcmBuffer = float32ToInt16(channelData);
              const base64 = base64ArrayBuffer(pcmBuffer);
              ws.send(JSON.stringify({ audio: base64 }));

              // Capture physical waveform amplitude reacting UI bars
              let sum = 0;
              for (let i = 0; i < channelData.length; i++) {
                sum += channelData[i] * channelData[i];
              }
              const rms = Math.sqrt(sum / channelData.length);
              setMicLevel(Math.min(100, Math.floor(rms * 450)));
            }
          };

        } catch (micErr) {
          console.error("Mic initialization failed:", micErr);
          setVoiceError("Microphone access is unavailable/denied (often blocked in sandbox iframe). Fallback: Type in the input field below to speak with Gemini Live.");
          setVoiceStatus("streaming");
          setIsVoiceActive(true);
          setIsConnectingVoice(false);
          setTranscripts([
            { id: "v-ready-text-fallback", sender: "bot", text: "Secure voice portal connected in text-assist mode. Type your questions below and hear my vocal replies!" }
          ]);
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          
          if (msg.error) {
            setVoiceError(msg.error);
            if (msg.simulation) {
              setIsSimulation(true);
              isSimulationRef.current = true;
            }
          }

          if (msg.text) {
            setTranscripts(prev => [
              ...prev,
              { sender: "bot", text: msg.text, id: `tr-${Date.now()}` }
            ]);
            
            // Speak via Client SpeechSynthesis fallback if in mock simulation or requested
            if (msg.simulatedAudio || isSimulationRef.current) {
              speakUtteranceText(msg.text);
            }
          }

          if (msg.audio) {
            playPCM24kChunk(msg.audio);
          }
          
          if (msg.interrupted) {
            stopVoicePlayback();
          }

        } catch (err) {
          console.error("Audio block parsing failure:", err);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed.");
        cleanupVoiceSession();
      };

      ws.onerror = (err) => {
        console.error("WebSocket link error:", err);
        cleanupVoiceSession();
      };

    } catch (err) {
      console.error("WebSocket live core setup failed:", err);
      cleanupVoiceSession();
    }
  };

  const cleanupVoiceSession = () => {
    setVoiceStatus("offline");
    setIsVoiceActive(false);
    setIsConnectingVoice(false);
    setMicLevel(0);

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {}
      wsRef.current = null;
    }

    if (scriptProcessorRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
      } catch (e) {}
      scriptProcessorRef.current = null;
    }

    if (micStreamRef.current) {
      try {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {}
      micStreamRef.current = null;
    }

    if (audioContextInputRef.current) {
      try {
        audioContextInputRef.current.close();
      } catch (e) {}
      audioContextInputRef.current = null;
    }

    if (audioContextOutputRef.current) {
      try {
        audioContextOutputRef.current.close();
      } catch (e) {}
      audioContextOutputRef.current = null;
    }

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  };

  const stopVoicePlayback = () => {
    // Soft reset outputs to address interruptions immediately
    if (audioContextOutputRef.current) {
      try {
        nextStartTimeRef.current = audioContextOutputRef.current.currentTime;
      } catch (e) {}
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Convert float32 array PCM to int16 format
  const float32ToInt16 = (buffer: Float32Array): ArrayBuffer => {
    const l = buffer.length;
    const buf = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      buf[i] = Math.min(1, Math.max(-1, buffer[i])) * 0x7FFF;
    }
    return buf.buffer;
  };

  // Encode ArrayBuffer to base64
  const base64ArrayBuffer = (arrayBuffer: ArrayBuffer): string => {
    let binary = "";
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Playback PCM chunks on 24kHz Output context gaplessly
  const playPCM24kChunk = (base64Audio: string) => {
    const outCtx = audioContextOutputRef.current;
    if (!outCtx || outCtx.state === "closed") return;

    try {
      const binary = window.atob(base64Audio);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 0x7FFF;
      }

      const audioBuffer = outCtx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = outCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outCtx.destination);

      // Low jitter offset queue sync
      const now = outCtx.currentTime;
      let startTime = nextStartTimeRef.current;
      if (startTime < now) {
        startTime = now + 0.03;
      }
      source.start(startTime);
      nextStartTimeRef.current = startTime + audioBuffer.duration;

    } catch (err) {
      console.error("Failed to play raw audio chunk", err);
    }
  };

  // Web Speak Synthesis fallback
  const speakUtteranceText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const idealVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural")));
      if (idealVoice) {
        utterance.voice = idealVoice;
      }
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- TEXT INTERACTION SYSTEM ---
  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const finalMsg = customText || inputMsg;
    if (!finalMsg.trim() || isLoading) return;

    const userMessage: Message = {
      id: `usr-msg-${Date.now()}`,
      sender: "user",
      text: finalMsg,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMsg("");
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map(m => ({ sender: m.sender, text: m.text }));
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: finalMsg,
          history: historyPayload,
          lastScanResult: lastScanResult
        })
      });

      const data = await response.json();
      
      setMessages(prev => [
        ...prev,
        {
          id: `bot-reply-${Date.now()}`,
          sender: "bot",
          text: data.reply || "Neural transmit interrupted. Recalibrating node pipelines...",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);

    } catch (err) {
      console.error("Chat transmission error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-reply-${Date.now()}`,
          sender: "bot",
          text: "Forensic Core failed to reply. Internal stack transmission is congested. Check GEMINI_API_KEY.",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "cleared-initial",
        sender: "bot",
        text: "Terminal database initialized. Ready for scan-audit questions.",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const toggleMuteBtn = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      cleanupVoiceSession();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Action Circle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="toggle-chatbot-floating-btn"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#00f2ff] to-[#bc13fe] text-white shadow-[0_0_25px_rgba(0,242,255,0.5)] hover:shadow-[0_0_35px_rgba(188,19,254,0.7)] hover:scale-105 transition-all duration-300 cursor-pointer relative"
      >
        {isOpen ? <X className="h-6 w-6 text-slate-950 font-bold" /> : <MessageSquare className="h-6 w-6 text-slate-950 font-bold" />}
        {!isOpen && lastScanResult && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3131] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ff3131] text-[8px] font-bold text-white items-center justify-center leading-none">!</span>
          </span>
        )}
      </button>

      {/* Expanded Terminal Panel */}
      {isOpen && (
        <div 
          className="absolute bottom-16 right-0 w-[350px] sm:w-[410px] h-[520px] rounded-2xl border border-[rgba(100,116,139,0.3)] bg-[#101223]/95 shadow-2xl flex flex-col overflow-hidden text-white glass"
          style={{ boxShadow: "0 0 35px rgba(0, 242, 255, 0.15)" }}
          id="chatbot-expanded-panel-box"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 to-[#101223] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Bot className="h-5 w-5 text-[#00f2ff] neon-text-blue" />
                <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-[#39ff14] animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold leading-none text-white">AuthentiScan Companion</h4>
                <span className="text-[8px] font-mono tracking-widest text-[#00f2ff] uppercase font-bold">Interactive Core</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 shrink-0">
              {chatMode === "text" && (
                <button 
                  onClick={clearChat}
                  title="Clear transmission log"
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* DUAL MODE SELECTOR TAB BAR */}
          <div className="px-4 py-2 border-b border-slate-800/60 bg-slate-950/40 flex items-center justify-between">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-extrabold flex items-center gap-1">
              <Radio className="h-3 w-3 text-cyan-400 animate-pulse" />
              <span>Session Mode:</span>
            </span>
            
            <div className="flex bg-slate-900 border border-slate-800/80 p-0.5 rounded-full relative">
              <button
                onClick={() => {
                  cleanupVoiceSession();
                  setChatMode("text");
                }}
                className={`px-3 py-1 text-[9px] font-mono font-black uppercase rounded-full transition-all cursor-pointer ${
                  chatMode === "text" 
                    ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md font-bold" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Text Terminal
              </button>
              <button
                onClick={() => {
                  setChatMode("voice");
                }}
                className={`px-3 py-1 text-[9px] font-mono font-black uppercase rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                  chatMode === "voice" 
                    ? "bg-gradient-to-r from-[#bc13fe] to-pink-600 text-white shadow-md font-bold" 
                    : "text-[#bc13fe] hover:text-magenta-400"
                }`}
              >
                <Sparkles className="h-2.5 w-2.5 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Live Voice Portal</span>
              </button>
            </div>
          </div>

          {/* Quick Context Sync banner */}
          {lastScanResult && (
            <div className="bg-slate-950/60 border-b border-slate-800/60 px-4 py-2 flex items-center justify-between text-left">
              <div className="truncate pr-4">
                <span className="block text-[8px] font-mono text-slate-500 uppercase leading-none font-bold">Scanned context synchronized</span>
                <span className="block text-[9px] font-bold text-[#00f2ff] truncate mt-0.5">{lastScanResult.productName}</span>
              </div>
              <span className={`text-[8.5px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded ${
                lastScanResult.status === 'Genuine' ? 'bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/25' : 'bg-[#ff3131]/15 text-[#ff3131] border border-[#ff3131]/25'
              }`}>
                {lastScanResult.status}
              </span>
            </div>
          )}

          {/* --- VIEW BRANCH 1: TEXT MODE TERMINAL --- */}
          {chatMode === "text" && (
            <React.Fragment>
              {/* Messages Log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-left bg-[#05060b]/40">
                {messages.map((m) => {
                  const isBot = m.sender === 'bot';
                  return (
                    <div 
                      key={m.id}
                      className={`flex ${isBot ? 'justify-start' : 'justify-end'} text-xs`}
                    >
                      <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 space-y-1 ${
                        isBot 
                          ? 'bg-slate-900/90 text-slate-300 rounded-tl-none border border-slate-800' 
                          : 'bg-gradient-to-r from-cyan-500 to-[#bc13fe] text-white rounded-tr-none shadow-[0_0_10px_rgba(0,242,255,0.2)]'
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed font-semibold">{m.text}</p>
                        <span className="block text-[8px] text-right font-mono tracking-wider opacity-40">{m.timestamp}</span>
                      </div>
                    </div>
                  );
                })}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900 rounded-xl px-4 py-3 rounded-tl-none border border-slate-800 text-slate-400 flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00f2ff] animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00f2ff] animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00f2ff] animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[10px] font-mono tracking-wider">Deconstructing product queries...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick option templates */}
              {messages.length === 1 && (
                <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-slate-800 bg-[#05060b]/40">
                  {[
                    "How does barcode checks work?",
                    "How to read security seals?",
                    "What is on-chain verification?"
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(undefined, q)}
                      className="rounded-full bg-slate-950 border border-slate-800 hover:border-[#00f2ff] text-[10px] text-slate-400 hover:text-[#00f2ff] px-3 py-1 transition-all cursor-pointer font-semibold"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Inputs */}
              <form 
                onSubmit={handleSend}
                className="p-3 border-t border-slate-800 bg-[#05060b] flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Ask anything about this scanned product..."
                  id="chatbot-text-input-field"
                  className="flex-1 rounded-xl bg-slate-900 border border-slate-800 focus:border-[#00f2ff] text-xs text-white p-3 outline-none transition"
                />
                <button
                  type="submit"
                  id="chatbot-submit-send-btn"
                  disabled={isLoading || !inputMsg.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-[#bc13fe] disabled:opacity-40 text-white shadow-[0_0_10px_rgba(0,242,255,0.2)] transition duration-200 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </React.Fragment>
          )}

          {/* --- VIEW BRANCH 2: NEURAL VOICE PORTAL (Live Voice Calls) --- */}
          {chatMode === "voice" && (
            <div className="flex-1 flex flex-col justify-between bg-[#05060b]/70 p-5 relative">
              
              {/* Voice Room Status HUD */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div className="flex items-center space-x-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${
                    voiceStatus === "streaming" 
                      ? "bg-[#39ff14] animate-pulse shadow-[0_0_10px_#39ff14]" 
                      : voiceStatus === "connecting"
                      ? "bg-amber-400 animate-bounce"
                      : "bg-slate-600"
                  }`} />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 font-extrabold">
                    {voiceStatus === "streaming" ? "STREAMS ENGAGED" : voiceStatus === "connecting" ? "SYNCING HANDSHAKE..." : "STANDBY"}
                  </span>
                </div>
                
                {isSimulation && (
                  <span className="text-[8px] font-mono text-[#00f2ff] bg-[#00f2ff]/10 border border-[#00f2ff]/20 px-1.5 py-0.5 rounded uppercase">
                    E-commerce Emulator fallback
                  </span>
                )}
              </div>

              {/* Main Glowing Soundwave visualizer section */}
              <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
                
                {/* Dual-ring Orbit Waves */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  
                  {/* Outer breathing background circle */}
                  <div 
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#bc13fe]/5 via-[#00f2ff]/3 to-pink-500/5 animate-spin duration-150"
                    style={{ 
                      transform: `scale(${1 + micLevel / 120})`,
                      animationDuration: '10s'
                    }}
                  />

                  {/* Reactive pulsing gradient shadow sphere */}
                  <div 
                    className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#bc13fe]/10 to-[#00f2ff]/15 opacity-80 blur-md transition-all duration-100"
                    style={{ transform: `scale(${1 + micLevel / 80})` }}
                  />

                  {/* Main center core logo orb */}
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center z-10 transition-all duration-200 border-2 ${
                    voiceStatus === "streaming" 
                      ? "bg-slate-950 border-[#bc13fe] shadow-[0_0_20px_rgba(188,19,254,0.3)]" 
                      : "bg-slate-900 border-slate-700"
                  }`}>
                    {voiceStatus === "streaming" ? (
                      <Disc className="h-8 w-8 text-[#bc13fe] animate-spin" style={{ animationDuration: '3s' }} />
                    ) : (
                      <MicOff className="h-8 w-8 text-slate-500" />
                    )}
                  </div>

                  {/* Reactive amplitude floating rings */}
                  {voiceStatus === "streaming" && (
                    <div className="absolute inset-4 rounded-full border border-[rgba(0,242,255,0.2)] animate-ping opacity-60" />
                  )}
                </div>

                {/* Vertical audio reactive amplitude bars */}
                {voiceStatus === "streaming" && (
                  <div className="flex items-center space-x-1.5 h-6 mt-5">
                    {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((val, idx) => {
                      const scale = micLevel > 5 ? (micLevel * val * 0.25) / 10 : val * 2;
                      const height = Math.min(24, Math.max(3, scale));
                      return (
                        <div 
                          key={idx}
                          className="w-1 rounded-full bg-gradient-to-t from-[#bc13fe] to-[#00f2ff] transition-all duration-75"
                          style={{ height: `${height}px` }}
                        />
                      );
                    })}
                  </div>
                )}

                {voiceError && (
                  <div className="mt-3 px-3 py-2 rounded bg-red-950/40 border border-red-500/30 text-[10px] text-red-200 font-mono text-center flex items-start gap-1.5 max-w-[90%]">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-400 mt-0.5" />
                    <span className="text-left leading-snug">{voiceError}</span>
                  </div>
                )}
              </div>

              {/* Dynamic Transcript Live logs */}
              <div className="h-28 bg-slate-950/80 rounded-xl border border-slate-900/90 p-3 overflow-y-auto mb-3 text-left custom-scrollbar relative">
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest font-extrabold mb-1 px-1">Live Captioning:</span>
                
                <div className="space-y-1.5">
                  {transcripts.length === 0 ? (
                    <p className="text-[10px] font-mono text-slate-500 italic p-1">Speak into your microphone to generate neural transcripts from Gemini 3 Live API...</p>
                  ) : (
                    transcripts.map((t) => (
                      <p key={t.id} className="text-[10px] leading-snug font-semibold text-slate-300 px-1 font-mono">
                        <strong className={t.sender === 'bot' ? 'text-cyan-400' : 'text-purple-400'}>
                          {t.sender === 'bot' ? 'Gemini: ' : 'You: '}
                        </strong>
                        {t.text}
                      </p>
                    ))
                  )}
                </div>
              </div>

              {/* Text helper for voice chat fallback */}
              {isVoiceActive && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!voiceHelperText.trim()) return;
                    
                    // Add user transcript immediately
                    setTranscripts((prev) => [
                      ...prev,
                      { id: `vt-${Date.now()}`, sender: "user", text: voiceHelperText }
                    ]);
                    
                    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                      wsRef.current.send(JSON.stringify({ text: voiceHelperText }));
                    } else {
                      // WS closed but display response mock locally
                      setTimeout(() => {
                        setTranscripts((prev) => [
                          ...prev,
                          { id: `vt-bot-${Date.now()}`, sender: "bot", text: "Interactive channel disconnected. Restart Voice Portal." }
                        ]);
                      }, 1000);
                    }
                    setVoiceHelperText("");
                  }}
                  className="mb-3 flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80"
                >
                  <input
                    type="text"
                    value={voiceHelperText}
                    onChange={(e) => setVoiceHelperText(e.target.value)}
                    placeholder="Type to chat with fallback voice companion..."
                    className="flex-1 bg-transparent text-[11px] text-white placeholder-slate-500 px-2 py-1 outline-none font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#bc13fe] to-pink-600 hover:opacity-95 text-white font-bold text-[9px] uppercase cursor-pointer shrink-0"
                  >
                    Send to AI
                  </button>
                </form>
              )}

              {/* Action buttons (Mute/Stream Connection controls) */}
              <div className="flex items-center justify-center space-x-3">
                {isVoiceActive ? (
                  <React.Fragment>
                    {/* Microphone Mute command toggle */}
                    <button
                      onClick={toggleMuteBtn}
                      className={`flex h-11 px-4 items-center justify-center rounded-xl border transition cursor-pointer text-xs font-mono font-bold space-x-2 ${
                        isMuted 
                          ? "bg-purple-950/40 text-purple-400 border-purple-500/40 hover:bg-purple-950/60" 
                          : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
                      }`}
                    >
                      {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-[#00f2ff]" />}
                      <span>{isMuted ? "MIC MUTED" : "MIC ACTIVE"}</span>
                    </button>

                    {/* Disconnect stream button */}
                    <button
                      onClick={cleanupVoiceSession}
                      className="flex h-11 px-4 items-center justify-center rounded-xl bg-red-950/40 border border-red-500/30 hover:bg-red-500/10 text-red-400 text-xs font-mono font-bold cursor-pointer"
                    >
                      <span>DISCONNECT PORTAL</span>
                    </button>
                  </React.Fragment>
                ) : (
                  <button
                    onClick={startVoiceSession}
                    disabled={isConnectingVoice}
                    className="w-full flex h-11 items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-[#bc13fe] to-pink-600 font-extrabold text-xs text-white shadow-[0_0_15px_rgba(188,19,254,0.4)] hover:scale-101 transition cursor-pointer disabled:opacity-40"
                  >
                    <Mic className="h-4 w-4 animate-pulse text-white" />
                    <span>{isConnectingVoice ? "ALLOCATING HANDSHAKE..." : "ENTER LIVE NEURAL VOICE PORTAL"}</span>
                  </button>
                )}
              </div>

              {/* Guidance footer notation */}
              <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest text-center mt-3 flex items-center justify-center gap-1">
                <Info className="h-3 w-3" />
                <span>Secure little-endian 16-bit PCM voice tunnel</span>
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
