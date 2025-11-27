import React, { useState } from 'react';
import { AppStep, DesignStyle, UserPreferences } from './types';
import Hero from './components/Hero';
import DesignSelector from './components/DesignSelector';
import Quiz from './components/Quiz';
import Generator from './components/Generator';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [preferences, setPreferences] = useState<UserPreferences>({
    selectedStyle: null,
    quizAnswers: {},
  });

  const handleStart = () => {
    setStep(AppStep.STYLE_SELECTION);
    // Scroll to top
    window.scrollTo(0, 0);
  };

  const handleStyleSelect = (style: DesignStyle) => {
    setPreferences((prev) => ({ ...prev, selectedStyle: style }));
    setStep(AppStep.PSYCH_QUIZ);
    window.scrollTo(0, 0);
  };

  const handleQuizComplete = (answers: Record<number, string>) => {
    setPreferences((prev) => ({ ...prev, quizAnswers: answers }));
    setStep(AppStep.GENERATING);
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    setPreferences({ selectedStyle: null, quizAnswers: {} });
    setStep(AppStep.LANDING);
    window.scrollTo(0, 0);
  };

  return (
    <div className="font-sans antialiased text-gray-900">
      {/* Dynamic Header */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center pointer-events-none">
        <div className={`text-2xl font-serif font-bold transition-opacity duration-300 pointer-events-auto ${step === AppStep.LANDING ? 'opacity-0' : 'opacity-100 text-brand-900'}`}>
          Noksha
        </div>
        {step !== AppStep.LANDING && (
            <button 
                onClick={handleRestart} 
                className="pointer-events-auto bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-brand-700 shadow-sm border border-gray-100"
            >
                Start Over
            </button>
        )}
      </nav>

      <main>
        {step === AppStep.LANDING && <Hero onStart={handleStart} />}
        
        {step === AppStep.STYLE_SELECTION && (
          <div className="animate-fade-in">
            <DesignSelector onSelect={handleStyleSelect} />
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
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;