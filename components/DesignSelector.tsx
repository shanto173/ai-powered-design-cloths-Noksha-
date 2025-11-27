import React, { useState } from 'react';
import { PRESET_STYLES } from '../constants';
import { DesignStyle, Gender } from '../types';

interface DesignSelectorProps {
  gender: Gender | null;
  onSelect: (style: DesignStyle, uploadedImage: string | null) => void;
  onBack: () => void;
}

const DesignSelector: React.FC<DesignSelectorProps> = ({ gender, onSelect, onBack }) => {
  const filteredStyles = PRESET_STYLES.filter(s => s.gender === gender);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedImage(null);
  };

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
            Select a base style. You can also upload a reference image for specific patterns or textures.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-12 flex justify-center">
            <div className="relative w-full max-w-md">
                <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors ${uploadedImage ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400'}`}>
                    {uploadedImage ? (
                        <div className="relative w-full h-48">
                            <img src={uploadedImage} alt="Inspiration" className="w-full h-full object-contain rounded-lg" />
                            <button 
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <p className="text-center text-brand-700 font-medium mt-2 text-sm">Inspiration Image Added</p>
                        </div>
                    ) : (
                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400 mb-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <span className="text-gray-600 font-medium">Upload Inspiration Image (Optional)</span>
                            <span className="text-gray-400 text-xs mt-1">PNG or JPG</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    )}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredStyles.map((style) => (
            <div 
              key={style.id}
              onClick={() => onSelect(style, uploadedImage)}
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