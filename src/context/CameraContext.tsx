import React, { createContext, useContext, useState, useRef, ReactNode, RefObject } from 'react';
import { CapturedImage } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface CameraContextType {
  capturedImages: CapturedImage[];
  currentImage: CapturedImage | null;
  isCapturing: boolean;
  error: string | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureImage: () => Promise<CapturedImage | null>;
  deleteImage: (id: string) => void;
  setCurrentImage: (image: CapturedImage | null) => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

interface CameraProviderProps {
  children: ReactNode;
}

export const CameraProvider: React.FC<CameraProviderProps> = ({ children }) => {
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<CapturedImage | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load captured images from localStorage
  React.useEffect(() => {
    const storedImages = localStorage.getItem('capturedImages');
    if (storedImages) {
      setCapturedImages(JSON.parse(storedImages));
    }
  }, []);

  // Save captured images to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('capturedImages', JSON.stringify(capturedImages));
  }, [capturedImages]);

  const startCamera = async () => {
    try {
      setError(null);
      setIsCapturing(true);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use the back camera if available
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      setError('Failed to access camera');
      setIsCapturing(false);
      console.error(err);
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
    
    setIsCapturing(false);
  };

  const captureImage = async (): Promise<CapturedImage | null> => {
    try {
      if (!videoRef.current || !canvasRef.current) {
        throw new Error('Video or canvas reference not available');
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Could not get canvas context');
      }
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/jpeg');
      
      // Create a new captured image
      const newImage: CapturedImage = {
        id: uuidv4(),
        dataUrl,
        timestamp: new Date().toISOString()
      };
      
      // Add to captured images
      setCapturedImages(prev => [...prev, newImage]);
      setCurrentImage(newImage);
      
      return newImage;
    } catch (err) {
      setError('Failed to capture image');
      console.error(err);
      return null;
    }
  };

  const deleteImage = (id: string) => {
    setCapturedImages(prev => prev.filter(image => image.id !== id));
    
    if (currentImage && currentImage.id === id) {
      setCurrentImage(null);
    }
  };

  const contextValue: CameraContextType = {
    capturedImages,
    currentImage,
    isCapturing,
    error,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    captureImage,
    deleteImage,
    setCurrentImage
  };

  return (
    <CameraContext.Provider value={contextValue}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = (): CameraContextType => {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
}; 