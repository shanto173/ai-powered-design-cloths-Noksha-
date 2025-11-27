import React, { useEffect, useState, useRef } from 'react';
import { UserPreferences, GeneratedDesign, SavedDesign } from '../types';
import { generateFashionDesign, editFashionDesign } from '../services/geminiService';

interface GeneratorProps {
  preferences: UserPreferences;
  onRestart: () => void;
  onSave: (design: GeneratedDesign) => void;
}

const COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Royal Blue', value: '#1e40af' },
  { name: 'Emerald', value: '#047857' },
  { name: 'Gold', value: '#eab308' },
  { name: 'Purple', value: '#7e22ce' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Black', value: '#171717' },
  { name: 'White', value: '#ffffff' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Maroon', value: '#831843' },
];

const Generator: React.FC<GeneratorProps> = ({ preferences, onRestart, onSave }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<GeneratedDesign | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessingEdit, setIsProcessingEdit] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // UI State
  const [isSaved, setIsSaved] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Setup Canvas when entering edit mode
  useEffect(() => {
    if (isEditing && canvasRef.current && containerRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const { clientWidth, clientHeight } = containerRef.current;
      
      // Set canvas size to match the displayed image container
      canvas.width = clientWidth;
      canvas.height = clientHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // Visual guide for user
        ctx.lineWidth = 20;
      }
    }
  }, [isEditing]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    // Begin new path so lines don't connect
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleApplyColor = async () => {
    if (!selectedColor || !result || !canvasRef.current) return;

    setIsProcessingEdit(true);

    try {
      // 1. Create a black and white mask from the user's drawing
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = canvasRef.current.width;
      maskCanvas.height = canvasRef.current.height;
      const maskCtx = maskCanvas.getContext('2d');
      
      if (!maskCtx) throw new Error("Could not create mask context");

      // Fill black background
      maskCtx.fillStyle = 'black';
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

      // Draw the user's strokes as solid white
      maskCtx.drawImage(canvasRef.current, 0, 0);
      
      // Post-process to make non-black pixels solid white (thresholding)
      const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
          // If alpha > 0, make it white
          if (data[i + 3] > 0) {
              data[i] = 255;     // R
              data[i + 1] = 255; // G
              data[i + 2] = 255; // B
              data[i + 3] = 255; // A
          }
      }
      maskCtx.putImageData(imageData, 0, 0);
      
      const maskBase64 = maskCanvas.toDataURL('image/png');
      const originalBase64 = result.imageUrl;

      // 2. Call API
      const newImageUrl = await editFashionDesign(originalBase64, maskBase64, selectedColor);

      // 3. Update result
      setResult({
        ...result,
        imageUrl: newImageUrl
      });
      setIsEditing(false); // Exit edit mode
      setSelectedColor(null);
      setIsSaved(false); // Reset saved state since image changed

    } catch (err) {
      console.error(err);
      setError("Failed to apply color changes. Please try again.");
    } finally {
      setIsProcessingEdit(false);
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleSave = () => {
    if (result && !isSaved) {
        onSave(result);
        setIsSaved(true);
    }
  };

  const handleShare = async () => {
    if (!result) return;

    try {
        // Convert base64 to blob for sharing
        const res = await fetch(result.imageUrl);
        const blob = await res.blob();
        const file = new File([blob], "noksha-design.png", { type: "image/png" });

        if (navigator.share) {
            await navigator.share({
                title: 'My Noksha Design',
                text: `Check out my personalized ${preferences.selectedStyle?.name} design generated by Noksha AI!`,
                files: [file]
            });
        } else {
            // Fallback: Copy link or show alert
            alert("Sharing is not supported on this browser/device. You can save the image manually!");
        }
    } catch (error) {
        console.error("Error sharing:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-t-4 border-brand-500 border-solid rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-t-4 border-brand-300 border-solid rounded-full animate-spin reverse-spin"></div>
        </div>
        <h2 className="text-2xl font-serif text-gray-900 mb-2">Weaving your imagination...</h2>
        <p className="text-gray-600 max-w-md">
          Analyzing your style choices {preferences.uploadedImage && "and inspiration image"} to create a unique Bangladeshi three-piece design just for you.
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
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        
        {/* Image / Canvas Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div 
             ref={containerRef}
             className="relative bg-white p-2 rounded-3xl shadow-xl w-full max-w-[500px] aspect-[3/4] overflow-hidden"
          >
              {/* Main Image */}
              {result?.imageUrl ? (
                  <img 
                      ref={imageRef}
                      src={result.imageUrl} 
                      alt="Fashion Design" 
                      className="w-full h-full object-cover rounded-2xl pointer-events-none select-none"
                  />
              ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Image Unavailable</div>
              )}

              {/* Editing Canvas Overlay */}
              {isEditing && (
                  <>
                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full cursor-crosshair touch-none"
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseOut={stopDrawing}
                        onMouseMove={draw}
                        onTouchStart={startDrawing}
                        onTouchEnd={stopDrawing}
                        onTouchMove={draw}
                    />
                    <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
                        Draw to select area
                    </div>
                  </>
              )}
              
              {/* Processing Overlay */}
              {isProcessingEdit && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-2xl">
                      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-brand-900 font-bold">Applying magic...</p>
                  </div>
              )}
          </div>

          {/* Edit Controls (Only visible when editing) */}
          {isEditing && (
             <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg w-full max-w-[500px]">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="text-gray-900 font-bold">Select Color</h3>
                     <button onClick={clearCanvas} className="text-xs text-brand-500 hover:text-brand-700 underline">Clear Selection</button>
                 </div>
                 
                 <div className="flex flex-wrap gap-3 mb-6 justify-center">
                     {COLORS.map((c) => (
                         <button
                             key={c.name}
                             onClick={() => setSelectedColor(c.name)}
                             className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${selectedColor === c.name ? 'border-brand-500 scale-110 shadow-md' : 'border-gray-200'}`}
                             style={{ backgroundColor: c.value }}
                             title={c.name}
                         />
                     ))}
                 </div>

                 <div className="flex gap-4">
                     <button 
                        onClick={() => { setIsEditing(false); clearCanvas(); }}
                        className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={handleApplyColor}
                        disabled={!selectedColor}
                        className={`flex-1 py-3 rounded-xl text-white font-medium shadow-md transition-all ${!selectedColor ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'}`}
                     >
                        Apply Color
                     </button>
                 </div>
             </div>
          )}
        </div>

        {/* Details Section (Hidden when editing on mobile to save space, visible otherwise) */}
        {!isEditing && (
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
                    {preferences.uploadedImage && (
                        <li className="flex items-center text-gray-600 text-sm">
                            <span className="w-2 h-2 bg-brand-400 rounded-full mr-3"></span>
                            Inspiration: User provided image
                        </li>
                    )}
                </ul>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-brand-600 text-white py-4 rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg flex justify-center items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.388-1.62a6.726 6.726 0 015.042-3.388m0 0a3 3 0 015.78 1.128 2.25 2.25 0 002.4 2.245 4.5 4.5 0 01-8.4 2.245c0 .399.078.78.22 1.128zm0 0a15.999 15.999 0 01-3.388 1.62m-5.043.025a15.994 15.994 0 00-1.622 3.395" />
                    </svg>
                    Customize Colors (Draw & Change)
                  </button>

                  <div className="flex gap-4">
                    <button 
                        onClick={onRestart}
                        className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg"
                    >
                        New
                    </button>
                    <button 
                        className={`flex-1 py-4 rounded-xl font-medium transition-colors border ${isSaved ? 'bg-green-100 text-green-700 border-green-200' : 'bg-brand-100 text-brand-900 hover:bg-brand-200 border-brand-200'}`}
                        onClick={handleSave}
                        disabled={isSaved}
                    >
                        {isSaved ? 'Saved' : 'Save'}
                    </button>
                    <button 
                        className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-medium hover:bg-gray-200 transition-colors border border-gray-200 flex justify-center items-center gap-1"
                        onClick={handleShare}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.287.696.287 1.093 0 .397-.107.769-.287 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                        Share
                    </button>
                  </div>
                </div>
            </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Generator;