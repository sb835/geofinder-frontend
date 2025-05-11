import { useEffect } from 'react';
import './MapView.css';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Polyline } from 'react-leaflet';
import FitBoundsHelper from './FitBoundsHelper';

type PopUps = {
    geocode: [number, number];
    popUp: string;
};

type MarkerData = {
    display_name: string;
    lat: string;
    lon: string;
};

type RouteCoords = {
    lat: number;
    lng: number;
};

type MapViewProps = {
    sidebarOpen: boolean;
    startMarker: MarkerData;
    endMarker: MarkerData;
    routeCoords: RouteCoords[];
};

// Ensures the map resizes correctly when sidebar visibility changes
function ResizeHandler({ trigger }: { trigger: boolean }) {
    const map = useMap();

    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }, [trigger]);

    return null;
}

const freiburg: [number, number] = [47.999, 7.842];

function MapView({
    sidebarOpen,
    startMarker,
    endMarker,
    routeCoords,
}: MapViewProps) {
    const markers: PopUps[] = [
        {
            geocode: [Number(startMarker.lat), Number(startMarker.lon)],
            popUp: startMarker.display_name,
        },
        {
            geocode: [Number(endMarker.lat), Number(endMarker.lon)],
            popUp: endMarker.display_name,
        },
    ];

    const customIcon = new Icon({
        iconUrl: '/geofinder-frontend/pin.png',
        iconSize: [38, 38],
    });

    return (
        <div className="map">
            <MapContainer
                center={freiburg}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <ResizeHandler trigger={sidebarOpen} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MarkerClusterGroup chunkedLoading>
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            position={marker.geocode}
                            icon={customIcon}
                        >
                            <Popup>{marker.popUp}</Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
                <Polyline positions={routeCoords} color="blue" />
                <FitBoundsHelper coords={routeCoords} />
            </MapContainer>
        </div>
    );
}

export default MapView;
