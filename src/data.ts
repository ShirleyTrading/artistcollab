// ─── Artist Collab — Seed / Demo Data ────────────────────────────────────────

export interface User {
  id: string;
  accountType: 'artist' | 'producer';
  artistName: string;
  username: string;
  email: string;
  genre: string[];
  location: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  socialLinks: { platform: string; url: string }[];
  monthlyListeners: number;
  verified: boolean;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  liveSession: boolean;
  availability: 'available' | 'busy' | 'unavailable';
  responseTime: string;
  tags: string[];
  joinedAt: string;
  completedProjects: number;
  featuredSongs: { title: string; url: string }[];
}

export interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  packages: {
    name: string;
    price: number;
    deliveryDays: number;
    revisions: number;
    features: string[];
  }[];
  fileFormats: string[];
  addOns: { title: string; price: number }[];
  active: boolean;
  createdAt: string;
  orders: number;
  rating: number;
}

export interface Project {
  id: string;
  title: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  status: 'pending' | 'in_progress' | 'awaiting_delivery' | 'delivered' | 'revision_requested' | 'completed' | 'cancelled';
  paymentStatus: 'held' | 'released' | 'refunded';
  dueDate: string;
  orderTotal: number;
  platformFee: number;
  payoutAmount: number;
  notes: string;
  createdAt: string;
  package: string;
  files: ProjectFile[];
  messages: Message[];
  activity: ActivityItem[];
}

export interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
  url: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  attachment?: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface Review {
  id: string;
  orderId: string;
  reviewerId: string;
  revieweeId: string;
  professionalism: number;
  deliveryTime: number;
  quality: number;
  communication: number;
  text: string;
  createdAt: string;
}

// ─── Users ──────────────────────────────────────────────────────────────────

