import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';

// Helper to convert float32 PCM to base64
function pcmToBase64(pcmData: Float32Array): string {
  const buffer = new ArrayBuffer(pcmData.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < pcmData.length; i++) {
    // scale to 16-bit integer
    let s = Math.max(-1, Math.min(1, pcmData[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function VoiceAssistant() {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  
  // Audio contexts
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  const connect = async () => {
    try {
      inputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setIsConnected(true);
        await startRecording();
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.audio) {
            playAudioChunk(outputAudioCtxRef.current!, msg.audio);
          }
          if (msg.interrupted) {
            // Stop playback, clear queue (minimal implementation)
            nextPlayTimeRef.current = outputAudioCtxRef.current!.currentTime;
          }
        } catch (e) {
          console.error("Error parsing message", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        stopRecording();
      };
    } catch (e) {
      console.error("Connection failed", e);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    stopRecording();
  };

  const playAudioChunk = (audioCtx: AudioContext, base64: string) => {
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0;
      }
      
      const audioBuffer = audioCtx.createBuffer(1, float32.length, 24000);
      audioBuffer.copyToChannel(float32, 0);
      
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      
      const currentTime = audioCtx.currentTime;
      if (nextPlayTimeRef.current < currentTime) {
        nextPlayTimeRef.current = currentTime;
      }
      source.start(nextPlayTimeRef.current);
      nextPlayTimeRef.current += audioBuffer.duration;
    } catch (e) {
      console.error("Audio playback error", e);
    }
  };

  const startRecording = async () => {
    try {
      if (inputAudioCtxRef.current!.state === 'suspended') {
        await inputAudioCtxRef.current!.resume();
      }
      if (outputAudioCtxRef.current!.state === 'suspended') {
        await outputAudioCtxRef.current!.resume();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const source = inputAudioCtxRef.current!.createMediaStreamSource(stream);
      const processor = inputAudioCtxRef.current!.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      source.connect(processor);
      processor.connect(inputAudioCtxRef.current!.destination);

      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
          wsRef.current.send(JSON.stringify({ audio: base64 }));
        }
      };
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={isConnected ? disconnect : connect}
          className={`rounded-full w-16 h-16 shadow-2xl flex items-center justify-center ${isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
        >
          {isConnected ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
        </Button>
      </motion.div>
      {isConnected && (
        <div className="absolute bottom-20 right-0 bg-card border border-border p-3 rounded-lg shadow-xl w-48 text-center text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
             <span>Listening...</span>
          </div>
          <p className="text-muted-foreground text-xs">Speak to ask about our services</p>
        </div>
      )}
    </div>
  );
}
