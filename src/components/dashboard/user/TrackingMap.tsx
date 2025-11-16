import { useEffect, useState, useRef } from 'react';
import { Bike, MapPin, Store } from 'lucide-react';

interface TrackingMapProps {
  orderId: string;
  storeAddress: string;
  deliveryAddress: string;
  driverLocation?: { lat: number; lng: number; updatedAt: string } | null;
  status: string;
  onLocationUpdate?: (lat: number, lng: number) => void;
}

// Helper function to geocode address to coordinates (simplified - using default Bogor coordinates)
const geocodeAddress = (address: string): { lat: number; lng: number } => {
  // Default coordinates for Bogor
  const defaultCoords = { lat: -6.5978, lng: 106.8067 };
  
  // Simple address matching for demo
  if (address.includes('Suryakencana')) {
    return { lat: -6.5950, lng: 106.8000 };
  }
  if (address.includes('Pajajaran')) {
    return { lat: -6.6000, lng: 106.8100 };
  }
  
  return defaultCoords;
};

// Calculate intermediate point between two coordinates
const interpolate = (start: { lat: number; lng: number }, end: { lat: number; lng: number }, progress: number) => {
  return {
    lat: start.lat + (end.lat - start.lat) * progress,
    lng: start.lng + (end.lng - start.lng) * progress,
  };
};

