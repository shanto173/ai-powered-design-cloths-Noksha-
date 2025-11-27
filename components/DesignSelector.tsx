import React from 'react';
import { PRESET_STYLES } from '../constants';
import { DesignStyle, Gender } from '../types';

interface DesignSelectorProps {
  gender: Gender | null;
  onSelect: (style: DesignStyle) => void;
  onBack: () => void;
}

const DesignSelector: React.FC<DesignSelectorProps> = ({ gender, onSelect, onBack }) => {
  const filteredStyles = PRESET_STYLES.filter(s => s.gender === gender);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <button 
                onClick={onBack}
                className="flex items-center text-gray-500 hover:text-brand-700 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Gender Selection
            </button>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-gray-900 mb-4">
             {gender === 'Male' ? "Gentlemen's Edit" : "Ladies' Collection"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a base style. We will customize it based on your personality in the next step.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredStyles.map((style) => (
            <div 
              key={style.id}
              onClick={() => onSelect(style)}
              className="group cursor-pointer flex flex-col h-full bg-brand-50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-brand-100"
            >
              <div className="relative h-96 overflow-hidden">
                <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={style.imageUrl} 
                  alt={style.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-brand-900 text-xs font-bold uppercase tracking-wider rounded-full">
                    {style.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-serif text-gray-900 mb-2 group-hover:text-brand-700 transition-colors">
                  {style.name}
                </h3>
                <p className="text-sm text-gray-600 flex-grow">
                  {style.description}
                </p>
                <div className="mt-4 pt-4 border-t border-brand-200 flex items-center text-brand-700 font-medium text-sm group-hover:translate-x-2 transition-transform">
                  Select Style &rarr;
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignSelector;