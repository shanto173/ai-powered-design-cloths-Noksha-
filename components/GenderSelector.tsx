import React from 'react';
import { Gender } from '../types';

interface GenderSelectorProps {
  onSelect: (gender: Gender) => void;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-brand-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-serif text-gray-900 mb-4">Who are we designing for?</h2>
          <p className="text-gray-600">Select a category to explore curated styles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Female Option */}
          <button
            onClick={() => onSelect('Female')}
            className="group relative h-96 rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/10 transition-colors z-10" />
            <img 
              src="https://picsum.photos/id/338/600/800" 
              alt="Women's Fashion" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-gray-900/80 to-transparent text-left">
              <h3 className="text-3xl font-serif text-white mb-2">Women</h3>
              <p className="text-white/90 text-sm font-light">Saree, Salwar Kameez, & Fusion</p>
              <div className="mt-4 flex items-center text-white text-sm font-medium opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                Explore Styles &rarr;
              </div>
            </div>
          </button>

          {/* Male Option */}
          <button
            onClick={() => onSelect('Male')}
            className="group relative h-96 rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/10 transition-colors z-10" />
            <img 
              src="https://picsum.photos/id/837/600/800" 
              alt="Men's Fashion" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-gray-900/80 to-transparent text-left">
              <h3 className="text-3xl font-serif text-white mb-2">Men</h3>
              <p className="text-white/90 text-sm font-light">Panjabi, Kabli, & Waistcoats</p>
              <div className="mt-4 flex items-center text-white text-sm font-medium opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                Explore Styles &rarr;
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenderSelector;