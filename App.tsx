import React, { useState, useEffect } from 'react';
import { AppStep, DesignStyle, Gender, UserPreferences, SavedDesign, GeneratedDesign } from './types';
import Hero from './components/Hero';
import GenderSelector from './components/GenderSelector';
import DesignSelector from './components/DesignSelector';
import Quiz from './components/Quiz';
import Generator from './components/Generator';
import History from './components/History';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [preferences, setPreferences] = useState<UserPreferences>({
    gender: null,
    selectedStyle: null,
    quizAnswers: {},
    uploadedImage: null,
  });
  
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('noksha_history');
    if (stored) {
      try {
        setSavedDesigns(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleStart = () => {
    setStep(AppStep.GENDER_SELECTION);
    window.scrollTo(0, 0);
  };

  const handleGenderSelect = (gender: Gender) => {
    setPreferences(prev => ({ ...prev, gender }));
    setStep(AppStep.STYLE_SELECTION);
    window.scrollTo(0, 0);
  };

  const handleBackToGender = () => {
    setStep(AppStep.GENDER_SELECTION);
    setPreferences(prev => ({ ...prev, gender: null }));
  };

  const handleStyleSelect = (style: DesignStyle, uploadedImage: string | null) => {
    setPreferences((prev) => ({ ...prev, selectedStyle: style, uploadedImage }));
    setStep(AppStep.PSYCH_QUIZ);
    window.scrollTo(0, 0);
  };

  const handleQuizComplete = (answers: Record<number, string>) => {
    setPreferences((prev) => ({ ...prev, quizAnswers: answers }));
    setStep(AppStep.GENERATING);
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    setPreferences({ gender: null, selectedStyle: null, quizAnswers: {}, uploadedImage: null });
    setStep(AppStep.LANDING);
    window.scrollTo(0, 0);
  };
  
  const handleViewHistory = () => {
    setStep(AppStep.HISTORY);
    window.scrollTo(0, 0);
  };

  const handleSaveDesign = (design: GeneratedDesign) => {
    if (!preferences.gender || !preferences.selectedStyle) return;

    const newSavedDesign: SavedDesign = {
        ...design,
        id: Date.now().toString(),
        timestamp: Date.now(),
        gender: preferences.gender,
        styleName: preferences.selectedStyle.name
    };

    const updatedHistory = [...savedDesigns, newSavedDesign];
    setSavedDesigns(updatedHistory);
    localStorage.setItem('noksha_history', JSON.stringify(updatedHistory));
  };

  return (
    <div className="font-sans antialiased text-gray-900">
      {/* Dynamic Header */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center pointer-events-none">
        <div className={`text-2xl font-serif font-bold transition-opacity duration-300 pointer-events-auto ${step === AppStep.LANDING ? 'opacity-0' : 'opacity-100 text-brand-900'}`}>
          Noksha
        </div>
        <div className="pointer-events-auto flex gap-2">
            {step !== AppStep.LANDING && step !== AppStep.HISTORY && (
                 <button 
                    onClick={handleViewHistory}
                    className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-brand-700 shadow-sm border border-gray-100"
                >
                    History
                </button>
            )}
            {step !== AppStep.LANDING && (
                <button 
                    onClick={handleRestart} 
                    className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-brand-700 shadow-sm border border-gray-100"
                >
                    Start Over
                </button>
            )}
        </div>
      </nav>

      <main>
        {step === AppStep.LANDING && <Hero onStart={handleStart} />}
        
        {step === AppStep.GENDER_SELECTION && (
            <div className="animate-fade-in">
                <GenderSelector onSelect={handleGenderSelect} />
            </div>
        )}

        {step === AppStep.STYLE_SELECTION && (
          <div className="animate-fade-in">
            <DesignSelector 
                gender={preferences.gender} 
                onSelect={handleStyleSelect}
                onBack={handleBackToGender}
            />
          </div>
        )}
        
        {step === AppStep.PSYCH_QUIZ && (
          <div className="animate-fade-in">
            <Quiz onComplete={handleQuizComplete} />
          </div>
        )}
        
        {(step === AppStep.GENERATING || step === AppStep.RESULT) && (
          <div className="animate-fade-in">
            <Generator 
                preferences={preferences} 
                onRestart={handleRestart} 
                onSave={handleSaveDesign}
            />
          </div>
        )}

        {step === AppStep.HISTORY && (
            <div className="animate-fade-in">
                <History 
                    designs={savedDesigns} 
                    onBack={() => setStep(AppStep.LANDING)} 
                />
            </div>
        )}
      </main>
    </div>
  );
};

export default App;