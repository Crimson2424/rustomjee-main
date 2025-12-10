import { useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import AnimatedPath from "./AnimatedPath";
import { usePaths } from "./PathsContext";
import { pathData } from "./PathData";

// Marker component with animation timing (for non-portfolio paths)
function PathMarker({ position, duration, isActive }) {
  const [showMarker, setShowMarker] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setShowMarker(true);
      }, duration * 1000);

      return () => {
        clearTimeout(timer);
        setShowMarker(false);
      };
    } else {
      setShowMarker(false);
    }
  }, [isActive, duration]);

  if (!showMarker) return null;

  const elevatedPosition = [
    position[0] + 5,
    position[1] + 60,
    position[2] + 5
  ];

  return (
    <Html
      position={elevatedPosition}
      center
      style={{
        pointerEvents: 'none',
      }}
    >
      <svg
        width="45"
        height="45"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 8px rgba(34, 121, 192, 0.9))',
          animation: 'markerEntrance 0.6s ease-out forwards',
        }}
      >
        <style>
          {`
            @keyframes markerEntrance {
              0% {
                opacity: 0;
                transform: scale(0) translateY(-50px);
              }
              60% {
                opacity: 1;
                transform: scale(1.15) translateY(5px);
              }
              80% {
                transform: scale(0.95) translateY(-2px);
              }
              100% {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}
        </style>
        <path
          fill="white"
          stroke="white"
          strokeWidth="1.5"
          d="M14,10a2,2,0,1,1-2-2A2.006,2.006,0,0,1,14,10Zm5.5,0c0,6.08-4.67,9.89-6.67,11.24a1.407,1.407,0,0,1-.83.26,1.459,1.459,0,0,1-.84-.26C9.16,19.89,4.5,16.09,4.5,10A7.33,7.33,0,0,1,12,2.5,7.336,7.336,0,0,1,19.5,10ZM16,10a4,4,0,1,0-4,4A4,4,0,0,0,16,10Z"
        />
        <path
          fill="#2279C0"
          d="M14,10a2,2,0,1,1-2-2A2.006,2.006,0,0,1,14,10Zm5.5,0c0,6.08-4.67,9.89-6.67,11.24a1.407,1.407,0,0,1-.83.26,1.459,1.459,0,0,1-.84-.26C9.16,19.89,4.5,16.09,4.5,10A7.33,7.33,0,0,1,12,2.5,7.336,7.336,0,0,1,19.5,10ZM16,10a4,4,0,1,0-4,4A4,4,0,0,0,16,10Z"
        />
      </svg>
    </Html>
  );
}

// Simple Portfolio Location Card - Image + Name only
function PortfolioLocationCard({ path, isSelected, onClick, index }) {
  const [isHovered, setIsHovered] = useState(false);

  // Use the last point of the path as the card position
  const lastPoint = path.points[path.points.length - 1];
  const position = Array.isArray(lastPoint)
    ? [lastPoint[0], lastPoint[1] + 100, lastPoint[2]]
    : [lastPoint.x, lastPoint.y + 100, lastPoint.z];

  return (
    <Html
      position={position}
      center
      zIndexRange={[100, 0]}
      style={{
        pointerEvents: 'auto',
        userSelect: 'none',
      }}
      occlude={false}
      distanceFactor={2000}
    >
      {/* Added data-portfolio-card attribute for click outside detection */}
      <div
        data-portfolio-card="true"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          cursor: 'pointer',
          animation: `cardEntrance 0.6s ease-out forwards`,
          animationDelay: `${index * 0.15}s`,
          opacity: 0,
        }}
      >
        <style>
          {`
            @keyframes cardEntrance {
              0% {
                opacity: 0;
                transform: scale(0.5) translateY(20px);
              }
              100% {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}
        </style>
        
        {/* Card Container */}
        <div
          style={{
            width: '140px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: isSelected 
              ? '0 8px 30px rgba(34, 121, 192, 0.4), 0 0 0 3px #2279C0'
              : isHovered 
                ? '0 12px 35px rgba(0, 0, 0, 0.3)'
                : '0 8px 25px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            border: isSelected ? '3px solid #2279C0' : '3px solid white',
          }}
        >
          {/* Image */}
          <div
            style={{
              width: '100%',
              height: '90px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {path.image ? (
              <img
                src={path.image}
                alt={path.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #2279C0 0%, #1a5a8a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '32px' }}>🏢</span>
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
              }}
            />
            
            {/* Name on image */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                  textAlign: 'center',
                }}
              >
                {path.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Arrow pointing down */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: isSelected ? '10px solid #2279C0' : '10px solid white',
            margin: '0 auto',
            filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2))',
            transition: 'border-color 0.3s ease',
          }}
        />
        
        {/* Connecting line */}
        <div
          style={{
            width: '2px',
            height: '25px',
            background: isSelected 
              ? 'linear-gradient(to bottom, #2279C0, transparent)'
              : 'linear-gradient(to bottom, rgba(255,255,255,0.9), transparent)',
            margin: '0 auto',
          }}
        />
      </div>
    </Html>
  );
}

// Portfolio Cards - Always visible on map
function PortfolioCards() {
  const { selectedPath, setSelectedPath, selectedCategory, setSelectedCategory } = usePaths();
  const portfolioData = pathData.portfolio || [];

  const handleCardClick = (pathName) => {
    // Set category to portfolio and select the path - this triggers PathCard
    setSelectedCategory("portfolio");
    setSelectedPath(pathName);
  };

  return (
    <>
      {portfolioData.map((path, index) => (
        <PortfolioLocationCard
          key={path.name || index}
          path={path}
          index={index}
          isSelected={selectedCategory === "portfolio" && selectedPath === path.name}
          onClick={() => handleCardClick(path.name)}
        />
      ))}
    </>
  );
}

export default function AllPaths() {
  const { selectedPath, selectedCategory } = usePaths();

  // Safety check
  const selected = Array.isArray(pathData[selectedCategory]) ? pathData[selectedCategory] : [];
  
  // Don't render path animations for portfolio
  const shouldRenderPaths = selectedCategory && selectedCategory !== "portfolio";
  
  const filteredPath = selectedPath 
    ? selected.filter((item) => selectedPath === item.name) 
    : selected;

  const pathDuration = 4;
  const isCategoryActive = selected.length > 0;

  return (
    <>
      {/* Portfolio cards are ALWAYS visible on the map */}
      <PortfolioCards />

      {/* Path animations for non-portfolio categories */}
      {shouldRenderPaths && filteredPath.map((path, i) => {
        const lastPoint = path.points[path.points.length - 1];
        const endPosition = Array.isArray(lastPoint)
          ? lastPoint
          : [lastPoint.x, lastPoint.y, lastPoint.z];

        const isActive = selectedPath 
          ? selectedPath === path.name 
          : isCategoryActive;

        return (
          <group key={path.name || i}>
            <AnimatedPath
              name={path.name}
              points={path.points}
              color="#2279C0"
              duration={pathDuration}
              glowIntensity={3.0}
              pulseSpeed={3.0}
              tubeRadius={5}
              packetSpeed={1}
              packetCount={3}
              packetWidth={0.15}
            />

            {lastPoint && (
              <PathMarker
                position={endPosition}
                duration={pathDuration}
                isActive={isActive}
              />
            )}
          </group>
        );
      })}
    </>
  );
}