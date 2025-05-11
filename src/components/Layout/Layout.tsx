import './Layout.css';
import MapView from './MapView/MapView';
import Sidebar from './Sidebar/Sidebar';
import { useState } from 'react';

interface LayoutProps {
    sidebarOpen: boolean;
}

type MarkerData = {
    display_name: string;
    lat: string;
    lon: string;
};

type RouteCoords = {
    lat: number;
    lng: number;
};

type RouteData = {
    distance: number;
    duration: number;
};

function Layout({ sidebarOpen }: LayoutProps) {
    const [startMarker, setStartMarker] = useState<MarkerData>({
        display_name: '',
        lat: '',
        lon: '',
    });

    const [endMarker, setEndMarker] = useState<MarkerData>({
        display_name: '',
        lat: '',
        lon: '',
    });

    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [routeInfo, setRouteInfo] = useState<RouteData>({
        distance: 0,
        duration: 0,
    });
    const [errorMessage, setErrorMessage] = useState('');

    const [routeCoords, setRouteCoords] = useState<RouteCoords[]>([]);

    return (
        <div className="layout">
            <MapView
                sidebarOpen={sidebarOpen}
                startMarker={startMarker}
                endMarker={endMarker}
                routeCoords={routeCoords}
            />
            {sidebarOpen && (
                <Sidebar
                    setStartMarker={setStartMarker}
                    setEndMarker={setEndMarker}
                    setRouteCoords={setRouteCoords}
                    start={start}
                    end={end}
                    routeInfo={routeInfo}
                    errorMessage={errorMessage}
                    setStart={setStart}
                    setEnd={setEnd}
                    setRouteInfo={setRouteInfo}
                    setErrorMessage={setErrorMessage}
                />
            )}
        </div>
    );
}

export default Layout;
