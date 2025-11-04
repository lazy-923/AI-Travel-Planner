"use client";
import React, { useEffect, useRef } from 'react';

interface MapProps {
    locations?: { name: string; lng: number; lat: number }[];
}

const Map: React.FC<MapProps> = ({ locations }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<any>(null);
    const infoWindow = useRef<any>(null); // Ref to hold the InfoWindow instance

    useEffect(() => {
        if (window.AMap && mapContainer.current) {
            map.current = new window.AMap.Map(mapContainer.current, {
                zoom: 11,
                center: [116.397428, 39.90923],
            });

            // Create a single InfoWindow instance
            infoWindow.current = new window.AMap.InfoWindow({
                offset: new window.AMap.Pixel(0, -30) // Adjust offset to position it above the marker
            });

            return () => {
                map.current?.destroy();
            };
        }
    }, []);

    useEffect(() => {
        if (map.current && locations && locations.length > 0) {
            map.current.clearMap();
            const markers = locations.map(loc => {
                const markerContent = `
                    <div style="position: relative; background: #007BFF; color: white; padding: 6px 12px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); font-size: 14px; font-weight: bold; white-space: nowrap;">
                        ${loc.name}
                        <div style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-width: 8px; border-style: solid; border-color: #007BFF transparent transparent transparent;"></div>
                    </div>
                `;

                const marker = new window.AMap.Marker({
                    position: [loc.lng, loc.lat],
                    content: markerContent, // Use custom HTML content
                    anchor: 'bottom-center',
                });

                // Add click event to each marker
                marker.on('click', () => {
                    const infoWindowContent = `
                        <div style="font-size: 14px; color: #333; padding: 10px;">
                            <strong style="font-weight: bold;">${loc.name}</strong>
                            <hr style="margin: 8px 0; border-top: 1px solid #eee;">
                            <a href="https://www.amap.com/search?query=${encodeURIComponent(loc.name)}" target="_blank" style="color: #007BFF; text-decoration: none; font-weight: bold;">
                                导航到这里
                            </a>
                        </div>
                    `;
                    infoWindow.current.setContent(infoWindowContent);
                    infoWindow.current.open(map.current, marker.getPosition());
                });

                return marker;
            });
            map.current.add(markers);
            map.current.setFitView();
        }
    }, [locations]);

    return <div ref={mapContainer} className="h-full w-full" />;
};

export default Map;