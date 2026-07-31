export type SceneId = 'unlock' | 'consent' | 'scene1' | 'scene2' | 'scene3' | 'scene4' | 'scene5' | 'scene6' | 'scene7' | 'final';
export type CharacterPose = 'standing' | 'walking' | 'kneeling' | 'sitting' | 'sad' | 'happy' | 'surprised';
export type ConsentMode = 'record' | 'no-record' | 'exit';
export interface RecordingState { isRecording: boolean; startTime: Date | null; mediaRecorder: MediaRecorder | null; chunks: Blob[]; }
export interface AuthState { isAuthenticated: boolean; passwords: string[]; }
export interface SceneProps { onComplete: () => void; }
export interface AudioTrack { id: string; src: string; loop: boolean; volume: number; }
