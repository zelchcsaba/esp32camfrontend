import { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs';
import { useWS } from '../WsContext'; // a helyes útvonal

const JoystickControl = () => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const joystickInstanceRef = useRef<any>(null);
  const { sendMessage } = useWS();

  const createJoystick = () => {
    if (!joystickRef.current) return;

    if (joystickInstanceRef.current) {
      joystickInstanceRef.current.destroy();
      joystickInstanceRef.current = null;
    }

    const screenWidth = window.innerWidth;
    const joystickSize = screenWidth * 0.32;

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

      sendMessage({ x, y });
    });

    joystick.on('end', () => {
      sendMessage({ x: 0, y: 0 });
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