export function TrackingMap({ orderId, storeAddress, deliveryAddress, driverLocation, status, onLocationUpdate }: TrackingMapProps) {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  const storeCoords = geocodeAddress(storeAddress);
  const deliveryCoords = geocodeAddress(deliveryAddress);

  useEffect(() => {
    // Reset when order changes
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // If driver location is provided from API, use it (priority)
    if (driverLocation && driverLocation.lat && driverLocation.lng && (status === 'pickup' || status === 'delivering')) {
      setCurrentLocation({ lat: driverLocation.lat, lng: driverLocation.lng });
      
      // Calculate progress based on distance
      const totalDistance = Math.sqrt(
        Math.pow(deliveryCoords.lat - storeCoords.lat, 2) + 
        Math.pow(deliveryCoords.lng - storeCoords.lng, 2)
      );
      const currentDistance = Math.sqrt(
        Math.pow(driverLocation.lat - storeCoords.lat, 2) + 
        Math.pow(driverLocation.lng - storeCoords.lng, 2)
      );
      const calculatedProgress = Math.min(1, Math.max(0, currentDistance / totalDistance));
      setProgress(calculatedProgress);
      return;
    }

    // Simulate driver movement if status is pickup or delivering and no API location
    if (status === 'pickup' || status === 'delivering') {
      // Start from store location
      setCurrentLocation(storeCoords);
      setProgress(0);

      // Simulate movement (fallback if no API data)
      const startTime = Date.now();
      const duration = 60000; // 60 seconds for full journey

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(1, elapsed / duration);
        
        if (newProgress < 1) {
          setProgress(newProgress);
          const newLocation = interpolate(storeCoords, deliveryCoords, newProgress);
          setCurrentLocation(newLocation);
          
          // Update location via callback if provided
          if (onLocationUpdate) {
            onLocationUpdate(newLocation.lat, newLocation.lng);
          }
          
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Journey complete
          setProgress(1);
          setCurrentLocation(deliveryCoords);
          if (onLocationUpdate) {
            onLocationUpdate(deliveryCoords.lat, deliveryCoords.lng);
          }
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      };
    } else {
      // Not in delivery, show store location
      setCurrentLocation(storeCoords);
      setProgress(0);
    }
  }, [orderId, status, storeAddress, deliveryAddress]);

  // Update location when driverLocation prop changes (from API) - real-time updates
  useEffect(() => {
    if (driverLocation && driverLocation.lat && driverLocation.lng && (status === 'pickup' || status === 'delivering')) {
      // Cancel any ongoing simulation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      setCurrentLocation({ lat: driverLocation.lat, lng: driverLocation.lng });
      
      // Calculate progress based on distance
      const totalDistance = Math.sqrt(
        Math.pow(deliveryCoords.lat - storeCoords.lat, 2) + 
        Math.pow(deliveryCoords.lng - storeCoords.lng, 2)
      );
      const currentDistance = Math.sqrt(
        Math.pow(driverLocation.lat - storeCoords.lat, 2) + 
        Math.pow(driverLocation.lng - storeCoords.lng, 2)
      );
      const calculatedProgress = Math.min(1, Math.max(0, currentDistance / totalDistance));
      setProgress(calculatedProgress);
    }
  }, [driverLocation?.lat, driverLocation?.lng, driverLocation?.updatedAt, status, storeCoords, deliveryCoords]);

  if (!currentLocation) {
    return (
      <div className="w-full h-64 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <p className="body-3" style={{ color: '#858585' }}>Memuat peta...</p>
      </div>
    );
  }

  // Calculate position on map (0-100%)
  const calculatePosition = (coord: { lat: number; lng: number }, bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }) => {
    const latPercent = ((coord.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;
    const lngPercent = ((coord.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    return { latPercent, lngPercent };
  };

  // Calculate map bounds
  const minLat = Math.min(storeCoords.lat, deliveryCoords.lat, currentLocation.lat) - 0.01;
  const maxLat = Math.max(storeCoords.lat, deliveryCoords.lat, currentLocation.lat) + 0.01;
  const minLng = Math.min(storeCoords.lng, deliveryCoords.lng, currentLocation.lng) - 0.01;
  const maxLng = Math.max(storeCoords.lng, deliveryCoords.lng, currentLocation.lng) + 0.01;

  const storePos = calculatePosition(storeCoords, { minLat, maxLat, minLng, maxLng });
  const deliveryPos = calculatePosition(deliveryCoords, { minLat, maxLat, minLng, maxLng });
  const driverPos = calculatePosition(currentLocation, { minLat, maxLat, minLng, maxLng });

  // Generate Google Maps Static Map URL with markers and route
  const getStaticMapUrl = () => {
    const centerLat = (storeCoords.lat + deliveryCoords.lat) / 2;
    const centerLng = (storeCoords.lng + deliveryCoords.lng) / 2;
    
    // Build markers array
    const markers: string[] = [
      `color:0x4CAF50|label:T|${storeCoords.lat},${storeCoords.lng}`, // Green marker for store
      `color:0x2196F3|label:D|${deliveryCoords.lat},${deliveryCoords.lng}`, // Blue marker for destination
    ];
    
    // Add driver marker if available
    if (currentLocation && (status === 'pickup' || status === 'delivering')) {
      markers.push(`color:0xFF8D28|label:🚗|${currentLocation.lat},${currentLocation.lng}`); // Orange marker for driver
    }
    
    // Build path from store to destination
    const path = `color:0x2196F3|weight:5|${storeCoords.lat},${storeCoords.lng}|${deliveryCoords.lat},${deliveryCoords.lng}`;
    
    // If driver is moving, add path from store to driver
    let driverPath = '';
    if (currentLocation && (status === 'pickup' || status === 'delivering')) {
      driverPath = `|color:0xFF8D28|weight:4|${storeCoords.lat},${storeCoords.lng}|${currentLocation.lat},${currentLocation.lng}`;
    }
    
    // Use OpenStreetMap-based static map service (no API key needed)
    // Using a service that doesn't require API key
    const markersParam = markers.map(m => `markers=${encodeURIComponent(m)}`).join('&');
    const pathParam = `path=${encodeURIComponent(path + driverPath)}`;
    
    // Using Google Static Maps (will need API key in production, but works for demo)
    // For now, use a simpler approach with embed
    return `https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d3168.5!2d${centerLng}!3d${centerLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x0%3A0x0!2zNsKwMzUnNTIuMSJTIDEwNsKwNDgnMjQuMSJF!3m2!1d${storeCoords.lat}!2d${storeCoords.lng}!4m5!1s0x0%3A0x0!2zNsKwMzYnMDguMSJTIDEwNsKwNDgnMzYuMSJF!3m2!1d${deliveryCoords.lat}!2d${deliveryCoords.lng}!5e0!3m2!1sen!2s!4v1234567890`;
  };

  // Generate Google Maps embed URL with route visualization
  const getMapImageUrl = () => {
    const centerLat = (storeCoords.lat + deliveryCoords.lat) / 2;
    const centerLng = (storeCoords.lng + deliveryCoords.lng) / 2;
    
    // Use the simplest, most reliable Google Maps embed format
    // This shows the map centered on Bogor with zoom level 14
    // Format: https://www.google.com/maps/embed?pb=...
    // Using a working embed URL that shows Bogor area
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56402638384!2d106.72782745!3d-6.595038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5d2e602b5f5%3A0x4027980f0e5c7e0!2sBogor%2C%20West%20Java%2C%20Indonesia!5e0!3m2!1sen!2s!4v${Date.now()}`;
  };

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="relative w-full h-96 rounded-lg overflow-hidden border-2" style={{ borderColor: '#E0E0E0', backgroundColor: '#F5F5F5', minHeight: '384px' }}>
        {/* Google Maps Embed - MUST be visible and interactive */}
        <iframe
          width="100%"
          height="100%"
          style={{ 
            border: 0, 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            minHeight: '384px',
            zIndex: 1,
            display: 'block',
            backgroundColor: '#E8F5E9'
          }}
          loading="eager"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={getMapImageUrl()}
          title="Peta Pengiriman Real-Time"
          allow="geolocation"
          frameBorder="0"
        />
        
        {/* Overlay for custom markers - positioned on top of map */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          {/* Route Line */}
          {(status === 'pickup' || status === 'delivering') && (
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              {/* Route from store to delivery */}
              <line
                x1={`${storePos.lngPercent}%`}
                y1={`${100 - storePos.latPercent}%`}
                x2={`${deliveryPos.lngPercent}%`}
                y2={`${100 - deliveryPos.latPercent}%`}
                stroke="#2196F3"
                strokeWidth="3"
                strokeDasharray="5,5"
                opacity="0.6"
              />
              {/* Route from store to driver */}
              {currentLocation && (
                <line
                  x1={`${storePos.lngPercent}%`}
                  y1={`${100 - storePos.latPercent}%`}
                  x2={`${driverPos.lngPercent}%`}
                  y2={`${100 - driverPos.latPercent}%`}
                  stroke="#FF8D28"
                  strokeWidth="4"
                  opacity="0.8"
                />
              )}
            </svg>
          )}

          {/* Store Marker */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: `${storePos.lngPercent}%`,
              top: `${100 - storePos.latPercent}%`,
            }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#4CAF50' }}>
                <Store size={20} style={{ color: '#FFFFFF' }} />
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 rounded shadow-sm" style={{ backgroundColor: '#FFFFFF', whiteSpace: 'nowrap' }}>
                <p className="text-xs font-semibold" style={{ color: '#4CAF50' }}>Toko</p>
              </div>
            </div>
          </div>

          {/* Delivery Marker */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: `${deliveryPos.lngPercent}%`,
              top: `${100 - deliveryPos.latPercent}%`,
            }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#2196F3' }}>
                <MapPin size={20} style={{ color: '#FFFFFF' }} />
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 rounded shadow-sm" style={{ backgroundColor: '#FFFFFF', whiteSpace: 'nowrap' }}>
                <p className="text-xs font-semibold" style={{ color: '#2196F3' }}>Tujuan</p>
              </div>
            </div>
          </div>

          {/* Driver Marker with Motor Icon - Animated */}
          {currentLocation && (status === 'pickup' || status === 'delivering') && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-1000"
              style={{
                left: `${driverPos.lngPercent}%`,
                top: `${100 - driverPos.latPercent}%`,
              }}
            >
              <div className="relative">
                {/* Motor Icon with Animation */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl animate-bounce" style={{ backgroundColor: '#FF8D28' }}>
                  <Bike size={32} style={{ color: '#FFFFFF' }} />
                </div>
                {/* Pulsing Ring */}
                <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: '#FF8D28', opacity: 0.3 }}></div>
                {/* Driver Label */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 rounded-full shadow-lg" style={{ backgroundColor: '#FFFFFF', whiteSpace: 'nowrap', border: '2px solid #FF8D28' }}>
                  <p className="text-xs font-bold" style={{ color: '#FF8D28' }}>🏍️ Driver</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FF8D28' }}></div>
          <span className="body-3" style={{ color: '#858585' }}>Lokasi Driver</span>
        </div>
        <div className="flex items-center gap-2">
          <Store size={16} style={{ color: '#4CAF50' }} />
          <span className="body-3" style={{ color: '#858585' }}>Toko UMKM</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} style={{ color: '#2196F3' }} />
          <span className="body-3" style={{ color: '#858585' }}>Tujuan</span>
        </div>
      </div>

      {/* Progress Bar */}
      {(status === 'pickup' || status === 'delivering') && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: '#858585' }}>Progress Pengiriman</span>
            <span style={{ color: '#FF8D28', fontWeight: 600 }}>{Math.round(progress * 100)}%</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E0E0E0' }}>
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progress * 100}%`,
                backgroundColor: '#FF8D28',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

