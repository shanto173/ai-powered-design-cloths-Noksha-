import React, { useEffect, useState } from 'react';
import { UserPreferences, GeneratedDesign } from '../types';
import { generateFashionDesign } from '../services/geminiService';

interface GeneratorProps {
  preferences: UserPreferences;
  onRestart: () => void;
}

const Generator: React.FC<GeneratorProps> = ({ preferences, onRestart }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<GeneratedDesign | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const generate = async () => {
      try {
        const design = await generateFashionDesign(preferences);
        if (mounted) {
          setResult(design);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError("We encountered a hiccup while stitching your digital design. Please try again.");
          setLoading(false);
        }
      }
    };

    generate();

    return () => { mounted = false; };
  }, [preferences]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-t-4 border-brand-500 border-solid rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-t-4 border-brand-300 border-solid rounded-full animate-spin reverse-spin"></div>
        </div>
        <h2 className="text-2xl font-serif text-gray-900 mb-2">Weaving your imagination...</h2>
        <p className="text-gray-600 max-w-md">
          Analyzing your style choices and personality to create a unique Bangladeshi three-piece design just for you.
        </p>
      </div>
    );
  }

  if (error) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-brand-50 p-4">
         <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
           <div className="text-red-500 text-5xl mb-4">:(</div>
           <p className="text-gray-800 mb-6">{error}</p>
           <button onClick={onRestart} className="bg-brand-500 text-white px-6 py-2 rounded-full hover:bg-brand-600">Try Again</button>
         </div>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-brand-50 py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-stretch">
        
        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-white p-4 rounded-3xl shadow-xl transform transition-all duration-700 ease-out hover:scale-[1.01]">
            <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-100 relative group">
                {result?.imageUrl ? (
                    <img 
                        src={result.imageUrl} 
                        alt="AI Generated Fashion" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Image Unavailable</div>
                )}
                {/* Overlay details */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="font-serif italic text-lg">{preferences.selectedStyle?.category} Collection</p>
                </div>
            </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-lg border border-white">
            <h3 className="text-brand-500 font-bold uppercase tracking-wider text-sm mb-2">Your Personal Noksha</h3>
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight">
              {preferences.selectedStyle?.name} <span className="italic text-brand-400">Reimagined</span>
            </h1>
            
            <div className="mb-8">
               <p className="text-lg text-gray-700 leading-relaxed italic border-l-4 border-brand-300 pl-4">
                 "{result?.sentimentAnalysis}"
               </p>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-bold text-gray-900">Why this fits you:</h4>
              <ul className="space-y-2">
                 {Object.entries(preferences.quizAnswers).map(([key, val], idx) => (
                    <li key={key} className="flex items-center text-gray-600 text-sm">
                        <span className="w-2 h-2 bg-brand-400 rounded-full mr-3"></span>
                        Trait matched: {(val as string).split(',')[0]}
                    </li>
                 ))}
              </ul>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={onRestart}
                className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg"
              >
                Design Another
              </button>
              <button 
                className="flex-1 bg-brand-100 text-brand-900 py-4 rounded-xl font-medium hover:bg-brand-200 transition-colors border border-brand-200"
                onClick={() => alert("Saved to your wishlist! (Feature coming soon)")}
              >
                Save to Wishlist
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Generator;