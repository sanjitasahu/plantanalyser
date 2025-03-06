// User related types
export interface User {
  id: string;
  name: string;
  email: string;
}

// Plant related types
export interface Plant {
  id: string;
  name: string;
  species?: string;
  imageUrl?: string;
  images: string[];
  dateAdded: string;
  lastWatered: string;
  wateringFrequency: string;
  sunlightNeeds: string;
  notes?: string;
  healthStatus: 'Healthy' | 'Needs attention' | 'Unhealthy';
}

// Captured Image type
export interface CapturedImage {
  id: string;
  dataUrl: string;
  timestamp: string;
  plantId?: string;
}

// Plant Identification type
export interface PlantIdentification {
  name: string;
  scientificName: string;
  confidence: number;
  description: string;
  tags?: string[];
}

// Plant Health Issue type
export interface PlantHealthIssue {
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  solution?: string;
}

// Plant Health type
export interface PlantHealth {
  status: 'Healthy' | 'Needs attention' | 'Unhealthy';
  summary: string;
  issues: PlantHealthIssue[];
}

// Plant Care type
export interface PlantCare {
  watering: string;
  light: string;
  soil: string;
  temperature: string;
  additionalTips?: string;
  summary: string;
  humidity?: string;
  homeRemedies?: string;
  culturalSignificance?: string;
}

// Analysis Result type
export interface AnalysisResult {
  id: string;
  plantId?: string;
  imageUrl: string;
  date: string;
  identification: PlantIdentification;
  health: PlantHealth;
  care: PlantCare;
}

// Auth Context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Plant Context type
export interface PlantContextType {
  plants: Plant[];
  isLoading: boolean;
  error: string | null;
  addPlant: (plant: Omit<Plant, 'id' | 'dateAdded'>) => void;
  updatePlant: (id: string, updatedPlant: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  getPlant: (id: string) => Plant | undefined;
}

// Analysis Context type
export interface AnalysisContextType {
  analysisResults: AnalysisResult[];
  currentAnalysis: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  analyzeImage: (imageUrl: string, plantId?: string) => Promise<AnalysisResult | undefined>;
  getAnalysisHistory: (plantId: string) => AnalysisResult[];
  clearCurrentAnalysis: () => void;
}

// Camera Context type
export interface CameraContextType {
  capturedImages: CapturedImage[];
  currentImage: CapturedImage | null;
  isCapturing: boolean;
  error: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureImage: () => Promise<CapturedImage | null>;
  deleteImage: (id: string) => void;
  setCurrentImage: (image: CapturedImage | null) => void;
}

// Gemini API Response types
export interface GeminiIdentificationResponse {
  name: string;
  scientificName: string;
  confidence: number;
  description: string;
  tags?: string[];
}

export interface GeminiHealthResponse {
  status: 'Healthy' | 'Needs attention' | 'Unhealthy';
  summary: string;
  issues: {
    name: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    solution?: string;
  }[];
}

export interface GeminiCareResponse {
  watering: string;
  light: string;
  soil: string;
  temperature: string;
  additionalTips?: string;
  summary?: string;
  humidity?: string;
  homeRemedies?: string;
  culturalSignificance?: string;
} 