import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

type Props = {
    coords: { lat: number; lng: number }[];
};

export default function FitBoundsHelper({ coords }: Props) {
    const map = useMap();

    useEffect(() => {
        if (coords.length > 0) {
            const bounds = coords.map((c) => [c.lat, c.lng]) as [
                number,
                number
            ][];
            map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
        }
    }, [coords, map]);

    return null;
}
