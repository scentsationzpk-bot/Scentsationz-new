import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import * as dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  {
    id: 'starborn',
    name: 'STARBORN',
    price: 2250,
    stock: 50,
    description: 'A celestial blend of rich amber and dark oud, radiating an aura of absolute power and mystery.',
    category: 'Bold',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    luxuryStory: 'Starborn is the scent of destiny. Crafted for those who leave an indelible mark on the world, it weaves the ancient depth of oud with the warm, glowing embrace of amber. A fragrance that doesn\'t just linger—it commands.',
    packagingDetails: ['Weighted Obsidian Glass', 'Gold-Embossed Monogram', 'Magnetic Precision Cap'],
    badge: 'Signature',
    specifications: {
      topNotes: ['Saffron', 'Bergamot', 'Spiced Cardamom'],
      middleNotes: ['Black Rose', 'Aged Oud', 'Leather'],
      baseNotes: ['Amber', 'Vanilla', 'Smoked Patchouli'],
      longevity: 98,
      sillage: 'Strong',
      occasions: ['Gala Evenings', 'Power Meetings', 'Night Out']
    }
  },
  {
    id: 'cool-current',
    name: 'COOL CURRENT',
    price: 2250,
    stock: 50,
    description: 'An invigorating rush of glacial waters and crisp citrus, capturing the essence of pure, unbridled energy.',
    category: 'Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?auto=format&fit=crop&q=80&w=800',
    luxuryStory: 'Cool Current is a breath of absolute clarity. Like a sudden plunge into arctic waters, it awakens the senses with sharp citrus and marine notes, settling into a clean, sophisticated musk. The ultimate companion for the modern visionary.',
    packagingDetails: ['Matte Teal Finish', 'Silver Engraving', 'Soft-Touch Presentation Box'],
    specifications: {
      topNotes: ['Sea Salt', 'Iced Lemon', 'Grapefruit'],
      middleNotes: ['Mint', 'Neroli', 'Lavender'],
      baseNotes: ['Amberwood', 'White Musk', 'Cedar'],
      longevity: 85,
      sillage: 'Moderate',
      occasions: ['Daily Wear', 'Summer Days', 'Office']
    }
  },
  {
    id: 'forever-dawn',
    name: 'FOREVER DAWN',
    price: 2250,
    stock: 50,
    description: 'A luminous bouquet of white florals and soft woods, evoking the quiet beauty of a new beginning.',
    category: 'Floral',
    imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800',
    luxuryStory: 'Forever Dawn captures the fleeting magic of morning light. Delicate jasmine and tuberose dance over a base of creamy sandalwood, creating a scent that is both intimately soft and enduringly beautiful. A promise of endless possibilities.',
    packagingDetails: ['Frosted Glass', 'Rose Gold Accents', 'Velvet Interior'],
    specifications: {
      topNotes: ['Pear', 'Mandarin', 'Pink Pepper'],
      middleNotes: ['Jasmine', 'Tuberose', 'Orange Blossom'],
      baseNotes: ['Sandalwood', 'Vanilla', 'White Musk'],
      longevity: 90,
      sillage: 'Moderate',
      occasions: ['Weddings', 'Spring Afternoons', 'Romantic Dinners']
    }
  },
  {
    id: 'golden-pulse',
    name: 'GOLDEN PULSE',
    price: 2250,
    stock: 50,
    description: 'A vibrant, intoxicating fusion of warm spices and sweet nectar, pulsating with irresistible charm.',
    category: 'Warm',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    luxuryStory: 'Golden Pulse is the rhythm of a night that never ends. It opens with a burst of sweet, spicy energy before melting into a luxurious, honeyed warmth. It is a fragrance for the bold, the charismatic, and the unforgettable.',
    packagingDetails: ['Amber Tinted Glass', 'Gold Leaf Detailing', 'Premium Box'],
    specifications: {
      topNotes: ['Cinnamon', 'Honey', 'Blood Orange'],
      middleNotes: ['Nutmeg', 'Orchid', 'Clove'],
      baseNotes: ['Tonka Bean', 'Amber', 'Mahogany'],
      longevity: 95,
      sillage: 'Strong',
      occasions: ['Parties', 'Winter Nights', 'Celebrations']
    }
  },
  {
    id: 'tobacco-trail',
    name: 'TOBACCO TRAIL',
    price: 2250,
    stock: 50,
    description: 'A deeply sophisticated blend of rich tobacco leaf, sweet vanilla, and aged woods.',
    category: 'Woody',
    imageUrl: 'https://images.unsplash.com/photo-1615397323758-0e1069c9b451?auto=format&fit=crop&q=80&w=800',
    luxuryStory: 'Tobacco Trail is an homage to classic masculinity and refined taste. The raw, earthy richness of tobacco is perfectly balanced by the smooth sweetness of vanilla and tonka bean. A scent that speaks of old libraries, leather armchairs, and quiet confidence.',
    packagingDetails: ['Smoked Glass', 'Copper Engraving', 'Leather-Bound Box'],
    specifications: {
      topNotes: ['Tobacco Leaf', 'Spicy Notes', 'Bergamot'],
      middleNotes: ['Vanilla', 'Cacao', 'Tonka Bean'],
      baseNotes: ['Dried Fruits', 'Woody Notes', 'Sweet Sap'],
      longevity: 92,
      sillage: 'Strong',
      occasions: ['Evening Events', 'Autumn Days', 'Formal Gatherings']
    }
  }
];

async function seed() {
  for (const p of products) {
    await setDoc(doc(db, 'products', p.id), p);
    console.log(`Seeded ${p.name}`);
  }
  console.log('Done');
}

seed().catch(console.error);
