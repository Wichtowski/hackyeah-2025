import { FavouriteRoute } from '@/types/favourite';

// Mock data - shared between home and favourites screens
export const mockFavouriteRoutes: FavouriteRoute[] = [
  {
    id: '1',
    name: '',
    source: {
      id: 'station_1',
      name: 'Central Station',
      coordinates: { latitude: 52.2297, longitude: 21.0122 },
      type: 'bus'
    },
    destination: {
      id: 'station_2',
      name: 'Business District',
      coordinates: { latitude: 52.2319, longitude: 21.0067 },
      type: 'bus'
    },
    createdAt: new Date('2024-10-01'),
    lastUsed: new Date('2024-10-04')
  },
  {
    id: '2',
    name: '',
    source: {
      id: 'station_3',
      name: 'Old Town Square',
      coordinates: { latitude: 52.2485, longitude: 21.0155 },
      type: 'bus'
    },
    destination: {
      id: 'station_4',
      name: 'University Campus',
      coordinates: { latitude: 52.2388, longitude: 21.0217 },
      type: 'bus'
    },
    createdAt: new Date('2024-09-15'),
    lastUsed: new Date('2024-10-02')
  },
  {
    id: '3',
    name: '',
    source: {
      id: 'station_5',
      name: 'Residential Area',
      coordinates: { latitude: 52.2156, longitude: 21.0089 },
      type: 'bus'
    },
    destination: {
      id: 'station_6',
      name: 'Shopping Mall',
      coordinates: { latitude: 52.2267, longitude: 21.0444 },
      type: 'bus'
    },
    createdAt: new Date('2024-09-20')
  }
];

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
};
