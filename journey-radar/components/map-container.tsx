import React from 'react';
import 'leaflet-defaulticon-compatibility';
import 'leaflet/dist/leaflet.css';

import { MapContainer as Map, Marker, Popup, TileLayer } from 'react-leaflet';


export const MapContainer = () => {
    return (
        <Map
            center={[50.06787821610225, 19.991617943377845]} // Krakow Tauron Arena ;3
            zoom={16}
            scrollWheelZoom={false}
            style={{ height: '1000px', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
            />
            <Marker position={[50.06787821610225, 19.991617943377845]}>
                <Popup>
                    An approach to solve using osm in expo web platform.
                </Popup>
            </Marker>
        </Map>
    );
};
