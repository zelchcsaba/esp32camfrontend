<<<<<<< HEAD
import { useWS } from '../WsContext';
=======
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const apiUrl = import.meta.env.VITE_API_URL;

const socket = io(apiUrl, {
  transports: ['websocket'],
});
>>>>>>> master

export default function ImageStream() {
  const { imageData } = useWS();
  return (
    <div className="absolute left-1/2 transform -translate-x-1/2  w-1/2 h-screen flex items-center justify-center bg-gray-800">
      {imageData  ? (
        <img className="w-full h-full rounded-2xl object-contain border-4 border-gray-600 bg-black" src={imageData } alt="Live ESP32 CAM" style={{ maxWidth: '100%' }} />
      ) : (
        <p>Nincs kép</p>
      )}
    </div>
  );
}
