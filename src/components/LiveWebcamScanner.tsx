import { useState, useRef, useEffect } from "react";
import { Camera, CameraOff, Sparkles, Scan } from "lucide-react";

interface LiveWebcamScannerProps {
  onCapture: (base64Image: string) => void;
  isScanning: boolean;
}

export default function LiveWebcamScanner({ onCapture, isScanning }: LiveWebcamScannerProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [errorStatus, setErrorStatus] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Synchronize ref with stream state
  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  // Simulated detections that update in real time on the webcam feed
  const [liveDetections, setLiveDetections] = useState<{ label: string; confidence: number; x: number; y: number; w: number; h: number }[]>([
    { label: "Target: Electronics Box", confidence: 99.4, x: 20, y: 25, w: 60, h: 50 },
    { label: "Logo Mismatch Trace", confidence: 87.2, x: 42, y: 35, w: 16, h: 14 }
  ]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (stream) {
      // Small jitter effect to simulate AI detection tracking coordinates live
      interval = setInterval(() => {
        setLiveDetections(prev => prev.map(det => ({
          ...det,
          x: det.x + (Math.random() * 2 - 1) * 0.5,
          y: det.y + (Math.random() * 2 - 1) * 0.5,
          confidence: Math.min(99.9, Math.max(80, det.confidence + (Math.random() * 0.6 - 0.3)))
        })));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [stream]);

  const startCamera = async () => {
    setErrorStatus("");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = mediaStream;
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.log("Webcam access declined or unavailable, running automated simulation feed.", err);
      setErrorStatus("Primary hardware video pipeline unavailable. Initiated cyber scan simulation.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStream(null);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) {
      // Simulate frame capture if camera is offline using standard mock canvas
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0c0d12";
        ctx.fillRect(0, 0, 400, 300);
        ctx.strokeStyle = "#4f46e5";
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, 380, 280);
        ctx.font = "14px monospace";
        ctx.fillStyle = "#818cf8";
        ctx.fillText("SIMULATED HARDWARE SCREENSHOT", 60, 140);
        ctx.fillText("UP TIME NODE: " + new Date().toLocaleTimeString(), 60, 170);
      }
      onCapture(canvas.toDataURL("image/png"));
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const b64 = canvas.toDataURL("image/png");
      onCapture(b64);
    }
  };

  return (
    <div className="relative rounded-2xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/85 p-4 shadow-xl glass neon-glow-blue">
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/10 via-transparent to-transparent pointer-events-none rounded-2xl" />

      {/* Header controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-[#39ff14] animate-pulse" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest">Webcam Live Matrix</h3>
        </div>
        {!stream ? (
          <button
            onClick={startCamera}
            className="flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-[#bc13fe] px-3 py-1.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(0,242,255,0.3)] hover:scale-101 transition-all cursor-pointer"
          >
            <Camera className="h-3.5 w-3.5 text-white" />
            <span>Engage Feed</span>
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="flex items-center space-x-1.5 rounded-lg bg-[#ff3131]/10 text-[#ff3131] border border-[#ff3131]/30 px-3 py-1.5 text-xs font-semibold hover:bg-[#ff3131]/20 transition-all cursor-pointer"
          >
            <CameraOff className="h-3.5 w-3.5" />
            <span>Terminate</span>
          </button>
        )}
      </div>

      {/* Primary Video Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#05060b] border border-slate-800 flex items-center justify-center">
        
        {stream ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover scale-x-[-1]"
            />
            {/* Live canvas for coordinate grabs */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Neural Detections Box Overlays */}
            {liveDetections.map((det, index) => (
              <div
                key={index}
                className="absolute border-2 border-[#00f2ff]/65 rounded pointer-events-none"
                style={{
                  left: `${det.x}%`,
                  top: `${det.y}%`,
                  width: `${det.w}%`,
                  height: `${det.h}%`,
                  boxShadow: "0 0 12px rgba(0,242,255,0.35)"
                }}
              >
                <span className="absolute -top-5 left-0 font-mono text-[9px] bg-slate-950/95 text-[#00f2ff] border border-[#00f2ff]/35 px-1.5 py-0.5 rounded uppercase leading-none whitespace-nowrap font-black">
                  {det.label} ({det.confidence.toFixed(1)}%)
                </span>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center px-6 py-10 space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 border border-slate-800 text-slate-500">
              <Scan className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">NEURAL CAMERA MATRIX OFFLINE</p>
              <p className="text-[10px] text-slate-500 mt-1 max-w-[280px]">Engage the camera feed above or upload a static snapshot from files below.</p>
            </div>
          </div>
        )}

        {/* Laser scanner effect when analysis runs */}
        {isScanning && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent shadow-[0_0_15px_rgba(0,242,255,1)] animate-bounce z-10" />
        )}

        {/* Ambient reticles */}
        <div className="absolute top-3 left-3 h-3 w-3 border-t-2 border-l-2 border-[#00f2ff]/45 pointer-events-none" />
        <div className="absolute top-3 right-3 h-3 w-3 border-t-2 border-r-2 border-[#00f2ff]/45 pointer-events-none" />
        <div className="absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-[#00f2ff]/45 pointer-events-none" />
        <div className="absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-[#00f2ff]/45 pointer-events-none" />
      </div>

      {errorStatus && (
        <div className="mt-2.5 text-[10px] text-slate-500 font-mono border-t border-slate-800 pt-2 flex items-center justify-between">
          <span>{errorStatus}</span>
          <button 
            onClick={captureFrame} 
            className="text-[10px] font-bold text-[#00f2ff] hover:underline cursor-pointer"
          >
            Force Screenshot Simulation
          </button>
        </div>
      )}

      {/* Screen snapshot snap trigger */}
      {stream && (
        <div className="mt-3">
          <button
            onClick={captureFrame}
            id="camera-snap-trigger-btn"
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-[#00f2ff] to-[#bc13fe] py-3 text-xs font-black text-slate-950 shadow-[0_0_15px_rgba(0,242,255,0.4)] hover:shadow-cyan-500/20 active:scale-98 transition duration-200 cursor-pointer uppercase"
          >
            <Sparkles className="h-4 w-4" />
            <span>Snap Screen for High-Res Neural Audit</span>
          </button>
        </div>
      )}
    </div>
  );
}
