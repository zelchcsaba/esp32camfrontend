import { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const JoystickTwo = () => {
  const joystickRef1 = useRef<HTMLDivElement>(null);
  const joystickRef2 = useRef<HTMLDivElement>(null);
  const joystick1Instance = useRef<any>(null);
  const joystick2Instance = useRef<any>(null);
  const coords = useRef({ x: 0, y: 0 });

  const createJoysticks = () => {
    // Törlés, ha már léteznek joystickok
    if (joystick1Instance.current) {
      joystick1Instance.current.destroy();
      joystick1Instance.current = null;
    }
    if (joystick2Instance.current) {
      joystick2Instance.current.destroy();
      joystick2Instance.current = null;
    }

    const screenWidth = window.innerWidth;
    const joystickSize = screenWidth * 0.15;

    if (joystickRef1.current) {
      const joystick1 = nipplejs.create({
        zone: joystickRef1.current,
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'black',
        size: joystickSize,
      });

      joystick1.on('move', (_evt, data) => {
        if (!data?.vector) return;
        coords.current.y = parseFloat((data.vector.y || 0).toFixed(2));
        axios
          .post(`${apiUrl}/control`, {
            x: coords.current.x,
            y: coords.current.y,
          })
          .catch((err) => console.error('Joystick1 hiba:', err.message));
      });

      joystick1.on('end', () => {
        coords.current.y = 0;
        axios
          .post(`${apiUrl}/control`, {
            x: coords.current.x,
            y: coords.current.y,
          })
          .catch((err) => console.error('Joystick1 nullázás hiba:', err.message));
      });

      joystick1Instance.current = joystick1;
    }

    if (joystickRef2.current) {
      const joystick2 = nipplejs.create({
        zone: joystickRef2.current,
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'black',
        size: joystickSize,
      });

      joystick2.on('move', (_evt, data) => {
        if (!data?.vector) return;
        coords.current.x = parseFloat((data.vector.x || 0).toFixed(2));
        axios
          .post(`${apiUrl}/control`, {
            x: coords.current.x,
            y: coords.current.y,
          })
          .catch((err) => console.error('Joystick2 hiba:', err.message));
      });

      joystick2.on('end', () => {
        coords.current.x = 0;
        axios
          .post(`${apiUrl}/control`, {
            x: coords.current.x,
            y: coords.current.y,
          })
          .catch((err) => console.error('Joystick2 nullázás hiba:', err.message));
      });

      joystick2Instance.current = joystick2;
    }
  };

  useEffect(() => {
    createJoysticks();

    const handleResize = () => {
      createJoysticks();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (joystick1Instance.current) joystick1Instance.current.destroy();
      if (joystick2Instance.current) joystick2Instance.current.destroy();
    };
  }, []);

  return (
    <div className="flex w-screen h-screen">
      <div className="fixed left-0 top-0 h-screen w-1/4 bg-gray-800 flex items-center justify-center">
        <div
          ref={joystickRef1}
          className="w-2/3 h-auto aspect-square bg-gray-600 rounded-full"
          style={{ position: 'relative' }}
        />
      </div>
      <div className="fixed right-0 top-0 h-screen w-1/4 bg-gray-800 flex items-center justify-center">
        <div
          ref={joystickRef2}
          className="w-2/3 h-auto aspect-square bg-gray-600 rounded-full"
          style={{ position: 'relative' }}
        />
      </div>
    </div>
  );
};

export default JoystickTwo;