export const users: User[] = [
  {
    id: 'u1',
    accountType: 'artist',
    artistName: 'XAVI',
    username: 'xavi_official',
    email: 'xavi@demo.com',
    genre: ['Hip-Hop', 'Trap', 'R&B'],
    location: 'Atlanta, GA',
    bio: 'Multi-platinum songwriter and recording artist with features on 40+ projects. Known for melodic hooks and aggressive rap flows. I bring heat every session.',
    profileImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200&h=400&fit=crop',
    socialLinks: [
      { platform: 'instagram', url: '#' },
      { platform: 'spotify', url: '#' },
      { platform: 'soundcloud', url: '#' },
    ],
    monthlyListeners: 284000,
    verified: true,
    rating: 4.9,
    reviewCount: 147,
    startingPrice: 350,
    liveSession: true,
    availability: 'available',
    responseTime: '< 2 hours',
    tags: ['Hip-Hop', 'Trap', 'Melody', 'Hook Specialist'],
    joinedAt: '2023-06-15',
    completedProjects: 203,
    featuredSongs: [
      { title: 'On Top (feat. Various)', url: '#' },
      { title: 'Midnight Moves', url: '#' },
    ],
  },
  {
    id: 'u2',
    accountType: 'artist',
    artistName: 'NOVA LEE',
    username: 'novalee',
    email: 'nova@demo.com',
    genre: ['R&B', 'Soul', 'Pop'],
    location: 'Los Angeles, CA',
    bio: 'R&B vocalist and songwriter. I specialize in smooth, emotional hooks that make songs unforgettable. Writing credits on Spotify editorial playlists.',
    profileImage: 'https://images.unsplash.com/photo-1516981442399-a91139e20ff8?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=400&fit=crop',
    socialLinks: [
      { platform: 'instagram', url: '#' },
      { platform: 'apple_music', url: '#' },
    ],
    monthlyListeners: 512000,
    verified: true,
    rating: 5.0,
    reviewCount: 89,
    startingPrice: 500,
    liveSession: true,
    availability: 'available',
    responseTime: '< 4 hours',
    tags: ['R&B', 'Soul', 'Pop', 'Vocalist', 'Songwriter'],
    joinedAt: '2023-04-20',
    completedProjects: 116,
    featuredSongs: [
      { title: 'Golden Hour', url: '#' },
      { title: 'Say It Right', url: '#' },
    ],
  },
  {
    id: 'u3',
    accountType: 'producer',
    artistName: 'BEATSMITH',
    username: 'beatsmith_prod',
    email: 'beats@demo.com',
    genre: ['Trap', 'Hip-Hop', 'Drill'],
    location: 'New York, NY',
    bio: 'NYC-based producer with placements on major label projects. I create cinematic trap, aggressive drill, and experimental hip-hop. Every beat is custom crafted.',
    profileImage: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1519683109079-d5f539e1542f?w=1200&h=400&fit=crop',
    socialLinks: [
      { platform: 'instagram', url: '#' },
      { platform: 'youtube', url: '#' },
      { platform: 'soundcloud', url: '#' },
    ],
    monthlyListeners: 98000,
    verified: true,
    rating: 4.8,
    reviewCount: 234,
    startingPrice: 200,
    liveSession: false,
    availability: 'busy',
    responseTime: '< 6 hours',
    tags: ['Trap', 'Drill', 'Hip-Hop', 'Custom Beats', 'Mixing'],
    joinedAt: '2023-02-10',
    completedProjects: 341,
    featuredSongs: [
      { title: 'Pressure (Prod. Beatsmith)', url: '#' },
      { title: 'Ice Cold Instrumental', url: '#' },
    ],
  },
  {
    id: 'u4',
    accountType: 'artist',
    artistName: 'KALI ROSE',
    username: 'kalirose',
    email: 'kali@demo.com',
    genre: ['Afrobeats', 'Pop', 'R&B'],
    location: 'London, UK',
    bio: 'Afrofusion artist blending West African sounds with modern R&B and pop. My voice adds an authentic international flavor to any record.',
    profileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop',
    socialLinks: [
      { platform: 'instagram', url: '#' },
      { platform: 'spotify', url: '#' },
    ],
    monthlyListeners: 1200000,
    verified: true,
    rating: 4.7,
    reviewCount: 52,
    startingPrice: 750,
    liveSession: true,
    availability: 'available',
    responseTime: '< 12 hours',
    tags: ['Afrobeats', 'Pop', 'R&B', 'International'],
    joinedAt: '2023-09-01',
    completedProjects: 67,
    featuredSongs: [
      { title: 'Lagos Nights', url: '#' },
      { title: 'Vibration', url: '#' },
    ],
  },
  {
    id: 'u5',
    accountType: 'artist',
    artistName: 'CIPHER 7',
    username: 'cipher7',
    email: 'cipher@demo.com',
    genre: ['Hip-Hop', 'Conscious', 'Boom Bap'],
    location: 'Chicago, IL',
    bio: 'Lyricist and storyteller. If you need bars with substance, I deliver every time. No filler, just craft. 10+ years in the game.',
    profileImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=400&fit=crop',
    socialLinks: [
      { platform: 'instagram', url: '#' },
      { platform: 'soundcloud', url: '#' },
    ],
    monthlyListeners: 67000,
    verified: false,
    rating: 4.6,
    reviewCount: 38,
    startingPrice: 150,
    liveSession: false,
    availability: 'available',
    responseTime: '< 24 hours',
    tags: ['Hip-Hop', 'Conscious', 'Boom Bap', 'Lyricist'],
    joinedAt: '2024-01-05',
    completedProjects: 44,
    featuredSongs: [
      { title: 'Real Talk', url: '#' },
      { title: 'Built Different', url: '#' },
    ],
  },
  {
    id: 'u6',
    accountType: 'artist',
    artistName: 'MELODICA',
    username: 'melodica_sg',
    email: 'melodica@demo.com',
    genre: ['Pop', 'Indie Pop', 'Alt R&B'],
    location: 'Nashville, TN',
    bio: 'Songwriter and vocalist with a unique blend of indie pop and R&B. I write toplines that actually mean something. Sync placements in TV and film.',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200&h=400&fit=crop',
    socialLinks: [
      { platform: 'instagram', url: '#' },
      { platform: 'spotify', url: '#' },
      { platform: 'tiktok', url: '#' },
    ],
    monthlyListeners: 340000,
    verified: true,
    rating: 4.9,
    reviewCount: 71,
    startingPrice: 400,
    liveSession: true,
    availability: 'available',
    responseTime: '< 3 hours',
    tags: ['Pop', 'Indie', 'Songwriter', 'Vocalist', 'Topline'],
    joinedAt: '2023-07-22',
    completedProjects: 98,
    featuredSongs: [
      { title: 'Chasing Light', url: '#' },
      { title: 'Paper Walls', url: '#' },
    ],
  },
  {
    id: 'u7',
    accountType: 'producer',
    artistName: 'SOULWAV',
    username: 'soulwav',
    email: 'soulwav@demo.com',
    genre: ['R&B', 'Soul', 'Neo-Soul'],
    location: 'Detroit, MI',
    bio: 'Neo-soul and R&B producer crafting warm, vintage-inspired soundscapes. Known for lush chords, live instrumentation, and immaculate mixes.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1519683109079-d5f539e1542f?w=1200&h=400&fit=crop',
    socialLinks: [
      { platform: 'instagram', url: '#' },
      { platform: 'soundcloud', url: '#' },
    ],
    monthlyListeners: 145000,
    verified: true,
    rating: 4.8,
    reviewCount: 92,
    startingPrice: 300,
    liveSession: true,
    availability: 'available',
    responseTime: '< 8 hours',
    tags: ['R&B', 'Soul', 'Neo-Soul', 'Live Instruments', 'Mixing'],
    joinedAt: '2023-05-14',
    completedProjects: 129,
    featuredSongs: [
      { title: 'Warm Season (Instrumental)', url: '#' },
      { title: 'Still Waters', url: '#' },
    ],
  },
  {
    id: 'u8',
    accountType: 'artist',
    artistName: 'DRIP KAYO',
    username: 'dripkayo',
    email: 'kayo@demo.com',
    genre: ['Drill', 'Trap', 'Hip-Hop'],
    location: 'Houston, TX',
    bio: 'Drill artist with street anthems and authentic energy. Consistent delivery, hard bars, and serious work ethic. Let\'s get to business.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200&h=400&fit=crop',
    socialLinks: [
      { platform: 'instagram', url: '#' },
      { platform: 'soundcloud', url: '#' },
    ],
    monthlyListeners: 89000,
    verified: false,
    rating: 4.5,
    reviewCount: 29,
    startingPrice: 200,
    liveSession: false,
    availability: 'available',
    responseTime: '< 12 hours',
    tags: ['Drill', 'Trap', 'Hip-Hop'],
    joinedAt: '2024-02-18',
    completedProjects: 31,
    featuredSongs: [
      { title: 'Slide Out', url: '#' },
      { title: 'No Cap Zone', url: '#' },
    ],
  },
];

