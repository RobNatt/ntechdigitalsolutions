import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export function PixelGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rotation = 0;
    let animationId: number;

    // Simple globe representation with pixels
    const drawGlobe = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 70;

      // Draw pixels in a spherical pattern
      for (let lat = -90; lat <= 90; lat += 8) {
        for (let lon = -180; lon <= 180; lon += 8) {
          const adjustedLon = lon + rotation;
          
          // Convert spherical to cartesian coordinates
          const latRad = (lat * Math.PI) / 180;
          const lonRad = (adjustedLon * Math.PI) / 180;
          
          const x = radius * Math.cos(latRad) * Math.cos(lonRad);
          const y = radius * Math.cos(latRad) * Math.sin(lonRad);
          const z = radius * Math.sin(latRad);

          // Only draw pixels on the front hemisphere
          if (y > -radius * 0.2) {
            const screenX = centerX + x;
            const screenY = centerY - z;

            // Determine if this is "land" (higher density) or "water" (lower density)
            // Using a simple noise-like pattern based on coordinates
            const isLand = (Math.sin(lat * 0.3) * Math.cos(lon * 0.2) + Math.sin(lon * 0.15) * Math.cos(lat * 0.25)) > 0.2;
            
            // Elevation - make some land areas more dense
            const elevation = Math.abs(Math.sin(lat * 0.5) * Math.cos(lon * 0.3));
            const shouldDraw = isLand ? Math.random() > 0.3 : Math.random() > 0.8;

            if (shouldDraw) {
              // Pixel size based on depth (y-coordinate)
              const depth = (y + radius) / (radius * 2);
              const pixelSize = 1.5 + depth * 1.5;
              
              // Color based on elevation and depth
              const brightness = isLand ? 100 + elevation * 80 : 120;
              const alpha = 0.4 + depth * 0.5;
              
              ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${alpha})`;
              ctx.fillRect(screenX - pixelSize / 2, screenY - pixelSize / 2, pixelSize, pixelSize);

              // Add extra pixels for elevated land
              if (isLand && elevation > 0.6 && Math.random() > 0.7) {
                ctx.fillStyle = `rgba(80, 80, 80, ${alpha})`;
                ctx.fillRect(screenX - pixelSize / 2 - 1, screenY - pixelSize / 2 - 1, pixelSize * 0.7, pixelSize * 0.7);
              }
            }
          }
        }
      }

      rotation += 0.3;
      animationId = requestAnimationFrame(drawGlobe);
    };

    drawGlobe();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className="w-80 h-48 rounded-lg border-2 border-gray-400/40 bg-gray-100/40 backdrop-blur-sm p-4 flex items-center justify-center relative overflow-hidden">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gray-400/60" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gray-400/60" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gray-400/60" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gray-400/60" />

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={180}
          height={180}
          className="relative z-10"
        />
        
        {/* Orbital rings */}
        <motion.div
          className="absolute inset-0 border-2 border-gray-400/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          style={{ transform: 'rotateX(60deg)' }}
        />
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-radial from-gray-300/20 to-transparent blur-xl -z-10" />
      </div>

      {/* Label */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-600 font-mono">
        GLOBAL.MAP
      </div>

      {/* Subtle scan line */}
      <motion.div
        className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gray-400/30 to-transparent pointer-events-none"
        animate={{ top: ['0%', '100%'] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
      />
    </div>
  );
}
