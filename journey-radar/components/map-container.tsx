import React, { useEffect, useRef } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Station } from '@/types/journey';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapContainerProps {
  station?: Station | null;
}

// Component to handle map centering
const MapCenterController: React.FC<{ station?: Station | null }> = ({ station }) => {
  const map = useMap();
  
  useEffect(() => {
    if (station?.position) {
      map.setView([station.position.latitude, station.position.longitude], 15);
    }
  }, [station, map]);
  
  return null;
};

export const MapContainer: React.FC<MapContainerProps> = ({ station }) => {
  const defaultCenter: [number, number] = [50.05936, 19.93435]; // Kraków
  const center: [number, number] = station?.position 
    ? [station.position.latitude, station.position.longitude]
    : defaultCenter;

  return (
    <LeafletMapContainer
      center={center}
      zoom={station?.position ? 15 : 13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {station?.position && (
        <Marker position={[station.position.latitude, station.position.longitude]}>
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <strong>{station.name}</strong>
              <br />
              <small>
                Lat: {station.position.latitude.toFixed(5)}<br />
                Lng: {station.position.longitude.toFixed(5)}
              </small>
            </div>
          </Popup>
        </Marker>
      )}
      
      <MapCenterController station={station} />
    </LeafletMapContainer>
  );
};