// ─── Listings ────────────────────────────────────────────────────────────────

export const listings: Listing[] = [
  {
    id: 'l1',
    userId: 'u1',
    title: '16-Bar Trap Feature',
    description: 'I will deliver a hard-hitting 16-bar trap verse for your record. My delivery is aggressive, melodic, or lyrical — whatever fits your vision. I record in a professional studio and deliver broadcast-ready audio.',
    category: 'Feature Verse',
    packages: [
      {
        name: 'Basic',
        price: 350,
        deliveryDays: 5,
        revisions: 1,
        features: ['16 bars', 'Mixed vocal', 'WAV delivery', '1 revision'],
      },
      {
        name: 'Standard',
        price: 600,
        deliveryDays: 3,
        revisions: 2,
        features: ['16 bars + adlibs', 'Mixed & mastered', 'WAV + stems', '2 revisions', 'Priority delivery'],
      },
      {
        name: 'Premium',
        price: 1200,
        deliveryDays: 2,
        revisions: 3,
        features: ['Full verse + hook', 'Studio session included', 'All stems', 'Unlimited revisions', 'Promo post included', 'Sync-ready master'],
      },
    ],
    fileFormats: ['WAV', 'MP3', 'STEMS'],
    addOns: [
      { title: 'Promo Instagram post', price: 150 },
      { title: 'Live session recording', price: 300 },
    ],
    active: true,
    createdAt: '2023-08-10',
    orders: 203,
    rating: 4.9,
  },
  {
    id: 'l2',
    userId: 'u2',
    title: 'R&B Hook / Chorus Feature',
    description: 'I\'ll write and record a full chorus for your R&B, pop, or trap record. Smooth, emotional, and melodically unforgettable. Multiple vocal layers included.',
    category: 'Hook / Chorus',
    packages: [
      {
        name: 'Basic',
        price: 500,
        deliveryDays: 4,
        revisions: 1,
        features: ['Full chorus', 'Background harmonies', 'Mixed vocal', 'WAV'],
      },
      {
        name: 'Standard',
        price: 900,
        deliveryDays: 2,
        revisions: 2,
        features: ['Chorus + pre-chorus', 'Full harmonies', 'Mixed & mastered', 'Vocal stems', '2 revisions'],
      },
      {
        name: 'Premium',
        price: 1800,
        deliveryDays: 1,
        revisions: 999,
        features: ['Full song topline', 'All vocal stems', 'Unlimited revisions', 'Writing credit', 'Promo post'],
      },
    ],
    fileFormats: ['WAV', 'STEMS', 'MP3'],
    addOns: [
      { title: 'Second hook variation', price: 250 },
      { title: 'Bridge section', price: 350 },
    ],
    active: true,
    createdAt: '2023-06-01',
    orders: 116,
    rating: 5.0,
  },
  {
    id: 'l3',
    userId: 'u3',
    title: 'Custom Trap / Drill Beat',
    description: 'Full custom beat built to your vision. Trap, drill, or hybrid — I\'ll craft something unique for your project. Includes full mixing and stems.',
    category: 'Custom Beat',
    packages: [
      {
        name: 'Basic',
        price: 200,
        deliveryDays: 7,
        revisions: 1,
        features: ['Custom beat', 'MP3 + WAV', '1 revision'],
      },
      {
        name: 'Standard',
        price: 350,
        deliveryDays: 4,
        revisions: 2,
        features: ['Custom beat', 'Full stems', 'Mixed', '2 revisions'],
      },
      {
        name: 'Premium',
        price: 700,
        deliveryDays: 3,
        revisions: 999,
        features: ['Custom beat', 'Full stems', 'Mixed & mastered', 'Unlimited revisions', 'Exclusive rights'],
      },
    ],
    fileFormats: ['WAV', 'MP3', 'STEMS', 'ZIP'],
    addOns: [
      { title: 'Additional mix revision', price: 75 },
      { title: 'Full master', price: 100 },
    ],
    active: true,
    createdAt: '2023-04-15',
    orders: 341,
    rating: 4.8,
  },
  {
    id: 'l4',
    userId: 'u4',
    title: 'Afrobeats / Pop Feature',
    description: 'International Afrofusion feature. I bring a unique blend of Lagos and London energy to your records. Perfect for crossover records targeting global audiences.',
    category: 'Feature Verse',
    packages: [
      {
        name: 'Standard',
        price: 750,
        deliveryDays: 5,
        revisions: 2,
        features: ['Full verse or hook', 'Harmonies', 'Mixed vocal', 'WAV stems'],
      },
      {
        name: 'Premium',
        price: 1500,
        deliveryDays: 3,
        revisions: 3,
        features: ['Full feature', 'Live recording session', 'Full stems', 'Promo post'],
      },
    ],
    fileFormats: ['WAV', 'MP3', 'STEMS'],
    addOns: [
      { title: 'Full song co-write', price: 500 },
    ],
    active: true,
    createdAt: '2023-10-05',
    orders: 67,
    rating: 4.7,
  },
  {
    id: 'l5',
    userId: 'u6',
    title: 'Pop / Indie Hook + Topline Writing',
    description: 'I write and record full toplines for pop, indie pop, and alt-R&B records. My hooks are playlist-ready and emotionally resonant. Ideal for producers looking to add a songwriter.',
    category: 'Songwriter / Topline',
    packages: [
      {
        name: 'Basic',
        price: 400,
        deliveryDays: 5,
        revisions: 2,
        features: ['Chorus topline', 'Demo vocal', 'Lyrics included'],
      },
      {
        name: 'Standard',
        price: 750,
        deliveryDays: 3,
        revisions: 3,
        features: ['Full song topline', 'Professional vocal recording', 'Lyrics + melody', 'WAV stems'],
      },
      {
        name: 'Premium',
        price: 1400,
        deliveryDays: 2,
        revisions: 999,
        features: ['Full song topline', 'Session recording', 'Writing credit', 'Pitch-ready master', 'Promo clip'],
      },
    ],
    fileFormats: ['WAV', 'MP3', 'PDF (lyrics)', 'STEMS'],
    addOns: [
      { title: 'Second verse', price: 200 },
      { title: 'TikTok promo clip', price: 150 },
    ],
    active: true,
    createdAt: '2023-09-12',
    orders: 98,
    rating: 4.9,
  },
];

