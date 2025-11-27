import React from 'react';
import { PRESET_STYLES } from '../constants';
import { DesignStyle } from '../types';

interface DesignSelectorProps {
  onSelect: (style: DesignStyle) => void;
}

const DesignSelector: React.FC<DesignSelectorProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-gray-900 mb-4">Choose Your Base Aesthetic</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a style that resonates with your wardrobe needs. We will customize it based on your personality in the next step.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRESET_STYLES.map((style) => (
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