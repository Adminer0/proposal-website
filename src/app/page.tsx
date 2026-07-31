'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SITE_CONFIG } from '@/config';
import type { SceneId, ConsentMode } from '@/types';

import UnlockScreen from '@/components/UnlockScreen';
import ConsentScreen from '@/components/ConsentScreen';
import RecordingIndicator from '@/components/RecordingIndicator';
import Scene1Cake from '@/components/scenes/Scene1Cake';
import Scene2CakeInteraction from '@/components/scenes/Scene2CakeInteraction';
import Scene3ParkWalk from '@/components/scenes/Scene3ParkWalk';
import Scene4Proposal from '@/components/scenes/Scene4Proposal';
import Scene5RingChase from '@/components/scenes/Scene5RingChase';
import Scene6Comfort from '@/components/scenes/Scene6Comfort';
import Scene7Proposal from '@/components/scenes/Scene7Proposal';
import FinalScene from '@/components/scenes/FinalScene';

const SCENES: SceneId[] = ['scene1', 'scene2', 'scene3', 'scene4', 'scene5', 'scene6', 'scene7', 'final'];

/** Main page — scene orchestrator */
export default function Home() {
  const [isLocked, setIsLocked] = useState(true);
  const [showConsent, setShowConsent] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordStartTime, setRecordStartTime] = useState<Date | null>(null);
  const [muted, setMuted] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Check unlock date
  useEffect(() => {
    const check = () => {
      const now = new Date();
      if (now >= SITE_CONFIG.UNLOCK_DATE) {
        setIsLocked(false);
        setShowConsent(true);
      }
    };
    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle consent
  const handleConsent = useCallback(async (mode: ConsentMode) => {
    setShowConsent(false);

    if (mode === 'exit') {
      window.close();
      return;
    }

    if (mode === 'record') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const recorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9,opus',
          videoBitsPerSecond: 2_500_000,
        });
        chunksRef.current = [];
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'proposal-reaction.webm';
          a.click();
          URL.revokeObjectURL(url);
          stream.getTracks().forEach(t => t.stop());
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
        setRecordStartTime(new Date());
      } catch (err) {
        console.warn('Recording failed:', err);
      }
    }
  }, []);

  // Scene completion handler
  const handleSceneComplete = useCallback(() => {
    if (currentScene < SCENES.length - 1) {
      setCurrentScene(prev => prev + 1);
    }
  }, [currentScene]);

  // Final scene replay
  const handleReplay = useCallback(() => {
    // Stop recording
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordStartTime(null);
    setCurrentScene(0);
  }, []);

  // Stop recording when final scene ends
  useEffect(() => {
    if (SCENES[currentScene] === 'final' && isRecording) {
      // Recording continues through final scene, stops on replay
    }
  }, [currentScene, isRecording]);

  return (
    <main className="w-full h-screen overflow-hidden relative">
      {/* Recording indicator */}
      <RecordingIndicator isRecording={isRecording} startTime={recordStartTime} />

      {/* Mute toggle */}
      <button
        onClick={() => setMuted(!muted)}
        className="fixed top-4 left-4 z-[200] w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 transition-all text-sm"
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      {/* Unlock screen */}
      {isLocked && <UnlockScreen onUnlock={() => { setIsLocked(false); setShowConsent(true); }} />}

      {/* Consent screen */}
      {showConsent && !isLocked && <ConsentScreen onConsent={handleConsent} />}

      {/* Scenes */}
      {!isLocked && !showConsent && (
        <AnimatePresence mode="wait">
          {SCENES[currentScene] === 'scene1' && <Scene1Cake key="s1" onComplete={handleSceneComplete} />}
          {SCENES[currentScene] === 'scene2' && <Scene2CakeInteraction key="s2" onComplete={handleSceneComplete} />}
          {SCENES[currentScene] === 'scene3' && <Scene3ParkWalk key="s3" onComplete={handleSceneComplete} />}
          {SCENES[currentScene] === 'scene4' && <Scene4Proposal key="s4" onComplete={handleSceneComplete} />}
          {SCENES[currentScene] === 'scene5' && <Scene5RingChase key="s5" onComplete={handleSceneComplete} />}
          {SCENES[currentScene] === 'scene6' && <Scene6Comfort key="s6" onComplete={handleSceneComplete} />}
          {SCENES[currentScene] === 'scene7' && <Scene7Proposal key="s7" onComplete={handleSceneComplete} />}
          {SCENES[currentScene] === 'final' && <FinalScene key="final" onComplete={handleReplay} />}
        </AnimatePresence>
      )}

      {/* Progress dots */}
      {!isLocked && !showConsent && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
          {SCENES.map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentScene ? 'bg-white scale-125' : i < currentScene ? 'bg-white/50' : 'bg-white/20'
              }`}
              animate={i === currentScene ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
