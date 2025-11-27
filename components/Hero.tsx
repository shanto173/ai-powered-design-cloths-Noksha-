import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-brand-50 flex flex-col items-center justify-center text-center px-4">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-brand-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-2xl">
        <h2 className="text-brand-700 tracking-widest text-sm font-bold uppercase mb-4">
          For the Modern Bengali Spirit
        </h2>
        <h1 className="font-serif text-5xl md:text-7xl text-gray-900 mb-6 leading-tight">
          Noksha <span className="text-brand-500 italic">AI</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-8 font-light">
          Where tradition meets your inner self. Discover personalized ethnic wear tailored not just to your body, but to your personality.
        </p>
        <button
          onClick={onStart}
          className="group relative inline-flex items-center justify-start overflow-hidden rounded-full bg-brand-900 px-8 py-4 font-medium transition-all hover:bg-white"
        >
          <span className="absolute inset-0 rounded-full border-0 border-white transition-all duration-100 ease-linear group-hover:border-[25px]"></span>
          <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-brand-900 flex items-center gap-2">
            Start Your Design Journey
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </span>
        </button>
      </div>

      <div className="absolute bottom-8 text-gray-400 text-sm">
        Powered by Google Gemini
      </div>
    </div>
  );
};

export default Hero;