import { useWS } from '../WsContext';

export default function ImageStream() {
  const { imageData } = useWS();

  return (
    <div className="w-1/2 h-13/15 fixed top-0 right-0 flex items-center justify-center bg-gray-800 select-none">
      {imageData ? (
        <img className="w-full h-full rounded-2xl object-contain border-4 border-gray-600 bg-black" src={imageData} alt="Live ESP32 CAM" style={{ maxWidth: '100%' }} />
      ) : (
        <p>Nincs kép</p>
      )}
    </div>
  );
}
