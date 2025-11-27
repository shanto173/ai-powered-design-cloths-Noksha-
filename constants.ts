import { DesignStyle, QuizQuestion } from './types';

// Using placeholder images that evoke fabric/texture since we can't host real fashion assets here
export const PRESET_STYLES: DesignStyle[] = [
  {
    id: 'jamdani-fusion',
    name: 'Jamdani Fusion',
    description: 'A modern take on the heritage Jamdani weave, perfect for elegant gatherings.',
    category: 'Fusion',
    imageUrl: 'https://picsum.photos/id/106/400/600', 
  },
  {
    id: 'block-print-casual',
    name: 'Boho Block Print',
    description: 'Comfortable cotton block print, ideal for university or casual Fridays.',
    category: 'Modern',
    imageUrl: 'https://picsum.photos/id/325/400/600',
  },
  {
    id: 'karchupi-glam',
    name: 'Karchupi Glam',
    description: 'Heavily embroidered Karchupi work for wedding receptions and parties.',
    category: 'Traditional',
    imageUrl: 'https://picsum.photos/id/435/400/600',
  },
  {
    id: 'silk-sophisticate',
    name: 'Rajshahi Silk',
    description: 'Pure silk elegance with minimal embroidery for the corporate lady.',
    category: 'Traditional',
    imageUrl: 'https://picsum.photos/id/534/400/600',
  },
];

export const PSYCH_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "It's a Friday evening in Dhaka. Where do you find yourself?",
    options: [
      { label: "Reading a book at a quiet cafe in Dhanmondi.", sentiment: "introverted, calm, pastel colors, minimalist" },
      { label: "Hanging out with a big group of friends at a rooftop.", sentiment: "extroverted, vibrant, bold patterns, energetic" },
      { label: "Attending a family dinner or dawats.", sentiment: "traditional, respectful, elegant, intricate" },
      { label: "Exploring an art gallery or exhibition.", sentiment: "artistic, unique, abstract, contemporary" },
    ],
  },
  {
    id: 2,
    question: "Which color palette speaks to your soul today?",
    options: [
      { label: "Earthy tones (Rust, Olive, Beige)", sentiment: "natural, organic, warm, rustic" },
      { label: "Jewel tones (Deep Emerald, Royal Blue, Ruby)", sentiment: "luxurious, regal, shiny, deep" },
      { label: "Pastel dream (Baby Pink, Sky Blue, Mint)", sentiment: "soft, dreamy, airy, chiffon" },
      { label: "Monochrome (Black, White, Grey)", sentiment: "modern, sharp, structured, bold contrast" },
    ],
  },
  {
    id: 3,
    question: "How do you want to feel in your new outfit?",
    options: [
      { label: "Confident and Bossy", sentiment: "structured cuts, sharp lines, power dressing" },
      { label: "Graceful and Feminine", sentiment: "flowing fabrics, lace, floral, delicate" },
      { label: "Comfortable and Free", sentiment: "loose fit, cotton, breathable, simple" },
      { label: "The Center of Attention", sentiment: "glitter, sequin, bright, dramatic" },
    ],
  },
];