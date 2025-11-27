import { DesignStyle, QuizQuestion } from './types';

export const PRESET_STYLES: DesignStyle[] = [
  // WOMEN'S STYLES
  {
    id: 'jamdani-fusion',
    name: 'Jamdani Fusion',
    description: 'A modern take on the heritage Jamdani weave, perfect for elegant gatherings.',
    category: 'Fusion',
    imageUrl: 'https://picsum.photos/id/106/400/600', 
    gender: 'Female',
  },
  {
    id: 'block-print-casual',
    name: 'Boho Block Print',
    description: 'Comfortable cotton block print, ideal for university or casual Fridays.',
    category: 'Modern',
    imageUrl: 'https://picsum.photos/id/325/400/600',
    gender: 'Female',
  },
  {
    id: 'karchupi-glam',
    name: 'Karchupi Glam',
    description: 'Heavily embroidered Karchupi work for wedding receptions and parties.',
    category: 'Traditional',
    imageUrl: 'https://picsum.photos/id/435/400/600',
    gender: 'Female',
  },
  {
    id: 'silk-sophisticate',
    name: 'Rajshahi Silk',
    description: 'Pure silk elegance with minimal embroidery for the corporate lady.',
    category: 'Traditional',
    imageUrl: 'https://picsum.photos/id/534/400/600',
    gender: 'Female',
  },
  {
    id: 'pastel-floral',
    name: 'Pastel Floral',
    description: 'Soft hues with digital floral prints, airy and romantic.',
    category: 'Modern',
    imageUrl: 'https://picsum.photos/id/360/400/600',
    gender: 'Female',
  },
  {
    id: 'banarasi-royale',
    name: 'Banarasi Royale',
    description: 'Opulent patterns inspired by Banarasi saris adapted into three-piece suits.',
    category: 'Traditional',
    imageUrl: 'https://picsum.photos/id/65/400/600',
    gender: 'Female',
  },

  // MEN'S STYLES
  {
    id: 'classic-panjabi',
    name: 'Classic Panjabi',
    description: 'Timeless cotton or linen Panjabi for comfort and simplicity.',
    category: 'Traditional',
    imageUrl: 'https://picsum.photos/id/804/400/600',
    gender: 'Male',
  },
  {
    id: 'waistcoat-set',
    name: 'Waistcoat Luxe',
    description: 'A structured waistcoat paired with a crisp Panjabi for Eid and weddings.',
    category: 'Fusion',
    imageUrl: 'https://picsum.photos/id/447/400/600',
    gender: 'Male',
  },
  {
    id: 'kabli-bold',
    name: 'Kabli Suit',
    description: 'Pathani style Kabli suit with pockets and collar, rugged yet refined.',
    category: 'Modern',
    imageUrl: 'https://picsum.photos/id/91/400/600',
    gender: 'Male',
  },
  {
    id: 'silk-sherwani-vibe',
    name: 'Silk Sherwani Style',
    description: 'Heavier fabric with embroidery, channeling a regal Sherwani aesthetic.',
    category: 'Traditional',
    imageUrl: 'https://picsum.photos/id/1005/400/600',
    gender: 'Male',
  },
  {
    id: 'minimalist-linen',
    name: 'Minimalist Linen',
    description: 'Clean cuts, solid colors, breathable fabric for the modern man.',
    category: 'Modern',
    imageUrl: 'https://picsum.photos/id/1059/400/600',
    gender: 'Male',
  },
];

export const PSYCH_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "It's a Friday evening in Dhaka. Where do you find yourself?",
    options: [
      { label: "Reading a book at a quiet cafe in Dhanmondi.", sentiment: "introverted, calm, pastel/earthy colors, minimalist" },
      { label: "Hanging out with a big group of friends at a rooftop.", sentiment: "extroverted, vibrant, bold patterns, energetic" },
      { label: "Attending a family dinner or dawats.", sentiment: "traditional, respectful, elegant, intricate details" },
      { label: "Exploring an art gallery or exhibition.", sentiment: "artistic, unique, abstract, contemporary" },
    ],
  },
  {
    id: 2,
    question: "Which color palette speaks to your soul today?",
    options: [
      { label: "Earthy tones (Rust, Olive, Beige, Brown)", sentiment: "natural, organic, warm, rustic" },
      { label: "Jewel tones (Deep Emerald, Royal Blue, Ruby)", sentiment: "luxurious, regal, shiny, deep" },
      { label: "Light & Airy (White, Sky Blue, Mint, Grey)", sentiment: "soft, crisp, breathable, clean" },
      { label: "Monochrome (Black, White, Charcoal)", sentiment: "modern, sharp, structured, bold contrast" },
    ],
  },
  {
    id: 3,
    question: "How do you want to feel in your new outfit?",
    options: [
      { label: "Confident and Commanding", sentiment: "structured cuts, sharp lines, power dressing" },
      { label: "Elegant and Refined", sentiment: "flowing (for women) / fitted (for men), sophisticated, delicate details" },
      { label: "Comfortable and Relaxed", sentiment: "loose fit, cotton, breathable, simple" },
      { label: "The Center of Attention", sentiment: "glitter/sheen, bright, dramatic, statement piece" },
    ],
  },
];