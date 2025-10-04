import { useState } from 'react';
import { Alert } from 'react-native';
import TransportSelector from '@/components/transport-selector';
import { StationInput } from '@/components/station-input';
import { Header } from '@/components/header';
import { Station } from '@/types/station';
import ApiHealthButton from '@/components/api-health-button';
import { useRoute } from '@/contexts/RouteContext';
import { FavouriteRoute } from '@/types/favourite';
import { RoutesList } from '@/components/routes-list';
import { mockFavouriteRoutes } from '@/services/routesData';

export default function HomeScreen() {
  const { sourceStation, destinationStation, setSourceStation, setDestinationStation, setRoute } = useRoute();
  const [lastUsedRoutes, setLastUsedRoutes] = useState<FavouriteRoute[]>(mockFavouriteRoutes);

  const handleSourceChange = (station: Station | null): void => {
    setSourceStation(station);
    console.log('Source station set to:', station);
  };

  const handleDestinationChange = (station: Station | null): void => {
    setDestinationStation(station);
    console.log('Destination station set to:', station);
  };

  const handleDeleteRoute = (routeId: string) => {
    Alert.alert(
      'Delete Route',
      'Are you sure you want to remove this route?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setLastUsedRoutes(routes => routes.filter(route => route.id !== routeId));
          }
        }
      ]
    );
  };

  const handleUseRoute = (route: FavouriteRoute) => {
    // Set the route in the shared context
    setRoute(route.source, route.destination);
    console.log('Using route:', route);
  };

  // Sort routes by last used date (most recent first)
  const sortedRoutes = lastUsedRoutes
    .filter(route => route.lastUsed)
    .sort((a, b) => {
      if (!a.lastUsed || !b.lastUsed) return 0;
      return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
    });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Header />
      <StationInput
        onSourceChange={handleSourceChange}
        onDestinationChange={handleDestinationChange}
        sourceStation={sourceStation}
        destinationStation={destinationStation}
        absolutePosition={false}
      />

      <RoutesList
        routes={sortedRoutes}
        title="Last Used Routes"
        icon="time"
        emptyStateTitle="No Recent Routes"
        emptyStateText="Your recently used routes will appear here."
        onUseRoute={handleUseRoute}
        onDeleteRoute={handleDeleteRoute}
        showActions={true}
      />
    </div>
  );
}
