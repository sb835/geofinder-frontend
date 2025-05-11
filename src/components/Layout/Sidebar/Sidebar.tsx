import type { Dispatch, SetStateAction } from 'react';
import './Sidebar.css';
import polyline from '@mapbox/polyline';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import { BACKEND_URL } from '../../../../src/config';

type MarkerData = {
    display_name: string;
    lat: string;
    lon: string;
};

type RouteData = {
    distance: number;
    duration: number;
};

type RouteCoords = {
    lat: number;
    lng: number;
};

type SidebarProps = {
    setStartMarker: Dispatch<SetStateAction<MarkerData>>;
    setEndMarker: Dispatch<SetStateAction<MarkerData>>;
    setRouteCoords: Dispatch<SetStateAction<RouteCoords[]>>;
    start: string;
    end: string;
    routeInfo: RouteData;
    errorMessage: string;
    setStart: Dispatch<SetStateAction<string>>;
    setEnd: Dispatch<SetStateAction<string>>;
    setRouteInfo: Dispatch<SetStateAction<RouteData>>;
    setErrorMessage: Dispatch<SetStateAction<string>>;
};

function Sidebar({
    setStartMarker,
    setEndMarker,
    setRouteCoords,
    start,
    end,
    routeInfo,
    errorMessage,
    setStart,
    setEnd,
    setRouteInfo,
    setErrorMessage,
}: SidebarProps) {
    const handleRoute = () => {
        setErrorMessage('');
        if (!start || !end) {
            setErrorMessage('Start or end is missing. Please provide both.');
            return;
        }

        const fetchStart = fetch(`${BACKEND_URL}/geocoords?q=${start}`).then(
            (res) => res.json()
        );
        const fetchEnd = fetch(`${BACKEND_URL}/geocoords?q=${end}`).then(
            (res) => res.json()
        );

        Promise.all([fetchStart, fetchEnd])
            .then(([startData, endData]) => {
                setStartMarker({
                    display_name: startData.display_name,
                    lat: startData.lat,
                    lon: startData.lon,
                });

                setEndMarker({
                    display_name: endData.display_name,
                    lat: endData.lat,
                    lon: endData.lon,
                });

                return fetch(`${BACKEND_URL}/georoute`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        start: [
                            parseFloat(startData.lon),
                            parseFloat(startData.lat),
                        ],
                        end: [parseFloat(endData.lon), parseFloat(endData.lat)],
                    }),
                });
            })
            .then((res) => res.json())
            .then((data) => {
                // Create route
                const decoded = polyline.decode(data.routes[0].geometry);
                const latlngs = decoded.map(([lat, lng]) => ({ lat, lng }));

                setRouteInfo({
                    distance: data.routes[0].segments[0].distance,
                    duration: data.routes[0].segments[0].duration,
                });

                setRouteCoords(latlngs);
            })
            .catch((err) => {
                setErrorMessage(
                    `API doesn't respond. Make sure both points exist and are accesible by land.`
                );
                console.error(
                    'Error while retrieving the location or route data:',
                    err
                );
            });
    };

    return (
        <div className="sidebar">
            <h2>Plan a route</h2>

            <label htmlFor="start">From:</label>
            <input
                id="start"
                type="text"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                placeholder="e.g. Freiburg"
            />

            <label htmlFor="end">To:</label>
            <input
                id="end"
                type="text"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                placeholder="e.g. Paris"
            />

            <button onClick={handleRoute}> Calculate route</button>

            {/* Platzhalter für Ergebnis */}
            <div className="route-info">
                <p>
                    <strong>
                        Distance: {(routeInfo.distance / 1000).toFixed(2)} km
                    </strong>
                </p>
                <p>
                    <strong>
                        Duration (with a car):{' '}
                        {Math.floor(routeInfo.duration / 3600)} h{' '}
                        {Math.floor((routeInfo.duration % 3600) / 60)} min
                    </strong>
                </p>
            </div>
            {errorMessage && <ErrorMessage message={errorMessage} />}
        </div>
    );
}

export default Sidebar;
