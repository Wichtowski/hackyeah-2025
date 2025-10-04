import React from 'react';
import 'leaflet-defaulticon-compatibility';
import 'leaflet/dist/leaflet.css';

import { MapContainer as Map, TileLayer } from 'react-leaflet';
import StopMarker from './stop-marker';
import {GeoPosition} from "@/types/geo-position";

const BASE_COORDINATES: GeoPosition = {
    latitude: 50.05936,
    longitude: 19.93435,
} // Krakow, Poland

export const MapContainer = () => {
    return (
        <Map
            center={[BASE_COORDINATES.latitude, BASE_COORDINATES.longitude]}
            zoom={16}
            scrollWheelZoom={false}
            style={{ height: '1000px', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
            />

            {/* Bus stop markers positioned in a line (route simulation) */}
            <StopMarker
                name="Central Station"
                position={{ latitude: BASE_COORDINATES.latitude - 0.003, longitude: BASE_COORDINATES.longitude - 0.002 }}
                distance="0m"
                estimatedTime="0 min"
                onPress={() => console.log('Central Station clicked!')}
            />
            <StopMarker
                name="Market Square"
                position={{ latitude: BASE_COORDINATES.latitude - 0.001, longitude: BASE_COORDINATES.longitude }}
                distance="350m"
                estimatedTime="2 min"
                onPress={() => console.log('Market Square clicked!')}
            />
            <StopMarker
                name="University Gate"
                position={{ latitude: BASE_COORDINATES.latitude + 0.001, longitude: BASE_COORDINATES.longitude + 0.002 }}
                distance="650m"
                estimatedTime="4 min"
                onPress={() => console.log('University Gate clicked!')}
            />
            <StopMarker
                name="Shopping Center"
                position={{ latitude: BASE_COORDINATES.latitude + 0.002, longitude: BASE_COORDINATES.longitude + 0.005 }}
                distance="950m"
                estimatedTime="6 min"
                onPress={() => console.log('Shopping Center clicked!')}
            />
            <StopMarker
                name="Sports Complex"
                position={{ latitude: BASE_COORDINATES.latitude + 0.003, longitude: BASE_COORDINATES.longitude + 0.007 }}
                distance="1200m"
                estimatedTime="8 min"
                onPress={() => console.log('Sports Complex clicked!')}
            />
        </Map>
    );
};
