import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { Loader } from './components/Loader';
import { PlantDashboard } from './components/PlantDashboard';
import { AppState, PlantInfo } from './types';
import { analyzePlantImage } from './services/geminiService';
import { fileToBase64 } from './services/imageUtils';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleImageSelected = useCallback(async (file: File) => {
    try {
      setAppState(AppState.ANALYZING);
      setError('');
      
      // Create preview URL immediately
      const base64 = await fileToBase64(file);
      setImagePreview(`data:image/jpeg;base64,${base64}`);
      
      // Analyze with Gemini
      const data = await analyzePlantImage(base64);
      setPlantInfo(data);
      setAppState(AppState.RESULTS);

    } catch (err) {
      console.error("App Error:", err);
      setError("Could not identify the plant. Please try another clear photo.");
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setPlantInfo(null);
    setImagePreview('');
    setError('');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onReset={handleReset} />
      
      <main className="container mx-auto pb-12">
        {appState === AppState.IDLE && (
          <UploadSection onImageSelected={handleImageSelected} />
        )}

        {appState === AppState.ANALYZING && (
          <Loader />
        )}

        {appState === AppState.ERROR && (
           <div className="max-w-md mx-auto mt-12 text-center p-8 bg-white rounded-2xl shadow-lg border border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Analysis Failed</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={handleReset}
                className="bg-emerald-600 text-white px-6 py-2 rounded-full font-medium hover:bg-emerald-700 transition-colors"
              >
                Try Again
              </button>
           </div>
        )}

        {appState === AppState.RESULTS && plantInfo && (
          <PlantDashboard plantInfo={plantInfo} imagePreview={imagePreview} />
        )}
      </main>
    </div>
  );
};

export default App;