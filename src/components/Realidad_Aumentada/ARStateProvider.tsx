import React, { createContext, useContext, useState } from 'react';

interface ARState {
  active: boolean;
  currentTattoo: any | null;
  videoStream: MediaStream | null;
  position: { x: number; y: number };
  size: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  skinTone: string;
  bodyPart: string;
  tattooImage: HTMLImageElement | null;
}

interface ARContextType {
  ARState: ARState;
  startARCamera: () => Promise<void>;
  stopARCamera: () => void;
  drawFrame: () => void;
  updateTattooSize: (size: number) => void;
  updateTattooRotation: (rotation: number) => void;
  updateTattooOpacity: (opacity: number) => void;
  updateTattooPosition: (bodyPart: string) => void;
  setVideoRef: (el: HTMLVideoElement | null) => void;
  setCanvasRef: (el: HTMLCanvasElement | null) => void;
  setTattooImage: (img: HTMLImageElement | null, meta?: any) => void;
}

const initialState: ARState = {
  active: false,
  currentTattoo: null,
  videoStream: null,
  position: { x: 0, y: 0 },
  size: 100,
  rotation: 0,
  opacity: 80,
  visible: true,
  skinTone: '#FFDBB5',
  bodyPart: 'brazo',
  tattooImage: null,
};

const ARContext = createContext<ARContextType | undefined>(undefined);

export const ARStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ARState>(initialState);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const setVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
  };

  const setCanvasRef = (el: HTMLCanvasElement | null) => {
    canvasRef.current = el;
  };

  const setTattooImage = (img: HTMLImageElement | null, meta?: any) => {
    setState(prev => ({ ...prev, tattooImage: img, currentTattoo: meta || prev.currentTattoo }));
  };

  const startARCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setState(prev => ({
        ...prev,
        videoStream: stream,
        active: true
      }));
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopARCamera = () => {
    if (state.videoStream) {
      state.videoStream.getTracks().forEach(track => track.stop());
    }
    setState(prev => ({
      ...prev,
      videoStream: null,
      active: false
    }));
  };

  const drawFrame = () => {
    try {
      if (!videoRef.current || !canvasRef.current) return;
      const v = videoRef.current;
      const c = canvasRef.current;
      const ctx = c.getContext('2d');
      if (!ctx) return;

      // Ajustar tamaño del canvas al video
      if (c.width !== v.videoWidth || c.height !== v.videoHeight) {
        c.width = v.videoWidth || 640;
        c.height = v.videoHeight || 480;
      }

      ctx.clearRect(0, 0, c.width, c.height);
      if (v.readyState === v.HAVE_ENOUGH_DATA) {
        ctx.drawImage(v, 0, 0, c.width, c.height);

        // Si hay tatuaje cargado, dibujarlo en el centro
        if (state.tattooImage && state.visible) {
          const centerX = c.width / 2 + state.position.x;
          const centerY = c.height / 2 + state.position.y;
          const imgSize = state.size * 2;
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate((state.rotation * Math.PI) / 180);
          ctx.globalAlpha = state.opacity / 100;
          ctx.drawImage(state.tattooImage, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
          ctx.restore();
        }
      }
    } catch (err) {
      console.error('drawFrame error', err);
    }
  };

  const updateTattooSize = (size: number) => {
    setState(prev => ({ ...prev, size }));
  };

  const updateTattooRotation = (rotation: number) => {
    setState(prev => ({ ...prev, rotation }));
  };

  const updateTattooOpacity = (opacity: number) => {
    setState(prev => ({ ...prev, opacity }));
  };

  const updateTattooPosition = (bodyPart: string) => {
    const positions = {
      brazo: { x: 0, y: -50 },
      pierna: { x: 0, y: 30 },
      pecho: { x: 0, y: -80 },
      espalda: { x: 0, y: 0 },
      muneca: { x: 0, y: 60 }
    };

    setState(prev => ({
      ...prev,
      bodyPart,
      position: positions[bodyPart as keyof typeof positions] || { x: 0, y: 0 }
    }));
  };

  return (
    <ARContext.Provider value={{
      ARState: state,
      startARCamera,
      stopARCamera,
      drawFrame,
      updateTattooSize,
      updateTattooRotation,
      updateTattooOpacity,
      updateTattooPosition
      , setVideoRef, setCanvasRef, setTattooImage
    }}>
      {children}
    </ARContext.Provider>
  );
};

export const useARState = () => {
  const context = useContext(ARContext);
  if (!context) {
    throw new Error('useARState must be used within an ARStateProvider');
  }
  return context;
};