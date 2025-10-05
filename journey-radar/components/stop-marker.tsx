import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { GeoPosition } from '@/types/geo-position';
import { Ionicons } from '@expo/vector-icons';
import {Colors} from "@/constants/theme";


interface StopMarkerProps {
  name: string;
  position: GeoPosition;
  distance?: string;
  estimatedTime?: string;
  onPress?: () => void;
  selected?: boolean;
}

const StopMarker: React.FC<StopMarkerProps> = ({
  name,
  position,
  distance,
  estimatedTime,
  onPress,
  selected = false,
}) => {
  // Create custom bus stop icon with Ionicons location icon
  const busStopIcon = new L.DivIcon({
    html: `
      <div style="
        width: 25px;
        height: 25px;
        background-color: ${selected ? '#486db1' : '#007bff'};
        border: 3px solid #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease;
      ">
        <Ionicons name="location" size={16} color={Colors.light.pink} />
      </div>
    `,
    className: 'bus-stop-marker',
    iconSize: [35, 35],
    iconAnchor: [17.5, 17.5],
  });

  const handleMarkerClick = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <Marker
      position={[position.latitude, position.longitude]}
      icon={busStopIcon}
      eventHandlers={{
        click: handleMarkerClick,
      }}
    >
      <Popup>
        <div style={{ minWidth: '200px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#333'
          }}>
            {name}
          </div>

          {(distance || estimatedTime) && (
            <div style={{
              fontSize: '12px',
              color: '#666',
              display: 'flex',
              gap: '8px'
            }}>
              {distance && <span>{distance}</span>}
              {estimatedTime && <span>• {estimatedTime}</span>}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default StopMarker;
