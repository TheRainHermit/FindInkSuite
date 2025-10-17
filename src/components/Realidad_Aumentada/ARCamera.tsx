import React, { useRef, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ARCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setIsActive(true);
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      alert('No se pudo acceder a la cámara. Asegúrate de dar permisos.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>👁️ Vista AR en Tiempo Real</span>
          <Button 
            variant={isActive ? "destructive" : "default"}
            onClick={() => isActive ? stopCamera() : startCamera()}
          >
            {isActive ? "Detener Cámara" : "Activar Cámara"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <video 
            ref={videoRef}
            autoPlay 
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas 
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/70 p-4 rounded-full">
            <Button size="icon" variant="outline" onClick={() => {}}>⬅️</Button>
            <Button size="icon" variant="outline" onClick={() => {}}>➡️</Button>
            <Button size="icon" variant="outline" onClick={() => {}}>⬆️</Button>
            <Button size="icon" variant="outline" onClick={() => {}}>⬇️</Button>
            <Button size="icon" variant="outline" onClick={() => {}}>👁️</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};