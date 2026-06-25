import React, { useState, useRef } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface TTSPlayerProps {
  text: string;
}

export function TTSPlayer({ text }: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handlePlay = async () => {
    if (isPlaying) return;
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      
      if (data.success && data.audioBase64) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const binary = atob(data.audioBase64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        
        const audioData = await audioContextRef.current.decodeAudioData(bytes.buffer);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioData;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing TTS', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handlePlay} 
      disabled={isLoading || isPlaying}
      className="text-muted-foreground hover:text-primary rounded-full hover:bg-primary/10"
      title="Listen to description"
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
    </Button>
  );
}
