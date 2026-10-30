import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscriptChange: (text: string) => void;
  isProcessing?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptChange, isProcessing = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript + ' ';
      }
      onTranscriptChange(currentTranscript.trim());
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscriptChange]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center text-xs text-slate-500 gap-1 bg-slate-100 px-3 py-1.5 rounded-md">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
        <span>Voice input unsupported on this browser (use Chrome/Edge or type directly).</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={isProcessing}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm ${
        isListening
          ? 'bg-rose-500 text-white animate-pulse hover:bg-rose-600'
          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
      }`}
    >
      {isListening ? (
        <>
          <MicOff className="w-4 h-4" />
          <span>Recording Voice (Click to stop)</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 text-indigo-600" />
          <span>Record with Microphone</span>
        </>
      )}
    </button>
  );
};
