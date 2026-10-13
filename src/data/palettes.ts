/**
 * Coloring palettes (docs/_research/design-system-spec.md §2.5). Shared by the art pipeline
 * (colored examples), the site (palette swatches) and the online coloring app.
 */
export interface Swatch {
  hex: string;
  name: string;
}
export interface Palette {
  id: string;
  name: string;
  mood: string;
  forTags: string[];
  swatches: Swatch[];
}

export const PALETTES: Palette[] = [
  {
    id: 'kids-rainbow',
    name: 'Kids Rainbow',
    mood: 'Bright and cheerful for little artists',
    forTags: ['kids'],
    swatches: [
      {
        hex: '#E5383B',
        name: 'Red',
      },
      {
        hex: '#FF7B00',
        name: 'Orange',
      },
      {
        hex: '#FFC300',
        name: 'Sunny Yellow',
      },
      {
        hex: '#8AC926',
        name: 'Lime',
      },
      {
        hex: '#2DA44E',
        name: 'Green',
      },
      {
        hex: '#00A6A6',
        name: 'Teal',
      },
      {
        hex: '#4CC9F0',
        name: 'Sky',
      },
      {
        hex: '#1E6FD9',
        name: 'Blue',
      },
      {
        hex: '#6A4C93',
        name: 'Purple',
      },
      {
        hex: '#F15BB5',
        name: 'Pink',
      },
      {
        hex: '#8D5524',
        name: 'Brown',
      },
      {
        hex: '#1B1B1B',
        name: 'Black',
      },
    ],
  },
  {
    id: 'iznik-tiles',
    name: 'Iznik Tiles',
    mood: 'Ottoman tile blues, reds and turquoise',
    forTags: ['mosque', 'geometric'],
    swatches: [
      {
        hex: '#0E4C92',
        name: 'Deep Cobalt',
      },
      {
        hex: '#1F6FB2',
        name: 'Cobalt',
      },
      {
        hex: '#A7C4E5',
        name: 'Soft Blue',
      },
      {
        hex: '#2BB3B1',
        name: 'Turquoise',
      },
      {
        hex: '#8ED6D3',
        name: 'Pale Turquoise',
      },
      {
        hex: '#C8102E',
        name: 'Bole Red',
      },
      {
        hex: '#E86A5C',
        name: 'Coral',
      },
      {
        hex: '#2E8B57',
        name: 'Iznik Green',
      },
      {
        hex: '#5B3A7A',
        name: 'Manganese',
      },
      {
        hex: '#F5F1E6',
        name: 'Slip White',
      },
    ],
  },
  {
    id: 'andalusian-courtyard',
    name: 'Andalusian Courtyard',
    mood: 'Warm terracotta, olive and azulejo blue',
    forTags: ['geometric', 'mosque'],
    swatches: [
      {
        hex: '#C1502E',
        name: 'Terracotta',
      },
      {
        hex: '#F4A259',
        name: 'Orange Blossom',
      },
      {
        hex: '#D9A441',
        name: 'Ochre',
      },
      {
        hex: '#6B8E23',
        name: 'Olive',
      },
      {
        hex: '#2F4F3A',
        name: 'Cypress',
      },
      {
        hex: '#2E5EAA',
        name: 'Azulejo Blue',
      },
      {
        hex: '#A7C7E7',
        name: 'Fountain',
      },
      {
        hex: '#D98C8C',
        name: 'Rose',
      },
      {
        hex: '#F3E9D2',
        name: 'Plaster',
      },
      {
        hex: '#9C8F7A',
        name: 'Stone',
      },
    ],
  },
  {
    id: 'desert-sunset',
    name: 'Desert Sunset',
    mood: 'Sand, apricot and twilight',
    forTags: ['nature', 'hajj'],
    swatches: [
      {
        hex: '#FFE8C2',
        name: 'Dune Light',
      },
      {
        hex: '#F6D186',
        name: 'Sand Gold',
      },
      {
        hex: '#FFB347',
        name: 'Apricot Sky',
      },
      {
        hex: '#FF7F50',
        name: 'Coral Sun',
      },
      {
        hex: '#E4572E',
        name: 'Ember',
      },
      {
        hex: '#A23B72',
        name: 'Dusk Rose',
      },
      {
        hex: '#5B2A86',
        name: 'Twilight',
      },
      {
        hex: '#2E1A47',
        name: 'Night',
      },
      {
        hex: '#C08552',
        name: 'Camel',
      },
      {
        hex: '#8C5E3C',
        name: 'Date Brown',
      },
    ],
  },
  {
    id: 'ramadan-night',
    name: 'Ramadan Night',
    mood: 'Midnight blues with lantern gold',
    forTags: ['ramadan', 'lantern', 'crescent'],
    swatches: [
      {
        hex: '#0B1D51',
        name: 'Midnight',
      },
      {
        hex: '#1E3A8A',
        name: 'Deep Blue',
      },
      {
        hex: '#3B5BDB',
        name: 'Twilight Blue',
      },
      {
        hex: '#7C9CF5',
        name: 'Evening',
      },
      {
        hex: '#B2EBF2',
        name: 'Moonlight',
      },
      {
        hex: '#F4F1EA',
        name: 'Moon White',
      },
      {
        hex: '#FFE29A',
        name: 'Lantern Glow',
      },
      {
        hex: '#F7C548',
        name: 'Lantern Gold',
      },
      {
        hex: '#E8A33D',
        name: 'Brass',
      },
      {
        hex: '#6A4C93',
        name: 'Dusk Violet',
      },
    ],
  },
  {
    id: 'eid-sweets',
    name: 'Eid Sweets',
    mood: 'Candy pastels for celebrations',
    forTags: ['eid', 'card'],
    swatches: [
      {
        hex: '#FFB5C2',
        name: 'Rose Lokum',
      },
      {
        hex: '#FF8FAB',
        name: 'Candy Pink',
      },
      {
        hex: '#FFD6A5',
        name: 'Apricot',
      },
      {
        hex: '#FDFFB6',
        name: 'Lemon Cream',
      },
      {
        hex: '#B5E48C',
        name: 'Pistachio',
      },
      {
        hex: '#9BF6FF',
        name: 'Aqua Icing',
      },
      {
        hex: '#A0C4FF',
        name: 'Periwinkle',
      },
      {
        hex: '#BDB2FF',
        name: 'Lavender',
      },
      {
        hex: '#E9C46A',
        name: 'Honey Gold',
      },
      {
        hex: '#D4A373',
        name: 'Baklava',
      },
    ],
  },
  {
    id: 'oasis',
    name: 'Oasis',
    mood: 'Palm greens and cool water',
    forTags: ['nature', 'animals'],
    swatches: [
      {
        hex: '#1B5E20',
        name: 'Palm Frond',
      },
      {
        hex: '#2E7D32',
        name: 'Leaf',
      },
      {
        hex: '#66BB6A',
        name: 'Fresh Green',
      },
      {
        hex: '#A5D6A7',
        name: 'Mint',
      },
      {
        hex: '#00897B',
        name: 'Spring Water',
      },
      {
        hex: '#4DD0E1',
        name: 'Pool',
      },
      {
        hex: '#0277BD',
        name: 'Deep Water',
      },
      {
        hex: '#F9E79F',
        name: 'Sand',
      },
      {
        hex: '#D4A276',
        name: 'Dune',
      },
      {
        hex: '#6D4C41',
        name: 'Palm Trunk',
      },
    ],
  },
  {
    id: 'pastel-garden',
    name: 'Pastel Garden',
    mood: 'Soft spring pastels',
    forTags: ['mandala', 'flowers'],
    swatches: [
      {
        hex: '#F8C8DC',
        name: 'Blush',
      },
      {
        hex: '#FAD4C0',
        name: 'Peach',
      },
      {
        hex: '#FFF1B6',
        name: 'Butter',
      },
      {
        hex: '#D7F2C2',
        name: 'Sprout',
      },
      {
        hex: '#B8E0D2',
        name: 'Sage Mint',
      },
      {
        hex: '#C6E2F5',
        name: 'Baby Blue',
      },
      {
        hex: '#D6CDEA',
        name: 'Lilac',
      },
      {
        hex: '#F2D7EE',
        name: 'Orchid',
      },
      {
        hex: '#E8D5B5',
        name: 'Oat',
      },
      {
        hex: '#BFD8B8',
        name: 'Celery',
      },
    ],
  },
  {
    id: 'spice-souk',
    name: 'Spice Souk',
    mood: 'Rich market spices',
    forTags: ['food', 'objects'],
    swatches: [
      {
        hex: '#9E2A2B',
        name: 'Sumac',
      },
      {
        hex: '#B5462E',
        name: 'Paprika',
      },
      {
        hex: '#D2691E',
        name: 'Cinnamon',
      },
      {
        hex: '#E0A100',
        name: 'Turmeric',
      },
      {
        hex: '#F2C14E',
        name: 'Saffron',
      },
      {
        hex: '#6B8F3A',
        name: "Za'atar",
      },
      {
        hex: '#3E5641',
        name: 'Cardamom',
      },
      {
        hex: '#7A3E1D',
        name: 'Clove',
      },
      {
        hex: '#E9D8A6',
        name: 'Cumin',
      },
      {
        hex: '#4A2C2A',
        name: 'Coffee',
      },
    ],
  },
  {
    id: 'deep-blue-sea',
    name: 'Deep Blue Sea',
    mood: 'Ocean blues and coral',
    forTags: ['ocean'],
    swatches: [
      {
        hex: '#03045E',
        name: 'Abyss',
      },
      {
        hex: '#023E8A',
        name: 'Deep Sea',
      },
      {
        hex: '#0077B6',
        name: 'Ocean',
      },
      {
        hex: '#0096C7',
        name: 'Current',
      },
      {
        hex: '#00B4D8',
        name: 'Lagoon',
      },
      {
        hex: '#48CAE4',
        name: 'Shallows',
      },
      {
        hex: '#90E0EF',
        name: 'Foam',
      },
      {
        hex: '#CAF0F8',
        name: 'Spray',
      },
      {
        hex: '#FFB4A2',
        name: 'Coral',
      },
      {
        hex: '#F1FAEE',
        name: 'Pearl',
      },
    ],
  },
  {
    id: 'mosque-marble',
    name: 'Mosque Marble',
    mood: 'Calm stone, marble and gold leaf',
    forTags: ['geometric', 'adults'],
    swatches: [
      {
        hex: '#FAF7F0',
        name: 'Marble',
      },
      {
        hex: '#E8E2D4',
        name: 'Limestone',
      },
      {
        hex: '#CFC6B4',
        name: 'Travertine',
      },
      {
        hex: '#A89F8E',
        name: 'Sandstone',
      },
      {
        hex: '#6E6758',
        name: 'Basalt',
      },
      {
        hex: '#3F3A33',
        name: 'Ebony',
      },
      {
        hex: '#C9A227',
        name: 'Gold Leaf',
      },
      {
        hex: '#8C6E1F',
        name: 'Antique Gold',
      },
      {
        hex: '#2F4858',
        name: 'Slate',
      },
      {
        hex: '#7A9E9F',
        name: 'Celadon',
      },
    ],
  },
  {
    id: 'pomegranate-orchard',
    name: 'Pomegranate Orchard',
    mood: 'Fruit and orchard colors',
    forTags: ['food'],
    swatches: [
      {
        hex: '#8E1B2B',
        name: 'Pomegranate',
      },
      {
        hex: '#E74C3C',
        name: 'Aril Red',
      },
      {
        hex: '#F5A3A3',
        name: 'Blossom',
      },
      {
        hex: '#5D3A5A',
        name: 'Fig',
      },
      {
        hex: '#4B2C5E',
        name: 'Grape',
      },
      {
        hex: '#708238',
        name: 'Olive',
      },
      {
        hex: '#3D4B2A',
        name: 'Olive Leaf',
      },
      {
        hex: '#7B3F00',
        name: 'Date',
      },
      {
        hex: '#E3A21A',
        name: 'Honey',
      },
      {
        hex: '#FFF8E7',
        name: 'Milk',
      },
    ],
  },
  {
    id: 'basics',
    name: 'Basics',
    mood: 'Black, greys and white',
    forTags: [],
    swatches: [
      {
        hex: '#000000',
        name: 'Black',
      },
      {
        hex: '#4A4A4A',
        name: 'Charcoal',
      },
      {
        hex: '#9E9E9E',
        name: 'Grey',
      },
      {
        hex: '#D9D9D9',
        name: 'Light Grey',
      },
      {
        hex: '#FFFFFF',
        name: 'White',
      },
    ],
  },
  {
    id: 'skin-hair',
    name: 'Skin Hair',
    mood: 'Skin and hair tones for faceless figures',
    forTags: [],
    swatches: [
      {
        hex: '#F9D9C5',
        name: 'Tone 1',
      },
      {
        hex: '#EDB98A',
        name: 'Tone 2',
      },
      {
        hex: '#D08B5B',
        name: 'Tone 3',
      },
      {
        hex: '#AE5D29',
        name: 'Tone 4',
      },
      {
        hex: '#7D4A2A',
        name: 'Tone 5',
      },
      {
        hex: '#4A2F23',
        name: 'Tone 6',
      },
      {
        hex: '#2B1D16',
        name: 'Dark Hair',
      },
      {
        hex: '#A8692E',
        name: 'Chestnut',
      },
    ],
  },
];

export const PALETTE_BY_ID: Record<string, Palette> = Object.fromEntries(PALETTES.map((p) => [p.id, p]));

/** Default palette per hub (design spec: Ramadan → ramadan-night, geometric → mosque-marble, …). */
export const HUB_DEFAULT_PALETTE: Record<string, string> = {
  'ramadan-coloring-pages': 'ramadan-night',
  'eid-coloring-pages': 'eid-sweets',
  'islamic-geometric-coloring-pages': 'mosque-marble',
  'mandala-coloring-pages': 'pastel-garden',
  'mosque-coloring-pages': 'iznik-tiles',
  printables: 'kids-rainbow',
  'arabic-alphabet': 'kids-rainbow',
};

export const getPalette = (id: string | undefined): Palette => PALETTE_BY_ID[id ?? ''] ?? PALETTE_BY_ID['kids-rainbow']!;
