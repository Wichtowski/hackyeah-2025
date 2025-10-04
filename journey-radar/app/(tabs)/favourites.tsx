import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from "@/components/header";
import { FavouriteRoute } from '@/types/favourite';
import { useRoute } from '@/contexts/RouteContext';
import { RoutesList } from '@/components/routes-list';
import { mockFavouriteRoutes } from '@/services/routesData';

export default function FavouritesScreen() {
  const [favouriteRoutes, setFavouriteRoutes] = useState<FavouriteRoute[]>(mockFavouriteRoutes);
  const router = useRouter();
  const { setRoute } = useRoute();

  const handleDeleteRoute = (routeId: string) => {
    Alert.alert(
      'Delete Route',
      'Are you sure you want to remove this favourite route?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setFavouriteRoutes(routes => routes.filter(route => route.id !== routeId));
          }
        }
      ]
    );
  };

  const handleUseRoute = (route: FavouriteRoute) => {
    // Set the route in the shared context
    setRoute(route.source, route.destination);
    console.log('Using route:', route);
    // Navigate to home screen where the stations will be displayed
    router.push('/');
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Header />
      <RoutesList
        routes={favouriteRoutes}
        title="Favourite Routes"
        icon="bus"
        emptyStateTitle="No Favourite Routes"
        emptyStateText="Save your frequently used bus routes to access them quickly here."
        onUseRoute={handleUseRoute}
        onDeleteRoute={handleDeleteRoute}
        showActions={true}
      />
    </div>
  );
}