// ─── Projects ────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: 'p1',
    title: 'XAVI × Cipher7 — Verse Feature',
    buyerId: 'u5',
    sellerId: 'u1',
    listingId: 'l1',
    status: 'in_progress',
    paymentStatus: 'held',
    dueDate: '2026-03-18',
    orderTotal: 600,
    platformFee: 60,
    payoutAmount: 540,
    notes: 'Looking for an aggressive 16 bar verse for my boom bap record. Reference track attached. Need adlibs and hard delivery.',
    createdAt: '2026-03-10',
    package: 'Standard',
    files: [
      {
        id: 'f1',
        name: 'reference_track.mp3',
        type: 'MP3',
        size: '4.2 MB',
        uploadedBy: 'u5',
        uploadedAt: '2026-03-10',
        version: 1,
        url: '#',
      },
    ],
    messages: [
      {
        id: 'm1',
        senderId: 'u5',
        content: 'Hey XAVI — reference track is uploaded. Looking for something with your "Midnight Moves" energy but more aggressive. Let me know if you have questions.',
        timestamp: '2026-03-10T14:30:00',
      },
      {
        id: 'm2',
        senderId: 'u1',
        content: 'Got it. I checked the ref — I\'m gonna make something heat. Expect the first take in 2 days.',
        timestamp: '2026-03-10T15:45:00',
      },
      {
        id: 'm3',
        senderId: 'u5',
        content: 'Perfect. No rush, just make it a vibe.',
        timestamp: '2026-03-10T16:00:00',
      },
    ],
    activity: [
      { id: 'a1', type: 'order_created', description: 'Order placed and payment held', timestamp: '2026-03-10T14:00:00' },
      { id: 'a2', type: 'file_uploaded', description: 'Buyer uploaded reference_track.mp3', timestamp: '2026-03-10T14:30:00' },
      { id: 'a3', type: 'status_change', description: 'Project status changed to In Progress', timestamp: '2026-03-10T15:45:00' },
    ],
  },
  {
    id: 'p2',
    title: 'Nova Lee Hook — "Golden Summer"',
    buyerId: 'u8',
    sellerId: 'u2',
    listingId: 'l2',
    status: 'delivered',
    paymentStatus: 'held',
    dueDate: '2026-03-15',
    orderTotal: 900,
    platformFee: 90,
    payoutAmount: 810,
    notes: 'Need an R&B hook for a summer trap record. Chord progression is in the stems. Key of C minor.',
    createdAt: '2026-03-07',
    package: 'Standard',
    files: [
      {
        id: 'f2',
        name: 'golden_summer_instrumental.wav',
        type: 'WAV',
        size: '18.4 MB',
        uploadedBy: 'u8',
        uploadedAt: '2026-03-07',
        version: 1,
        url: '#',
      },
      {
        id: 'f3',
        name: 'nova_lee_hook_v1.wav',
        type: 'WAV',
        size: '8.1 MB',
        uploadedBy: 'u2',
        uploadedAt: '2026-03-12',
        version: 1,
        url: '#',
      },
      {
        id: 'f4',
        name: 'nova_lee_hook_stems.zip',
        type: 'ZIP',
        size: '34.2 MB',
        uploadedBy: 'u2',
        uploadedAt: '2026-03-12',
        version: 1,
        url: '#',
      },
    ],
    messages: [
      {
        id: 'm4',
        senderId: 'u8',
        content: 'Sent the instrumental. Summer vibe, C minor. Need something soulful.',
        timestamp: '2026-03-07T10:00:00',
      },
      {
        id: 'm5',
        senderId: 'u2',
        content: 'I love the instrumental! I have a perfect melody for this. Give me a couple days.',
        timestamp: '2026-03-07T11:30:00',
      },
      {
        id: 'm6',
        senderId: 'u2',
        content: 'Delivery is up! Check the stems and let me know if you need any tweaks on the harmonies.',
        timestamp: '2026-03-12T09:00:00',
      },
    ],
    activity: [
      { id: 'a4', type: 'order_created', description: 'Order placed', timestamp: '2026-03-07T09:00:00' },
      { id: 'a5', type: 'file_uploaded', description: 'Buyer uploaded instrumental stems', timestamp: '2026-03-07T10:00:00' },
      { id: 'a6', type: 'status_change', description: 'Status changed to In Progress', timestamp: '2026-03-07T11:30:00' },
      { id: 'a7', type: 'file_uploaded', description: 'Seller delivered: hook WAV + stems', timestamp: '2026-03-12T09:00:00' },
      { id: 'a8', type: 'status_change', description: 'Status changed to Delivered', timestamp: '2026-03-12T09:00:00' },
    ],
  },
  {
    id: 'p3',
    title: 'Custom Drill Beat — "Ice Season"',
    buyerId: 'u8',
    sellerId: 'u3',
    listingId: 'l3',
    status: 'completed',
    paymentStatus: 'released',
    dueDate: '2026-02-28',
    orderTotal: 350,
    platformFee: 35,
    payoutAmount: 315,
    notes: 'Need a cold NY drill beat with sliding 808s. Reference: Pop Smoke — Dior energy.',
    createdAt: '2026-02-20',
    package: 'Standard',
    files: [
      {
        id: 'f5',
        name: 'ice_season_beat.wav',
        type: 'WAV',
        size: '12.3 MB',
        uploadedBy: 'u3',
        uploadedAt: '2026-02-25',
        version: 1,
        url: '#',
      },
    ],
    messages: [
      {
        id: 'm7',
        senderId: 'u8',
        content: 'Pop Smoke / Dior energy. Cold sliding 808s. You already know what it is.',
        timestamp: '2026-02-20T12:00:00',
      },
      {
        id: 'm8',
        senderId: 'u3',
        content: 'On it. Check back in 5 days.',
        timestamp: '2026-02-20T13:00:00',
      },
      {
        id: 'm9',
        senderId: 'u3',
        content: 'Beat is done. That 808 slide is cold. Let me know what you think.',
        timestamp: '2026-02-25T16:00:00',
      },
      {
        id: 'm10',
        senderId: 'u8',
        content: '🔥🔥 This is exactly what I needed. Marking as complete.',
        timestamp: '2026-02-26T10:00:00',
      },
    ],
    activity: [
      { id: 'a9', type: 'order_created', description: 'Order placed', timestamp: '2026-02-20T12:00:00' },
      { id: 'a10', type: 'file_uploaded', description: 'Beat delivered', timestamp: '2026-02-25T16:00:00' },
      { id: 'a11', type: 'status_change', description: 'Order completed — payout released', timestamp: '2026-02-26T10:00:00' },
    ],
  },
];

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const reviews: Review[] = [
  {
    id: 'r1',
    orderId: 'p3',
    reviewerId: 'u8',
    revieweeId: 'u3',
    professionalism: 5,
    deliveryTime: 5,
    quality: 5,
    communication: 4,
    text: 'Beatsmith is a PROBLEM. Beat came out exactly how I envisioned it. Delivered ahead of schedule and was professional throughout. Will be back.',
    createdAt: '2026-02-26',
  },
  {
    id: 'r2',
    orderId: 'p3',
    reviewerId: 'u3',
    revieweeId: 'u8',
    professionalism: 5,
    deliveryTime: 5,
    quality: 5,
    communication: 5,
    text: 'Great client. Clear vision, easy to work with, paid immediately. The type of artists you love working with. Hope to collab again.',
    createdAt: '2026-02-26',
  },
];

