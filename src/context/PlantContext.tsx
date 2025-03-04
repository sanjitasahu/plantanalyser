import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Plant } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface PlantContextType {
  plants: Plant[];
  isLoading: boolean;
  error: string | null;
  addPlant: (plant: Omit<Plant, 'id' | 'dateAdded'>) => void;
  updatePlant: (id: string, updatedPlant: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  getPlant: (id: string) => Plant | undefined;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

interface PlantProviderProps {
  children: ReactNode;
}

export const PlantProvider: React.FC<PlantProviderProps> = ({ children }) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load plants from localStorage
    const loadPlants = () => {
      try {
        const storedPlants = localStorage.getItem('plants');
        if (storedPlants) {
          setPlants(JSON.parse(storedPlants));
        }
      } catch (err) {
        setError('Failed to load plants from storage');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlants();
  }, []);

  // Save plants to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('plants', JSON.stringify(plants));
    }
  }, [plants, isLoading]);

  const addPlant = (plantData: Omit<Plant, 'id' | 'dateAdded'>) => {
    try {
      const newPlant: Plant = {
        ...plantData,
        id: uuidv4(),
        dateAdded: new Date().toISOString(),
      };

      setPlants((prevPlants) => [...prevPlants, newPlant]);
    } catch (err) {
      setError('Failed to add plant');
      console.error(err);
    }
  };

  const updatePlant = (id: string, updatedPlant: Partial<Plant>) => {
    try {
      setPlants((prevPlants) =>
        prevPlants.map((plant) =>
          plant.id === id ? { ...plant, ...updatedPlant } : plant
        )
      );
    } catch (err) {
      setError('Failed to update plant');
      console.error(err);
    }
  };

  const deletePlant = (id: string) => {
    try {
      setPlants((prevPlants) => prevPlants.filter((plant) => plant.id !== id));
    } catch (err) {
      setError('Failed to delete plant');
      console.error(err);
    }
  };

  const getPlant = (id: string) => {
    return plants.find((plant) => plant.id === id);
  };

  return (
    <PlantContext.Provider
      value={{
        plants,
        isLoading,
        error,
        addPlant,
        updatePlant,
        deletePlant,
        getPlant,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
};

export const usePlants = (): PlantContextType => {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
}; 