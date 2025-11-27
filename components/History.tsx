import React from 'react';
import { SavedDesign } from '../types';

interface HistoryProps {
  designs: SavedDesign[];
  onBack: () => void;
}

const History: React.FC<HistoryProps> = ({ designs, onBack }) => {
  return (
    <div className="min-h-screen bg-brand-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
            <button 
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-brand-700 transition-colors mr-4 bg-white p-2 rounded-full shadow-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
            </button>
            <h2 className="text-3xl font-serif text-gray-900">Your Design History</h2>
        </div>

        {designs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-brand-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-gray-300 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 text-lg">No designs saved yet.</p>
                <p className="text-gray-400 text-sm">Start creating to build your collection!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {designs.slice().reverse().map((design) => (
                    <div key={design.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="h-96 overflow-hidden bg-gray-100">
                            <img src={design.imageUrl} alt={design.styleName} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-serif text-xl text-gray-900">{design.styleName}</h3>
                                <span className="text-xs font-bold uppercase tracking-wider text-brand-500 bg-brand-50 px-2 py-1 rounded-md">
                                    {new Date(design.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">{design.sentimentAnalysis}</p>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span className="text-xs text-gray-400">{design.gender} Collection</span>
                                <a 
                                    href={design.imageUrl} 
                                    download={`noksha-design-${design.id}.png`}
                                    className="text-brand-600 hover:text-brand-800 text-sm font-medium"
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default History;