// ─── Helper functions ─────────────────────────────────────────────────────────
// PGES: All helpers are pure, deterministic, and defensively typed.
// They never throw — callers must check for undefined/empty returns.

export function getUserById(id: string): User | undefined {
  if (!id || typeof id !== 'string') return undefined;
  return users.find(u => u.id === id);
}

export function getListingById(id: string): Listing | undefined {
  if (!id || typeof id !== 'string') return undefined;
  return listings.find(l => l.id === id);
}

export function getProjectById(id: string): Project | undefined {
  if (!id || typeof id !== 'string') return undefined;
  return projects.find(p => p.id === id);
}

export function getListingsByUser(userId: string): Listing[] {
  if (!userId || typeof userId !== 'string') return [];
  return listings.filter(l => l.userId === userId);
}

export function getProjectsByUser(userId: string): Project[] {
  if (!userId || typeof userId !== 'string') return [];
  return projects.filter(p => p.buyerId === userId || p.sellerId === userId);
}

export function getReviewsByUser(userId: string): Review[] {
  if (!userId || typeof userId !== 'string') return [];
  return reviews.filter(r => r.revieweeId === userId);
}

export function formatPrice(price: number): string {
  if (typeof price !== 'number' || isNaN(price)) return '$0';
  return `$${Math.max(0, price).toLocaleString()}`;
}

export function formatListeners(n: number): string {
  if (typeof n !== 'number' || isNaN(n) || n < 0) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return `${n}`;
}

export function statusColor(status: string): string {
  if (!status || typeof status !== 'string') return '#6b7280';
  const map: Record<string, string> = {
    pending: '#f59e0b',
    in_progress: '#6366f1',
    awaiting_delivery: '#8b5cf6',
    delivered: '#10b981',
    revision_requested: '#f97316',
    completed: '#22c55e',
    cancelled: '#ef4444',
  };
  return map[status] ?? '#6b7280';
}

export function statusLabel(status: string): string {
  if (!status || typeof status !== 'string') return 'Unknown';
  const map: Record<string, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    awaiting_delivery: 'Awaiting Delivery',
    delivered: 'Delivered',
    revision_requested: 'Revision Requested',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return map[status] ?? status;
}
