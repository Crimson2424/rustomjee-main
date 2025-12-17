// FloorComparisonPanel.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

// Unit Plan SVG Configuration for each floor type
// Each entry contains the SVG paths and their corresponding balcony view points
const UNIT_PLAN_SVG_CONFIG = {
  // For 1st floor - 4 SVG regions
  "1st": {
    totalPoints: 4,
    regions: [
      {
        id: "1st_floor_1st",
        point: 1,
        viewBox: "0 0 55.473228 49.194225",
        transform: "translate(-221.17132,-9.9018209)",
        path: "m 276.60621,9.9171724 -37.04355,-0.015351 -0.69083,0.2763296 -0.55266,0.429847 -0.4759,0.506605 -0.16887,0.291681 -0.19957,0.521956 -0.0768,0.583364 0.0307,15.581933 -1.96502,0.245629 -1.10532,0.184219 -1.79614,0.598715 -1.70403,0.782934 -0.99786,0.521956 -0.76758,0.491255 -0.98251,0.660119 -0.79829,0.62942 -0.87504,0.813636 -0.56801,0.568013 -0.81364,0.936451 -0.56801,0.721529 -0.53731,0.875043 -0.59872,0.967155 -0.52195,1.089967 -0.49125,1.136023 -0.4145,1.013211 -0.32238,1.105318 -0.42985,1.949662 v 3.208496 l 7.66843,-0.01236 -0.0543,12.516117 46.40625,-0.03256 -0.0593,-26.019037 1.51215,-0.0077 V 9.9094998 Z",
        // Position will be adjusted by user - these are initial estimates
        position: { top: "8.0%", left: "77.6%", width: "13.28%" }
      },
      {
        id: "1st_floor_2nd",
        point: 2,
        viewBox: "0 0 38.279106 48.732872",
        transform: "translate(-182.65401,-54.316146)",
        path: "m 220.88289,54.319736 h -17.78092 l -20.37116,34.812003 -0.0768,0.107461 0.23028,0.153517 0.0307,0.107463 -0.004,13.54883 38.01514,-0.0108 0.007,-48.72207 z",
        position: { top: "20.3%", left: "68.5%", width: "9.2%" }
      },
      {
        id: "1st_floor_3rd",
        point: 3,
        viewBox: "0 0 41.011173 34.27026",
        transform: "translate(-150.30196,-147.40362)",
        path: "m 191.3023,147.66414 -41.00033,-0.26052 0.0368,33.66921 0.22369,0.004 v -1.83454 h 9.44408 l 0.0326,2.33389 v 0.0543 l 31.27401,0.0434 z",
        position: { top: "48.4%", left: "60.7%", width: "9.9%" }
      },
      {
        id: "1st_floor_4th",
        point: 4,
        viewBox: "0 0 42.778641 34.053108",
        transform: "translate(-117.95329,-205.57684)",
        path: "m 125.18289,205.59868 h -7.2296 l 0.0109,34.03125 42.76774,-0.006 -0.009,-34.0471 z",
        position: { top: "66%", left: "53%", width: "10.3%" }
      }
    ]
  },
  // For 2nd and 9th floors - 2 SVG regions
  "2nd-9th": {
    totalPoints: 2,
    regions: [
      {
        id: "2nd_9th_floor_1st",
        point: 1,
        viewBox: "0 0 110.47819 30.530424",
        transform: "translate(-101.0753,-19.669739)",
        path: "m 195.87237,19.669737 -79.07694,0.04179 -1.25884,0.153516 -2.17993,0.521957 -1.8729,0.644769 -1.10532,0.521957 -1.16673,0.675473 -0.64477,0.46055 -0.9518,0.675473 -0.76759,0.706176 -0.67547,0.64477 -1.01321,1.074616 -0.64477,0.798285 -0.79828,1.105321 -0.67548,1.19743 -0.52195,1.166725 -0.39915,0.997858 -0.41449,1.289539 -0.23027,0.951804 -0.12282,0.82899 -0.0921,0.491252 -0.10746,0.675473 -0.0768,2.425563 7.40131,-0.04041 -0.0597,12.521546 95.77056,-0.0163 V 37.66775 l 7.34303,0.01289 0.023,-2.325777 -0.18422,-1.281864 -0.22361,-1.23584 -0.52105,-1.628288 -0.83586,-2.073357 -0.53191,-0.922697 -0.74901,-1.161513 -1.09638,-1.378618 -1.28092,-1.346052 -1.2375,-1.096382 -1.5143,-1.031762 -2.25669,-1.212781 -2.71724,-0.890397 -1.71939,-0.322385 z",
        position: { top: "13.76%", left: "49.2%", width: "23.8%" }
      },
      {
        id: "2nd_9th_floor_2nd",
        point: 2,
        viewBox: "0 0 37.892307 48.012825",
        transform: "translate(-63.202785,-40.04507)",
        path: "M 100.97566,40.055921 H 83.194736 L 63.202785,74.179223 64.35,74.803618 v 13.254276 l 36.69079,-0.08684 0.0543,-47.925987 z",
        position: { top: "20%", left: "41.32%", width: "7.9%" }
      }
    ]
  },
  // For 16th floor - 2 SVG regions
  "16th": {
    totalPoints: 2,
    regions: [
      {
        id: "16th_floor_1st",
        point: 1,
        viewBox: "0 0 110.47819 30.530424",
        transform: "translate(-101.0753,-19.669739)",
        path: "m 195.87237,19.669737 -79.07694,0.04179 -1.25884,0.153516 -2.17993,0.521957 -1.8729,0.644769 -1.10532,0.521957 -1.16673,0.675473 -0.64477,0.46055 -0.9518,0.675473 -0.76759,0.706176 -0.67547,0.64477 -1.01321,1.074616 -0.64477,0.798285 -0.79828,1.105321 -0.67548,1.19743 -0.52195,1.166725 -0.39915,0.997858 -0.41449,1.289539 -0.23027,0.951804 -0.12282,0.82899 -0.0921,0.491252 -0.10746,0.675473 -0.0768,2.425563 7.40131,-0.04041 -0.0597,12.521546 95.77056,-0.0163 V 37.66775 l 7.34303,0.01289 0.023,-2.325777 -0.18422,-1.281864 -0.22361,-1.23584 -0.52105,-1.628288 -0.83586,-2.073357 -0.53191,-0.922697 -0.74901,-1.161513 -1.09638,-1.378618 -1.28092,-1.346052 -1.2375,-1.096382 -1.5143,-1.031762 -2.25669,-1.212781 -2.71724,-0.890397 -1.71939,-0.322385 z",
        position: { top: "14%", left: "53.8%", width: "20.5%" }
      },
      {
        id: "16th_floor_2nd",
        point: 2,
        viewBox: "0 0 37.892307 48.012825",
        transform: "translate(-63.202785,-40.04507)",
        path: "M 100.97566,40.055921 H 83.194736 L 63.202785,74.179223 64.35,74.803618 v 13.254276 l 36.69079,-0.08684 0.0543,-47.925987 z",
        position: { top: "20%", left: "46.79%", width: "7%" }
      }
    ]
  },
  // For multiple floors (3-8, 10-15, 17) - 4 SVG regions
  "multiple": {
    totalPoints: 4,
    regions: [
      {
        id: "multiple_floor_1st",
        point: 1,
        viewBox: "0 0 55.515442 31.198036",
        transform: "translate(-221.03321,-32.04474)",
        path: "m 276.33157,32.131579 -39.25262,-0.08684 -3.36527,0.715706 -3.74581,1.627275 -3.07033,2.241344 -1.8422,1.934308 -0.85969,1.136023 -1.04392,1.719386 -0.79828,1.688682 -0.58337,1.596573 -0.30703,1.228132 -0.18422,0.951804 -0.15352,1.19743 -0.0921,0.767583 v 1.750089 0.122814 h 7.69119 l -0.0366,12.499166 47.86086,0.02172 -0.0109,-31.105758 z",
        position: { top: "13.7%", left: "77.62%", width: "13.27%" }
      },
      {
        id: "multiple_floor_2nd",
        point: 2,
        viewBox: "0 0 38.279106 48.732872",
        transform: "translate(-182.65401,-54.316146)",
        path: "m 220.88289,54.319736 h -17.78092 l -20.37116,34.812003 -0.0768,0.107461 0.23028,0.153517 0.0307,0.107463 -0.004,13.54883 38.01514,-0.0108 0.007,-48.72207 z",
        position: { top: "20.8%", left: "68.5%", width: "9.1%" }
      },
      {
        id: "multiple_floor_3rd",
        point: 3,
        viewBox: "0 0 41.011173 34.27026",
        transform: "translate(-150.30196,-147.40362)",
        path: "m 191.3023,147.66414 -41.00033,-0.26052 0.0368,33.66921 0.22369,0.004 v -1.83454 h 9.44408 l 0.0326,2.33389 v 0.0543 l 31.27401,0.0434 z",
        position: { top: "49.7%", left: "60.8%", width: "9.8%" }
      },
      {
        id: "multiple_floor_4th",
        point: 4,
        viewBox: "0 0 42.778641 34.053108",
        transform: "translate(-117.95329,-205.57684)",
        path: "m 125.18289,205.59868 h -7.2296 l 0.0109,34.03125 42.76774,-0.006 -0.009,-34.0471 z",
        position: { top: "67.72%", left: "53.02%", width: "10.3%" }
      }
    ]
  }
};
// Single Unit Plan SVG Region Component
function UnitPlanSvgRegion({ 
  region, 
  onRegionClick, 
  isSelected = false,
  selectedPoint = null
}) {
  const pathRef = useRef(null);

  const isThisRegionSelected = selectedPoint === region.point;

  const handleMouseEnter = () => {
    if (pathRef.current && !isThisRegionSelected) {
      gsap.to(pathRef.current, {
        fill: "rgba(76, 175, 80, 0.6)",
        stroke: "#4CAF50",
        strokeWidth: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (pathRef.current && !isThisRegionSelected) {
      gsap.to(pathRef.current, {
        fill: "rgba(76, 175, 80, 0.3)",
        stroke: "rgba(76, 175, 80, 0.5)",
        strokeWidth: 0.5,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    
    // Click pulse animation
    if (pathRef.current) {
      gsap.to(pathRef.current, {
        scale: 1.05,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        transformOrigin: "center center"
      });
    }
    
    onRegionClick?.(region.point);
  };

  // Update colors when selection changes
  useEffect(() => {
    if (pathRef.current) {
      gsap.to(pathRef.current, {
        fill: isThisRegionSelected ? "rgba(76, 175, 80, 0.7)" : "rgba(76, 175, 80, 0.3)",
        stroke: isThisRegionSelected ? "#2E7D32" : "rgba(76, 175, 80, 0.5)",
        strokeWidth: isThisRegionSelected ? 1.5 : 0.5,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isThisRegionSelected]);

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        top: region.position.top,
        left: region.position.left,
        width: region.position.width,
        height: 'auto',
        zIndex: 10,
      }}
      viewBox={region.viewBox}
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform={region.transform}>
        <path
          ref={pathRef}
          d={region.path}
          fill={isThisRegionSelected ? "rgba(76, 175, 80, 0.7)" : "rgba(76, 175, 80, 0.3)"}
          stroke={isThisRegionSelected ? "#2E7D32" : "rgba(76, 175, 80, 0.5)"}
          strokeWidth={isThisRegionSelected ? 1.5 : 0.5}
          style={{
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </g>
    </svg>
  );
}

// Unit Plan Overlay Component - renders all SVG regions for a floor type
function UnitPlanOverlay({ 
  floorType = "multiple",
  onRegionClick,
  selectedPoint = null
}) {
  const config = UNIT_PLAN_SVG_CONFIG[floorType] || UNIT_PLAN_SVG_CONFIG["multiple"];

  return (
    <>
      {config.regions.map((region) => (
        <UnitPlanSvgRegion
          key={region.id}
          region={region}
          onRegionClick={onRegionClick}
          selectedPoint={selectedPoint}
        />
      ))}
    </>
  );
}

// Get the total number of balcony points for a floor type
const getTotalBalconyPoints = (floorType) => {
  const config = UNIT_PLAN_SVG_CONFIG[floorType] || UNIT_PLAN_SVG_CONFIG["multiple"];
  return config.totalPoints;
};

// Balcony View Carousel Component
function BalconyViewCarousel({ 
  floorNumber, 
  currentPoint, 
  onPointChange,
  totalPoints = 4 // Now dynamic based on floor type
}) {
  const imageRef = useRef(null);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const dotsRef = useRef([]);

  // Generate the image path based on floor number and current point
  const getBalconyViewImage = (floor, point) => {
    return `/balcony-views/Point ${point}/Floor ${floor}.webp`;
  };

  // Animate image on point change
  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(imageRef.current, 
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [currentPoint]);

  const handlePrevPoint = (e) => {
    e.stopPropagation();
    
    // Button press animation
    if (prevButtonRef.current) {
      gsap.to(prevButtonRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
    
    const newPoint = currentPoint === 1 ? totalPoints : currentPoint - 1;
    onPointChange(newPoint);
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  const handleNextPoint = (e) => {
    e.stopPropagation();
    
    // Button press animation
    if (nextButtonRef.current) {
      gsap.to(nextButtonRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
    
    const newPoint = currentPoint === totalPoints ? 1 : currentPoint + 1;
    onPointChange(newPoint);
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  const handleDotClick = (point) => {
    // Animate the clicked dot
    const dotIndex = point - 1;
    if (dotsRef.current[dotIndex]) {
      gsap.to(dotsRef.current[dotIndex], {
        scale: 1.3,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
    
    onPointChange(point);
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  // Animate dots when currentPoint changes
  useEffect(() => {
    dotsRef.current.forEach((dot, index) => {
      if (dot) {
        const isActive = index === currentPoint - 1;
        gsap.to(dot, {
          width: isActive ? 24 : 6,
          backgroundColor: isActive ? '#C19A40' : 'rgba(193, 154, 64, 0.3)',
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  }, [currentPoint]);

  return (
    <div className="relative w-full h-full">
      {/* Balcony View Image - No zoom */}
      <div
        ref={imageRef}
        className="relative inline-block w-full h-full"
      >
        <img
          src={getBalconyViewImage(floorNumber, currentPoint)}
          alt={`Floor ${floorNumber} Balcony View - Point ${currentPoint}`}
          className="block select-none w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Left Arrow - Minimal */}
      <button
        ref={prevButtonRef}
        onClick={handlePrevPoint}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 bg-[#FFFBF5]/80 hover:bg-[#FFFBF5] border border-[#C19A40]/30 rounded-full flex items-center justify-center cursor-pointer group"
        title="Previous viewpoint"
      >
        <svg 
          className="w-4 h-4 text-[#C19A40] group-hover:text-[#A37F2D]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Arrow - Minimal */}
      <button
        ref={nextButtonRef}
        onClick={handleNextPoint}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 bg-[#FFFBF5]/80 hover:bg-[#FFFBF5] border border-[#C19A40]/30 rounded-full flex items-center justify-center cursor-pointer group"
        title="Next viewpoint"
      >
        <svg 
          className="w-4 h-4 text-[#C19A40] group-hover:text-[#A37F2D]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Point Indicator - Minimal line style */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
        {Array.from({ length: totalPoints }, (_, i) => i + 1).map((point, index) => (
          <button
            key={point}
            ref={el => dotsRef.current[index] = el}
            onClick={() => handleDotClick(point)}
            className="h-1 rounded-full cursor-pointer"
            style={{
              width: currentPoint === point ? 24 : 6,
              backgroundColor: currentPoint === point ? '#C19A40' : 'rgba(193, 154, 64, 0.3)'
            }}
            title={`Point ${point}`}
          />
        ))}
      </div>
    </div>
  );
}

// Thumbnail Component with GSAP animations
function Thumbnail({ imageSrc, onClick, borderColor = '#C19A40', label = 'Floor Plan' }) {
  const thumbnailRef = useRef(null);
  const overlayRef = useRef(null);
  const textRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(thumbnailRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
    gsap.to(overlayRef.current, {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      duration: 0.2
    });
    gsap.to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.2
    });
  };

  const handleMouseLeave = () => {
    gsap.to(thumbnailRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
    gsap.to(overlayRef.current, {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      duration: 0.2
    });
    gsap.to(textRef.current, {
      opacity: 0,
      y: 5,
      duration: 0.2
    });
  };

  const handleClick = () => {
    gsap.to(thumbnailRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: onClick
    });
  };

  return (
    <div 
      className="absolute bottom-4 right-4 z-30 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div 
        ref={thumbnailRef}
        className="relative w-32 h-24 rounded-lg overflow-hidden shadow-lg bg-white"
        style={{ border: `2px solid ${borderColor}` }}
      >
        <img
          src={imageSrc}
          alt={`${label} Thumbnail`}
          className="w-full h-full object-contain p-1"
        />
        {/* Hover overlay */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
        >
          <span 
            ref={textRef}
            className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded"
            style={{ opacity: 0, transform: 'translateY(5px)' }}
          >
            Click to view
          </span>
        </div>
      </div>
      <p className="text-xs text-center mt-1 text-gray-600">{label}</p>
    </div>
  );
}

// Plan Type Toggle Component
function PlanTypeToggle({ isUnitPlan, onToggle, borderColor = '#C19A40' }) {
  const toggleRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (sliderRef.current) {
      gsap.to(sliderRef.current, {
        left: isUnitPlan ? 'calc(100% - 22px)' : '2px',
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isUnitPlan]);

  const handleToggle = () => {
    if (toggleRef.current) {
      gsap.to(toggleRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
    onToggle();
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-medium transition-colors uppercase ${!isUnitPlan ? 'text-gray-800' : 'text-gray-400'}`}>
        Floor Plan
      </span>
      <button
        ref={toggleRef}
        onClick={handleToggle}
        className="relative w-14 h-7 rounded-full cursor-pointer transition-colors"
        style={{ 
          backgroundColor: isUnitPlan ? borderColor : '#E5E7EB',
          border: `2px solid ${isUnitPlan ? borderColor : '#D1D5DB'}`
        }}
        title={isUnitPlan ? "Switch to Floor Plan" : "Switch to Unit Plan"}
      >
        <div
          ref={sliderRef}
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-md"
          style={{ left: isUnitPlan ? 'calc(100% - 22px)' : '2px' }}
        />
      </button>
      <span className={`text-xs font-medium transition-colors uppercase ${isUnitPlan ? 'text-gray-800' : 'text-gray-400'}`}>
        Unit Plan
      </span>
    </div>
  );
}

export default function FloorComparisonPanel({ 
  show, 
  onClose, 
  floors, 
  lockedFloor = null 
}) {
  const [firstFloor, setFirstFloor] = useState(null);
  const [secondFloor, setSecondFloor] = useState(null);
  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [firstFloorZoom, setFirstFloorZoom] = useState(1);
  const [secondFloorZoom, setSecondFloorZoom] = useState(1);
  const [firstFloorPan, setFirstFloorPan] = useState({ x: 0, y: 0 });
  const [secondFloorPan, setSecondFloorPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeDragFloor, setActiveDragFloor] = useState(null);
  
  // View mode state: 'floorplan', 'unitplan', or 'balcony'
  const [firstFloorViewMode, setFirstFloorViewMode] = useState('unitplan');
  const [secondFloorViewMode, setSecondFloorViewMode] = useState('unitplan');
  
  // Balcony carousel point state (1-4 depending on floor type)
  const [firstFloorBalconyPoint, setFirstFloorBalconyPoint] = useState(1);
  const [secondFloorBalconyPoint, setSecondFloorBalconyPoint] = useState(1);
  
  // Selected region point for highlighting
  const [firstFloorSelectedPoint, setFirstFloorSelectedPoint] = useState(null);
  const [secondFloorSelectedPoint, setSecondFloorSelectedPoint] = useState(null);
  
  // Right panel visibility state
  const [isRightPanelHidden, setIsRightPanelHidden] = useState(false);
  
  // Plan type toggle state: false = floor plan, true = unit plan (unit plan is default)
  const [firstFloorIsUnitPlan, setFirstFloorIsUnitPlan] = useState(true);
  const [secondFloorIsUnitPlan, setSecondFloorIsUnitPlan] = useState(true);
  
  const panelRef = useRef(null);
  const overlayRef = useRef(null);
  const svgRef = useRef(null);
  
  // Refs for GSAP animations
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const toggleArrowRef = useRef(null);
  const headerRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const gridRef = useRef(null);

  // Helper function to get floor type for SVG selection
  const getFloorType = (floorNumber) => {
    const floor = parseInt(floorNumber);
    if (floor === 1) return "1st";
    if (floor === 2 || floor === 9) return "2nd-9th";
    if (floor === 16) return "16th";
    return "multiple";
  };

  // Check if we're currently in balcony view mode (either floor)
  const isInBalconyViewMode = useCallback(() => {
    return firstFloorViewMode === 'balcony' || secondFloorViewMode === 'balcony';
  }, [firstFloorViewMode, secondFloorViewMode]);

  // Unit plan region click handlers - opens balcony view at specific point
  const handleFirstFloorRegionClick = (point) => {
    setFirstFloorSelectedPoint(point);
    setFirstFloorBalconyPoint(point);
    setFirstFloorViewMode('balcony');
    // Reset zoom when switching to balcony view
    setFirstFloorZoom(1);
    setFirstFloorPan({ x: 0, y: 0 });
    
    // Also switch second floor to balcony view if it exists
    if (secondFloor) {
      const secondFloorType = getFloorType(secondFloor.info.floorNumber);
      const secondFloorTotalPoints = getTotalBalconyPoints(secondFloorType);
      // Use the same point if available, otherwise use point 1
      const secondPoint = point <= secondFloorTotalPoints ? point : 1;
      setSecondFloorSelectedPoint(secondPoint);
      setSecondFloorBalconyPoint(secondPoint);
      setSecondFloorViewMode('balcony');
      // Reset zoom for second floor too
      setSecondFloorZoom(1);
      setSecondFloorPan({ x: 0, y: 0 });
    }
    
    console.log(`Region clicked - switching to balcony view at Point ${point}`);
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  const handleSecondFloorRegionClick = (point) => {
    setSecondFloorSelectedPoint(point);
    setSecondFloorBalconyPoint(point);
    setSecondFloorViewMode('balcony');
    // Reset zoom when switching to balcony view
    setSecondFloorZoom(1);
    setSecondFloorPan({ x: 0, y: 0 });
    
    // Also switch first floor to balcony view
    const firstFloorType = getFloorType(firstFloor.info.floorNumber);
    const firstFloorTotalPoints = getTotalBalconyPoints(firstFloorType);
    // Use the same point if available, otherwise use point 1
    const firstPoint = point <= firstFloorTotalPoints ? point : 1;
    setFirstFloorSelectedPoint(firstPoint);
    setFirstFloorBalconyPoint(firstPoint);
    setFirstFloorViewMode('balcony');
    // Reset zoom for first floor too
    setFirstFloorZoom(1);
    setFirstFloorPan({ x: 0, y: 0 });
    
    console.log(`Region clicked - switching to balcony view at Point ${point}`);
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  // Thumbnail click handlers - swap back to unit plan view for ALL floors
  const handleFirstFloorThumbnailClick = () => {
    setFirstFloorSelectedPoint(null);
    setFirstFloorViewMode('unitplan');
    setFirstFloorIsUnitPlan(true);
    // Reset zoom when switching back to unit plan
    setFirstFloorZoom(1);
    setFirstFloorPan({ x: 0, y: 0 });
    
    // Also switch second floor back to unit plan view if it exists
    if (secondFloor) {
      setSecondFloorSelectedPoint(null);
      setSecondFloorViewMode('unitplan');
      setSecondFloorIsUnitPlan(true);
      // Reset zoom for second floor too
      setSecondFloorZoom(1);
      setSecondFloorPan({ x: 0, y: 0 });
    }
    
    console.log("Thumbnail clicked - switching all floors back to unit plan");
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  const handleSecondFloorThumbnailClick = () => {
    setSecondFloorSelectedPoint(null);
    setSecondFloorViewMode('unitplan');
    setSecondFloorIsUnitPlan(true);
    // Reset zoom when switching back to unit plan
    setSecondFloorZoom(1);
    setSecondFloorPan({ x: 0, y: 0 });
    
    // Also switch first floor back to unit plan view
    setFirstFloorSelectedPoint(null);
    setFirstFloorViewMode('unitplan');
    setFirstFloorIsUnitPlan(true);
    // Reset zoom for first floor too
    setFirstFloorZoom(1);
    setFirstFloorPan({ x: 0, y: 0 });
    
    console.log("Thumbnail clicked - switching all floors back to unit plan");
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  // Plan type toggle handlers - sync both floors
  const handleFirstFloorPlanToggle = () => {
    const newValue = !firstFloorIsUnitPlan;
    setFirstFloorIsUnitPlan(newValue);
    setFirstFloorViewMode(newValue ? 'unitplan' : 'floorplan');
    // Reset zoom when switching between floor/unit plan
    setFirstFloorZoom(1);
    setFirstFloorPan({ x: 0, y: 0 });
    // Sync second floor if it exists
    if (secondFloor) {
      setSecondFloorIsUnitPlan(newValue);
      setSecondFloorViewMode(newValue ? 'unitplan' : 'floorplan');
      // Reset zoom for second floor too
      setSecondFloorZoom(1);
      setSecondFloorPan({ x: 0, y: 0 });
    }
  };

  const handleSecondFloorPlanToggle = () => {
    const newValue = !secondFloorIsUnitPlan;
    setSecondFloorIsUnitPlan(newValue);
    setSecondFloorViewMode(newValue ? 'unitplan' : 'floorplan');
    // Reset zoom when switching between floor/unit plan
    setSecondFloorZoom(1);
    setSecondFloorPan({ x: 0, y: 0 });
    // Sync first floor
    setFirstFloorIsUnitPlan(newValue);
    setFirstFloorViewMode(newValue ? 'unitplan' : 'floorplan');
    // Reset zoom for first floor too
    setFirstFloorZoom(1);
    setFirstFloorPan({ x: 0, y: 0 });
  };

  // Calculate pan limits based on zoom level
  const getPanLimits = (zoom) => {
    const maxPanPercent = (zoom - 1) / zoom;
    const maxPan = maxPanPercent * 2800;
    return maxPan;
  };

  // Clamp pan values to limits
  const clampPan = (pan, zoom) => {
    const limit = getPanLimits(zoom);
    return {
      x: Math.max(-limit, Math.min(limit, pan.x)),
      y: Math.max(-limit, Math.min(limit, pan.y))
    };
  };

  // Zoom controls - smaller increment (10%)
  const zoomIn = (setZoom) => {
    setZoom(prev => Math.min(prev + 0.1, 5));
  };

  const zoomOut = (setZoom, setPan, currentZoom, currentPan) => {
    const newZoom = Math.max(currentZoom - 0.1, 0.5);
    setZoom(newZoom);
    if (newZoom <= 1) {
      setPan({ x: 0, y: 0 });
    } else {
      const limit = getPanLimits(newZoom);
      setPan({
        x: Math.max(-limit, Math.min(limit, currentPan.x)),
        y: Math.max(-limit, Math.min(limit, currentPan.y))
      });
    }
  };

  const resetZoom = (setZoom, setPan) => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag/Pan handlers
  const handleMouseDown = (e, floorType) => {
    if (floorType === 'first') {
      if (firstFloorZoom > 1) {
        // Enable dragging when zoomed in
        setIsDragging(true);
        setActiveDragFloor(floorType);
        setDragStart({ x: e.clientX, y: e.clientY });
        e.preventDefault();
      }
    } else if (floorType === 'second') {
      if (secondFloorZoom > 1) {
        // Enable dragging when zoomed in
        setIsDragging(true);
        setActiveDragFloor(floorType);
        setDragStart({ x: e.clientX, y: e.clientY });
        e.preventDefault();
      }
    }
  };

  // Click to zoom handler
  const handleImageClick = (e, floorType) => {
    // Only zoom in on click if not dragging and at base zoom or below
    if (!isDragging) {
      if (floorType === 'first' && firstFloorZoom <= 1) {
        setFirstFloorZoom(prev => Math.min(prev + 0.3, 5));
      } else if (floorType === 'second' && secondFloorZoom <= 1) {
        setSecondFloorZoom(prev => Math.min(prev + 0.3, 5));
      }
    }
  };

  // Mouse wheel zoom handler
  const handleWheel = (e, floorType) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
    
    if (floorType === 'first') {
      const newZoom = Math.max(0.5, Math.min(5, firstFloorZoom + zoomDelta));
      setFirstFloorZoom(newZoom);
      if (newZoom <= 1) {
        setFirstFloorPan({ x: 0, y: 0 });
      } else {
        setFirstFloorPan(prev => clampPan(prev, newZoom));
      }
    } else if (floorType === 'second') {
      const newZoom = Math.max(0.5, Math.min(5, secondFloorZoom + zoomDelta));
      setSecondFloorZoom(newZoom);
      if (newZoom <= 1) {
        setSecondFloorPan({ x: 0, y: 0 });
      } else {
        setSecondFloorPan(prev => clampPan(prev, newZoom));
      }
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !activeDragFloor) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    if (activeDragFloor === 'first') {
      setFirstFloorPan(prev => {
        const newPan = { x: prev.x + deltaX, y: prev.y + deltaY };
        return clampPan(newPan, firstFloorZoom);
      });
    } else if (activeDragFloor === 'second') {
      setSecondFloorPan(prev => {
        const newPan = { x: prev.x + deltaX, y: prev.y + deltaY };
        return clampPan(newPan, secondFloorZoom);
      });
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, activeDragFloor, dragStart, firstFloorZoom, secondFloorZoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setActiveDragFloor(null);
  }, []);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Helper function to extract floor number from various data structures
  const extractFloorNumber = (floorData) => {
    if (!floorData) return null;
    return floorData.floor_number || 
           floorData.floorNumber || 
           floorData.info?.floorNumber || 
           floorData.info?.floor_number ||
           null;
  };

  // Get floor plan image based on floor number and plan type
  const getFloorPlanImage = useCallback((floorNumber, isUnitPlan = false) => {
    const floor = parseInt(floorNumber);
    const suffix = isUnitPlan ? '_unit' : '';
    
    if (floor === 1) {
      return `/floors-images/1st${suffix}.png`;
    }

    if (floor === 2 || floor === 9) {
      return `/floors-images/2ND-and-9TH${suffix}.png`;
    }
    
    if (floor === 16) {
      return `/floors-images/16th${suffix}.png`;
    }
    
    if ((floor >= 3 && floor <= 8) || (floor >= 10 && floor <= 15) || floor === 17) {
      return `/floors-images/multiple${suffix}.png`;
    }
    
    return `/floors-images/multiple${suffix}.png`;
  }, []);

  // Helper to check if two floors have different images (can be compared)
  const canCompareFloors = useCallback((floorNumber1, floorNumber2) => {
    if (!floorNumber1 || !floorNumber2) return true;
    return getFloorPlanImage(floorNumber1) !== getFloorPlanImage(floorNumber2);
  }, [getFloorPlanImage]);

  // Check if a floor is selectable (has different image than first floor, or in balcony mode where all floors are selectable)
  const isFloorSelectable = useCallback((floor) => {
    if (!firstFloor) return true;
    
    // In balcony view mode, all floors are selectable since each floor has unique balcony views
    if (isInBalconyViewMode()) return true;
    
    const firstFloorNumber = extractFloorNumber(firstFloor);
    const currentFloorNumber = floor.floor_number;
    return canCompareFloors(firstFloorNumber, currentFloorNumber);
  }, [firstFloor, canCompareFloors, isInBalconyViewMode]);

  // Initialize first floor from lockedFloor prop
  useEffect(() => {
    if (show && lockedFloor) {
      const floorNum = extractFloorNumber(lockedFloor);
      
      const floorWithCorrectNumber = {
        ...lockedFloor,
        info: {
          ...lockedFloor.info,
          floorNumber: floorNum
        }
      };
      setFirstFloor(floorWithCorrectNumber);
      setSecondFloor(null);
      setFirstFloorZoom(1);
      setSecondFloorZoom(1);
      setFirstFloorPan({ x: 0, y: 0 });
      setSecondFloorPan({ x: 0, y: 0 });
      // Reset view modes to unit plan (default)
      setFirstFloorViewMode('unitplan');
      setSecondFloorViewMode('unitplan');
      setFirstFloorBalconyPoint(1);
      setSecondFloorBalconyPoint(1);
      setFirstFloorSelectedPoint(null);
      setSecondFloorSelectedPoint(null);
      // Reset plan type toggles to default (unit plan)
      setFirstFloorIsUnitPlan(true);
      setSecondFloorIsUnitPlan(true);
    } else if (show && !lockedFloor) {
      setFirstFloor(null);
      setSecondFloor(null);
      setFirstFloorZoom(1);
      setSecondFloorZoom(1);
      setFirstFloorPan({ x: 0, y: 0 });
      setSecondFloorPan({ x: 0, y: 0 });
      setFirstFloorViewMode('unitplan');
      setSecondFloorViewMode('unitplan');
      setFirstFloorBalconyPoint(1);
      setSecondFloorBalconyPoint(1);
      setFirstFloorSelectedPoint(null);
      setSecondFloorSelectedPoint(null);
      setFirstFloorIsUnitPlan(true);
      setSecondFloorIsUnitPlan(true);
    }
  }, [show, lockedFloor]);

  // Entrance animation
  useEffect(() => {
    if (show && panelRef.current && overlayRef.current) {
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(panelRef.current, { x: '100%' });

      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(panelRef.current, {
        x: '0%',
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.15");
    }
  }, [show]);

  // GSAP animation for toggling right panel
  useEffect(() => {
    if (!leftPanelRef.current || !rightPanelRef.current || !toggleButtonRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" }
    });

    if (isRightPanelHidden) {
      // Hide right panel - expand left panel
      tl.to(leftPanelRef.current, {
        width: '100%',
        duration: 0.5,
      }, 0)
      .to(rightPanelRef.current, {
        width: '0%',
        opacity: 0,
        padding: 0,
        duration: 0.5,
      }, 0)
      .to(toggleButtonRef.current, {
        right: '8px',
        duration: 0.5,
      }, 0)
      .to(toggleArrowRef.current, {
        rotation: 180,
        duration: 0.4,
        ease: "back.out(1.7)"
      }, 0.1)
      .to(contentWrapperRef.current, {
        padding: '16px',
        duration: 0.4,
      }, 0)
      .to(headerRef.current, {
        fontSize: '1.5rem',
        duration: 0.4,
      }, 0)
      .to(gridRef.current, {
        gap: '16px',
        duration: 0.4,
      }, 0);
    } else {
      // Show right panel - shrink left panel
      tl.to(leftPanelRef.current, {
        width: '66.666%',
        duration: 0.5,
      }, 0)
      .to(rightPanelRef.current, {
        width: '33.333%',
        opacity: 1,
        padding: '24px',
        duration: 0.5,
      }, 0)
      .to(toggleButtonRef.current, {
        right: 'calc(33.333% - 12px)',
        duration: 0.5,
      }, 0)
      .to(toggleArrowRef.current, {
        rotation: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
      }, 0.1)
      .to(contentWrapperRef.current, {
        padding: '24px',
        duration: 0.4,
      }, 0)
      .to(headerRef.current, {
        fontSize: '1.875rem',
        duration: 0.4,
      }, 0)
      .to(gridRef.current, {
        gap: '24px',
        duration: 0.4,
      }, 0);
    }
  }, [isRightPanelHidden]);

  const getClassColor = useCallback((floor) => {
    const classColors = {
      'cls-1': 'rgba(29, 41, 56, 0.60)',
      'cls-2': 'rgba(29, 41, 56, 0.60)',
      'cls-3': 'rgba(29, 41, 56, 0.60)',
      'cls-4': '#f3ea0b',
      'cls-5': '#f7ec13',
      'cls-6': '#f4ea11',
      'cls-7': 'rgba(181, 209, 141, 0.60)',
      'cls-8': '#3b4b9f',
      'cls-9': 'rgba(204, 256, 252, 0.60)',
    };
    return classColors[floor.class] || '#d0aa2d';
  }, []);

  const handleFloorToggle = useCallback((floor) => {
    if (firstFloor && floor.path_id === firstFloor.id) {
      return;
    }

    if (!isFloorSelectable(floor)) {
      return;
    }

    const floorNum = floor.floor_number;
    
    const floorData = {
      id: floor.path_id,
      d: floor.d,
      info: {
        bhk: floor.bhk || 'Duplex',
        floorNumber: floorNum,
        price: floor.price || 'XX Cr',
        area: floor.area || 'XXXX sq.ft',
        availability: floor.availability !== false
      }
    };

    // Check if we're currently in balcony view mode
    const currentlyInBalconyMode = isInBalconyViewMode();

    if (secondFloor && secondFloor.id === floor.path_id) {
      // Deselecting the second floor
      setSecondFloor(null);
      setSecondFloorZoom(1);
      setSecondFloorPan({ x: 0, y: 0 });
      setSecondFloorViewMode('unitplan');
      setSecondFloorBalconyPoint(1);
      setSecondFloorSelectedPoint(null);
      setSecondFloorIsUnitPlan(true);
    } else {
      // Selecting a new second floor - reset zoom for both floors
      setSecondFloor(floorData);
      setSecondFloorZoom(1);
      setSecondFloorPan({ x: 0, y: 0 });
      // Also reset first floor zoom when comparing
      setFirstFloorZoom(1);
      setFirstFloorPan({ x: 0, y: 0 });
      
      // If currently in balcony view mode, keep the new floor in balcony view
      if (currentlyInBalconyMode) {
        const newFloorType = getFloorType(floorNum);
        const newFloorTotalPoints = getTotalBalconyPoints(newFloorType);
        // Use the same point if available, otherwise use point 1
        const newPoint = firstFloorBalconyPoint <= newFloorTotalPoints ? firstFloorBalconyPoint : 1;
        setSecondFloorViewMode('balcony');
        setSecondFloorBalconyPoint(newPoint);
        setSecondFloorSelectedPoint(newPoint);
      } else {
        setSecondFloorViewMode('unitplan');
        setSecondFloorBalconyPoint(1);
        setSecondFloorSelectedPoint(null);
      }
      // Sync plan type with first floor
      setSecondFloorIsUnitPlan(firstFloorIsUnitPlan);
    }
    
    if ('vibrate' in navigator) navigator.vibrate(30);
  }, [firstFloor, secondFloor, isFloorSelectable, isInBalconyViewMode, firstFloorIsUnitPlan, firstFloorBalconyPoint]);

  const getFloorFillColor = useCallback((floor) => {
    const isSecondFloor = secondFloor && secondFloor.id === floor.path_id;
    const isHovered = hoveredFloor === floor.path_id;
    const isFirstFloor = firstFloor && firstFloor.id === floor.path_id;
    const selectable = isFloorSelectable(floor);
    const inBalconyMode = isInBalconyViewMode();

    if (isFirstFloor) {
      return "rgba(193, 154, 64, 0.8)";
    }

    if (isSecondFloor) {
      return "rgba(29, 41, 56, 0.8)";
    }

    if (firstFloor && !selectable) {
      return "rgba(0, 0, 0, 0.05)";
    }

    if (isHovered && selectable) {
      // Use a different hover color in balcony mode to indicate balcony selection
      return inBalconyMode ? "rgba(76, 175, 80, 0.7)" : "rgba(59, 130, 246, 0.7)";
    }

    if (firstFloor && selectable) {
      // Use a different highlight color in balcony mode
      return inBalconyMode ? "rgba(76, 175, 80, 0.3)" : "rgba(59, 130, 246, 0.3)";
    }

    return getClassColor(floor);
  }, [firstFloor, secondFloor, hoveredFloor, getClassColor, isFloorSelectable, isInBalconyViewMode]);

  const getFloorOpacity = useCallback((floor) => {
    const isSecondFloor = secondFloor && secondFloor.id === floor.path_id;
    const isHovered = hoveredFloor === floor.path_id;
    const isFirstFloor = firstFloor && firstFloor.id === floor.path_id;
    const selectable = isFloorSelectable(floor);
    
    if (isFirstFloor || isSecondFloor) {
      return 1;
    }
    
    if (isHovered && selectable) {
      return 1;
    }
    
    if (firstFloor && !selectable) {
      return 0.3;
    }
    
    // In balcony mode, all selectable floors should be more visible
    if (isInBalconyViewMode() && selectable) {
      return 0.9;
    }
    
    return 0.85;
  }, [firstFloor, secondFloor, hoveredFloor, isFloorSelectable, isInBalconyViewMode]);

  // Exit animation
  const handleClose = () => {
    if (panelRef.current && overlayRef.current) {
      const tl = gsap.timeline({
        onComplete: onClose
      });
      
      tl.to(panelRef.current, {
        x: '100%',
        duration: 0.4,
        ease: "power3.in"
      })
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in"
      }, "-=0.2");
    } else {
      onClose();
    }
  };

  if (!show) return null;

  const hasFirstFloor = !!firstFloor;
  const hasSecondFloor = !!secondFloor;
  const hasBothFloors = hasFirstFloor && hasSecondFloor;

  // Get floor types and total points for each floor
  const firstFloorType = hasFirstFloor ? getFloorType(firstFloor.info.floorNumber) : "multiple";
  const secondFloorType = hasSecondFloor ? getFloorType(secondFloor.info.floorNumber) : "multiple";
  const firstFloorTotalPoints = getTotalBalconyPoints(firstFloorType);
  const secondFloorTotalPoints = getTotalBalconyPoints(secondFloorType);

  return createPortal(
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div 
        ref={panelRef}
        className="bg-[#FFFBF5] w-full h-full overflow-hidden flex"
      >
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 z-20 w-10 h-10 flex items-center justify-center bg-[#C7BED6] hover:bg-[#B0A5C5] rounded-full transition-all duration-500 cursor-pointer ${
            isRightPanelHidden ? 'right-4' : 'right-4'
          }`}
        >
          <svg 
            className="w-6 h-6 text-white"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>

        {/* Left Panel - Floor Plan Comparison */}
        <div 
          ref={leftPanelRef}
          className="bg-white uppercase font-futura-medium overflow-y-auto left-panel"
          style={{ width: '66.666%' }}
        >
          <div 
            ref={contentWrapperRef}
            className="h-full flex flex-col"
            style={{ padding: '24px' }}
          >
            
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div className="flex items-center gap-6">
                <h3 
                  ref={headerRef}
                  className="font-bold text-[#000000]"
                  style={{ fontSize: '1.875rem' }}
                >
                  {hasBothFloors ? (
                    <>Comparing Floor {firstFloor?.info.floorNumber} to {secondFloor?.info.floorNumber}</>
                  ) : hasFirstFloor ? (
                    <>Floor {firstFloor?.info.floorNumber}</>
                  ) : (
                    <>Floor Plan Comparison</>
                  )}
                </h3>
                {/* Plan Type Toggle - in header, only show when not in balcony view */}
                {hasFirstFloor && firstFloorViewMode !== 'balcony' && (
                  <PlanTypeToggle
                    isUnitPlan={firstFloorIsUnitPlan}
                    onToggle={handleFirstFloorPlanToggle}
                    borderColor="#C19A40"
                  />
                )}
              </div>
              {/* Balcony view indicator */}
              {(firstFloorViewMode === 'balcony' || secondFloorViewMode === 'balcony') && (
                <p className="text-sm text-green-600 normal-case">
                  {firstFloorViewMode === 'balcony' && secondFloorViewMode === 'balcony' 
                    ? "Viewing balconies for both floors"
                    : firstFloorViewMode === 'balcony' 
                      ? "Viewing balcony for first floor"
                      : "Viewing balcony for second floor"
                  }
                  <span className="text-gray-500 ml-2">• Click thumbnail to switch back</span>
                </p>
              )}
            </div>

            <div className="flex-1 min-h-0">
              {hasFirstFloor ? (
                <div 
                  ref={gridRef}
                  className={`grid h-full ${hasBothFloors ? 'grid-cols-2' : 'grid-cols-1'}`}
                  style={{ gap: '24px' }}
                >
                  {/* First Floor */}
                  <div className="bg-white rounded-lg shadow-sm relative overflow-hidden flex flex-col border-2" style={{ borderColor: '#C19A40' }}>
                    {/* Zoom Controls - Hide in balcony view */}
                    {firstFloorViewMode !== 'balcony' && (
                      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                        <button
                          onClick={() => zoomIn(setFirstFloorZoom)}
                          className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                          title="Zoom In"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => zoomOut(setFirstFloorZoom, setFirstFloorPan, firstFloorZoom, firstFloorPan)}
                          className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                          title="Zoom Out"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => resetZoom(setFirstFloorZoom, setFirstFloorPan)}
                          className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                          title="Reset Zoom"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                    )}
                    {/* Zoom indicator - Hide in balcony view */}
                    {firstFloorViewMode !== 'balcony' && (
                      <div className="absolute bottom-3 left-3 z-20 bg-white/80 px-2 py-1 rounded text-xs text-gray-600">
                        {Math.round(firstFloorZoom * 100)}%
                      </div>
                    )}
                    {/* View mode indicator */}
                    <div className="absolute top-3 left-3 z-20 bg-[#C19A40] text-white px-2 py-1 rounded text-xs">
                      {firstFloorViewMode === 'balcony' 
                        ? `Balcony View - Point ${firstFloorBalconyPoint}` 
                        : (firstFloorIsUnitPlan ? 'Unit Plan' : 'Floor Plan')}
                    </div>
                    
                    {/* Main Content Area with Thumbnail */}
                    <div className="relative bg-white flex-1 min-h-0 flex flex-col">
                      {/* Main View Area */}
                      <div 
                        className="relative flex-1 min-h-0 overflow-hidden"
                        onMouseDown={(e) => firstFloorViewMode !== 'balcony' && handleMouseDown(e, 'first')}
                        onWheel={(e) => firstFloorViewMode !== 'balcony' && handleWheel(e, 'first')}
                        onClick={(e) => firstFloorViewMode !== 'balcony' && handleImageClick(e, 'first')}
                        style={{ cursor: firstFloorViewMode === 'balcony' ? 'default' : (firstFloorZoom > 1 ? (isDragging && activeDragFloor === 'first' ? 'grabbing' : 'grab') : 'zoom-in') }}
                      >
                        <div 
                          className="w-full h-full flex items-center justify-center p-2"
                          style={{ minHeight: '100%' }}
                        >
                          {/* Show Floor Plan, Unit Plan, or Balcony Carousel based on view mode */}
                          {firstFloorViewMode === 'balcony' ? (
                            <BalconyViewCarousel
                              floorNumber={firstFloor.info.floorNumber}
                              currentPoint={firstFloorBalconyPoint}
                              onPointChange={(point) => {
                                setFirstFloorBalconyPoint(point);
                                setFirstFloorSelectedPoint(point);
                              }}
                              totalPoints={firstFloorTotalPoints}
                            />
                          ) : (
                            <div
                              className="relative"
                              style={{ 
                                transform: `scale(${firstFloorZoom}) translate(${firstFloorPan.x / firstFloorZoom}px, ${firstFloorPan.y / firstFloorZoom}px)`,
                                transformOrigin: 'center center',
                                display: 'inline-block',
                                lineHeight: 0,
                              }}
                            >
                              <img
                                src={getFloorPlanImage(firstFloor.info.floorNumber, firstFloorIsUnitPlan)}
                                alt={`Floor ${firstFloor.info.floorNumber} ${firstFloorIsUnitPlan ? 'Unit' : 'Floor'} Plan`}
                                className="block select-none"
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: 'calc(100vh - 200px)',
                                  width: 'auto',
                                  height: 'auto',
                                  objectFit: 'contain',
                                }}
                                draggable={false}
                              />
                              {/* Unit Plan Overlay - only show on unit plan view */}
                              {firstFloorIsUnitPlan && (
                                <UnitPlanOverlay
                                  floorType={firstFloorType}
                                  onRegionClick={handleFirstFloorRegionClick}
                                  selectedPoint={firstFloorSelectedPoint}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Thumbnail Area - Bottom Right */}
                      {firstFloorViewMode === 'balcony' && (
                        <Thumbnail
                          imageSrc={getFloorPlanImage(firstFloor.info.floorNumber, true)}
                          onClick={handleFirstFloorThumbnailClick}
                          borderColor="#C19A40"
                          label="Unit Plan"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Second Floor (if selected) */}
                  {hasSecondFloor && (
                    <div className="bg-white rounded-lg shadow-sm relative overflow-hidden flex flex-col border-2" style={{ borderColor: '#BDD1B1' }}>
                      {/* Zoom Controls - Hide in balcony view */}
                      {secondFloorViewMode !== 'balcony' && (
                        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                          <button
                            onClick={() => zoomIn(setSecondFloorZoom)}
                            className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                            title="Zoom In"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => zoomOut(setSecondFloorZoom, setSecondFloorPan, secondFloorZoom, secondFloorPan)}
                            className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                            title="Zoom Out"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => resetZoom(setSecondFloorZoom, setSecondFloorPan)}
                            className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                            title="Reset Zoom"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        </div>
                      )}
                      {/* Zoom indicator - Hide in balcony view */}
                      {secondFloorViewMode !== 'balcony' && (
                        <div className="absolute bottom-3 left-3 z-20 bg-white/80 px-2 py-1 rounded text-xs text-gray-600">
                          {Math.round(secondFloorZoom * 100)}%
                        </div>
                      )}
                      {/* View mode indicator */}
                      <div className="absolute top-3 left-3 z-20 bg-[#BDD1B1] text-gray-800 px-2 py-1 rounded text-xs">
                        {secondFloorViewMode === 'balcony' 
                          ? `Balcony View - Point ${secondFloorBalconyPoint}` 
                          : (secondFloorIsUnitPlan ? 'Unit Plan' : 'Floor Plan')}
                      </div>
                      
                      {/* Main Content Area with Thumbnail */}
                      <div className="relative bg-white flex-1 min-h-0 flex flex-col">
                        {/* Main View Area */}
                        <div 
                          className="relative flex-1 min-h-0 overflow-hidden"
                          onMouseDown={(e) => secondFloorViewMode !== 'balcony' && handleMouseDown(e, 'second')}
                          onWheel={(e) => secondFloorViewMode !== 'balcony' && handleWheel(e, 'second')}
                          onClick={(e) => secondFloorViewMode !== 'balcony' && handleImageClick(e, 'second')}
                          style={{ cursor: secondFloorViewMode === 'balcony' ? 'default' : (secondFloorZoom > 1 ? (isDragging && activeDragFloor === 'second' ? 'grabbing' : 'grab') : 'zoom-in') }}
                        >
                          <div 
                            className="w-full h-full flex items-center justify-center p-2"
                            style={{ minHeight: '100%' }}
                          >
                            {/* Show Floor Plan, Unit Plan, or Balcony Carousel based on view mode */}
                            {secondFloorViewMode === 'balcony' ? (
                              <BalconyViewCarousel
                                floorNumber={secondFloor.info.floorNumber}
                                currentPoint={secondFloorBalconyPoint}
                                onPointChange={(point) => {
                                  setSecondFloorBalconyPoint(point);
                                  setSecondFloorSelectedPoint(point);
                                }}
                                totalPoints={secondFloorTotalPoints}
                              />
                            ) : (
                              <div
                                className="relative"
                                style={{ 
                                  transform: `scale(${secondFloorZoom}) translate(${secondFloorPan.x / secondFloorZoom}px, ${secondFloorPan.y / secondFloorZoom}px)`,
                                  transformOrigin: 'center center',
                                  display: 'inline-block',
                                  lineHeight: 0,
                                }}
                              >
                                <img
                                  src={getFloorPlanImage(secondFloor.info.floorNumber, secondFloorIsUnitPlan)}
                                  alt={`Floor ${secondFloor.info.floorNumber} ${secondFloorIsUnitPlan ? 'Unit' : 'Floor'} Plan`}
                                  className="block select-none"
                                  style={{
                                    maxWidth: '100%',
                                    maxHeight: 'calc(100vh - 200px)',
                                    width: 'auto',
                                    height: 'auto',
                                    objectFit: 'contain',
                                  }}
                                  draggable={false}
                                />
                                {/* Unit Plan Overlay - only show on unit plan view */}
                                {secondFloorIsUnitPlan && (
                                  <UnitPlanOverlay
                                    floorType={secondFloorType}
                                    onRegionClick={handleSecondFloorRegionClick}
                                    selectedPoint={secondFloorSelectedPoint}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Thumbnail Area - Bottom Right */}
                        {secondFloorViewMode === 'balcony' && (
                          <Thumbnail
                            imageSrc={getFloorPlanImage(secondFloor.info.floorNumber, true)}
                            onClick={handleSecondFloorThumbnailClick}
                            borderColor="#BDD1B1"
                            label="Unit Plan"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center bg-[#E8F4FE] rounded-lg border-2 border-[#C4E0FD]">
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h4 className="text-xl font-semibold text-[#000000] mb-2">
                      {firstFloor ? 'Select a Floor to Compare' : 'Select Floors from Building'}
                    </h4>
                    <p className="text-[#3F3F41] max-w-md">
                      {firstFloor 
                        ? 'Click on a highlighted floor in the building view to compare different floor plans.'
                        : 'Use the building visualization to select floors for comparison.'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toggle Button for Right Panel */}
        <button
          ref={toggleButtonRef}
          onClick={() => setIsRightPanelHidden(!isRightPanelHidden)}
          className="absolute top-1/2 -translate-y-1/2 z-30 w-6 h-16 bg-[#FFFBF5] hover:bg-[#F5EFE6] border border-[#C19A40]/30 rounded-lg flex items-center justify-center cursor-pointer group shadow-md"
          style={{ right: 'calc(33.333% - 12px)' }}
          title={isRightPanelHidden ? "Show building view" : "Hide building view"}
        >
          <svg 
            ref={toggleArrowRef}
            className="w-4 h-4 text-[#C19A40] group-hover:text-[#A37F2D]"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Right Panel - Building SVG */}
        <div 
          ref={rightPanelRef}
          className="flex flex-col right-panel overflow-hidden"
          style={{ width: '33.333%', padding: '24px', opacity: 1 }}
        >
          {/* Building SVG - Takes up top portion */}
          <div className="h-3/5 flex items-stretch justify-stretch w-full">
            <div className="relative w-full h-full overflow-hidden">
              <svg
                ref={svgRef}
                viewBox="0 0 6826 3840"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid slice"
                style={{ 
                  shapeRendering: 'optimizeSpeed', 
                  pointerEvents: 'auto',
                  objectFit: 'cover'
                }}
              >
                <image
                  href="/images/3.3.1.jpg"
                  x="0"
                  y="0"
                  width="6826"
                  height="3840"
                  preserveAspectRatio="xMidYMid slice"
                />

                <g style={{ transform: 'translate(2050px, -10px) scale(0.85)' }}>
                  {floors.map((floor) => {
                    const isHovered = hoveredFloor === floor.path_id;
                    const isFirstFloorPath = firstFloor && firstFloor.id === floor.path_id;
                    const isSecondFloorPath = secondFloor && secondFloor.id === floor.path_id;
                    const selectable = isFloorSelectable(floor);
                    const canInteract = selectable || isFirstFloorPath;
                    
                    return (
                      <path
                        key={floor.path_id}
                        id={floor.path_id}
                        d={floor.d}
                        fill={getFloorFillColor(floor)}
                        stroke={(isHovered && canInteract) || isSecondFloorPath || isFirstFloorPath ? "#ffffff" : "none"}
                        strokeWidth={(isHovered && canInteract) || isSecondFloorPath || isFirstFloorPath ? "3" : "0"}
                        opacity={getFloorOpacity(floor)}
                        style={{
                          cursor: canInteract ? 'pointer' : 'not-allowed',
                          transition: 'opacity 150ms ease-out, fill 150ms ease-out, stroke 150ms ease-out',
                          filter: (isHovered && canInteract) ? 'brightness(1.1)' : 'none'
                        }}
                        onMouseEnter={() => canInteract && setHoveredFloor(floor.path_id)}
                        onMouseLeave={() => setHoveredFloor(null)}
                        onClick={() => handleFloorToggle(floor)}
                      />
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
          
          {/* Sunset Image - Takes up bottom portion */}
          <div className="h-2/5 mt-4 rounded-lg overflow-hidden shadow-md">
            <img
              src="/images/sunset.jpg"
              alt="Sunset View"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}