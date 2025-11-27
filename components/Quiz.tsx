import React, { useState } from 'react';
import { PSYCH_QUESTIONS } from '../constants';
import { QuizQuestion } from '../types';

interface QuizProps {
  onComplete: (answers: Record<number, string>) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isExiting, setIsExiting] = useState(false);

  const currentQuestion: QuizQuestion = PSYCH_QUESTIONS[currentQIndex];
  const progress = ((currentQIndex) / PSYCH_QUESTIONS.length) * 100;

  const handleOptionClick = (sentiment: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: sentiment };
    setAnswers(newAnswers);

    if (currentQIndex < PSYCH_QUESTIONS.length - 1) {
      setIsExiting(true);
      setTimeout(() => {
        setCurrentQIndex(prev => prev + 1);
        setIsExiting(false);
      }, 300);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="w-full bg-brand-200 h-2 rounded-full mb-8">
          <div 
            className="bg-brand-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className={`transition-all duration-300 transform ${isExiting ? 'opacity-0 -translate-x-10' : 'opacity-100 translate-x-0'}`}>
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-brand-100 relative overflow-hidden">
             {/* Decorative floral watermark */}
            <div className="absolute -top-10 -right-10 text-brand-50 opacity-50">
               <svg width="200" height="200" viewBox="0 0 200 200" fill="currentColor">
                 <path d="M100 0C120 40 160 60 200 60C160 60 140 100 140 140C140 100 100 80 60 80C100 80 120 40 100 0Z" />
               </svg>
            </div>

            <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">
              Question {currentQIndex + 1} of {PSYCH_QUESTIONS.length}
            </h2>
            <h3 className="text-3xl font-serif text-gray-900 mb-8">
              {currentQuestion.question}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option.sentiment)}
                  className="group relative flex items-center p-4 border-2 border-brand-100 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-all duration-200 text-left"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-brand-200 group-hover:border-brand-500 mr-4 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-lg text-gray-700 font-medium group-hover:text-brand-900">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;