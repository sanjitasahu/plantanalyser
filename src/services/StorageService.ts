import { User, Plant, AnalysisResult, CapturedImage } from '../types';

// Keys for localStorage
const STORAGE_KEYS = {
  USER: 'plant_analyzer_user',
  PLANTS: 'plant_analyzer_plants',
  ANALYSIS_RESULTS: 'plant_analyzer_analysis_results',
  CAPTURED_IMAGES: 'plant_analyzer_captured_images',
};

// User storage functions
export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Plant storage functions
export const savePlants = (plants: Plant[]): void => {
  localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(plants));
};

export const getPlants = (): Plant[] => {
  const plantsData = localStorage.getItem(STORAGE_KEYS.PLANTS);
  return plantsData ? JSON.parse(plantsData) : [];
};

export const savePlant = (plant: Plant): void => {
  const plants = getPlants();
  const existingPlantIndex = plants.findIndex(p => p.id === plant.id);
  
  if (existingPlantIndex >= 0) {
    // Update existing plant
    plants[existingPlantIndex] = plant;
  } else {
    // Add new plant
    plants.push(plant);
  }
  
  savePlants(plants);
};

export const removePlant = (plantId: string): void => {
  const plants = getPlants();
  const updatedPlants = plants.filter(plant => plant.id !== plantId);
  savePlants(updatedPlants);
};

// Analysis results storage functions
export const saveAnalysisResults = (results: AnalysisResult[]): void => {
  localStorage.setItem(STORAGE_KEYS.ANALYSIS_RESULTS, JSON.stringify(results));
};

export const getAnalysisResults = (): AnalysisResult[] => {
  const resultsData = localStorage.getItem(STORAGE_KEYS.ANALYSIS_RESULTS);
  return resultsData ? JSON.parse(resultsData) : [];
};

export const saveAnalysisResult = (result: AnalysisResult): void => {
  const results = getAnalysisResults();
  results.push(result);
  saveAnalysisResults(results);
};

export const getPlantAnalysisResults = (plantId: string): AnalysisResult[] => {
  const results = getAnalysisResults();
  return results.filter(result => result.plantId === plantId);
};

// Captured images storage functions
export const saveCapturedImages = (images: CapturedImage[]): void => {
  localStorage.setItem(STORAGE_KEYS.CAPTURED_IMAGES, JSON.stringify(images));
};

export const getCapturedImages = (): CapturedImage[] => {
  const imagesData = localStorage.getItem(STORAGE_KEYS.CAPTURED_IMAGES);
  return imagesData ? JSON.parse(imagesData) : [];
};

export const saveCapturedImage = (image: CapturedImage): void => {
  const images = getCapturedImages();
  images.push(image);
  saveCapturedImages(images);
};

export const removeCapturedImage = (imageId: string): void => {
  const images = getCapturedImages();
  const updatedImages = images.filter(image => image.id !== imageId);
  saveCapturedImages(updatedImages);
};

// Clear all data
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.PLANTS);
  localStorage.removeItem(STORAGE_KEYS.ANALYSIS_RESULTS);
  localStorage.removeItem(STORAGE_KEYS.CAPTURED_IMAGES);
}; 