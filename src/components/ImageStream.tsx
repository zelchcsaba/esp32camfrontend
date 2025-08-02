import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://192.168.0.104:3000', {
  transports: ['websocket'],
});

export default function ImageStream() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    // Ez a metódus akkor fut le, amikor új 'image' eseményt kapunk
    socket.on('image', (data: ArrayBuffer) => {
      // 1. Létrehozunk egy blobot a bináris JPEG adatból
      const blob = new Blob([data], { type: 'image/jpeg' });

      // 2. Generálunk egy ideiglenes URL-t, amit meg tud jeleníteni az <img>
      const url = URL.createObjectURL(blob);

      // 3. Beállítjuk a képet megjelenítéshez
      setImageSrc((prevUrl) => {
        // Felszabadítjuk az előző URL-t, hogy ne szivárogjon memória
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        return url;
      });
    });

    return () => {
      socket.off('image'); // leiratkozunk, ha a komponens eltűnik
    };
  }, []);

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2  w-1/2 h-screen flex items-center justify-center bg-gray-800">
      {imageSrc ? (
        <img className="w-full h-full rounded-2xl object-contain border-4 border-gray-600 bg-black" src={imageSrc} alt="Live ESP32 CAM" style={{ maxWidth: '100%' }} />
      ) : (
        <p>Nincs kép</p>
      )}
    </div>
  );
}
