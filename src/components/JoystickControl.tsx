import { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const JoystickControl = () => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const joystickInstanceRef = useRef<any>(null);

  const createJoystick = () => {
    if (!joystickRef.current) return;

    // Előző joystick eltávolítása
    if (joystickInstanceRef.current) {
      joystickInstanceRef.current.destroy();
      joystickInstanceRef.current = null;
    }

    const screenWidth = window.innerWidth;
    const joystickSize = screenWidth * 0.32; // max 200px vagy 25% szélességből

    const joystick = nipplejs.create({
      zone: joystickRef.current,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'black',
      size: joystickSize,
    });

    joystick.on('move', (_evt, data) => {
      if (!data?.vector) return;

      const x = parseFloat((data.vector.x || 0).toFixed(2));
      const y = parseFloat((data.vector.y || 0).toFixed(2));

      axios
        .post(`${apiUrl}/control`, { x, y })
        .catch((err) => console.error('Hiba a küldésnél:', err.message));
    });

    joystick.on('end', () => {
      axios
        .post(`${apiUrl}/control`, { x: 0, y: 0 })
        .catch((err) => console.error('Hiba a nullázásnál:', err.message));
    });

    joystickInstanceRef.current = joystick;
  };

  useEffect(() => {
    createJoystick();

    const handleResize = () => {
      createJoystick();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (joystickInstanceRef.current) {
        joystickInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-1/2 h-screen bg-gray-800 flex items-center justify-center">
      <div
        ref={joystickRef}
        className="w-2/3 h-auto aspect-square bg-gray-600 rounded-full"
        style={{ position: 'relative' }}
      />
    </div>
  );
};

export default JoystickControl;
