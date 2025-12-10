// FloorComparisonPanel.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

// SVG Path data for each floor type
const BALCONY_SVG_CONFIG = {
  // For 1st.png (floor 1) - balcony-svg-4.svg
  "1st": {
    viewBox: "0 0 114.55609 49.218544",
    transform: "translate(-125.05263, 3.7776315)",
    path: "M 125.05263,45.331578 V 31.436841 l 0.17368,-3.299999 1.21579,-3.126316 1.56316,-3.126316 2.2579,-2.605263 2.95263,-2.257894 2.43158,-1.21579 2.43158,-0.868421 2.08421,-0.521053 h 1.0421 V -1.0421053 l 0.0868,-0.868421 0.30395,-0.5210526 0.17369,-0.3907894 0.73815,-0.5210527 0.43421,-0.3039473 0.47764,-0.1302633 81.94263,0.093233 h 0.42985 l 0.30703,0.061407 0.30703,0.1535168 0.46056,0.3223847 0.21492,0.1381649 0.18422,0.2456267 0.18422,0.2149232 0.19957,0.4298465 0.12281,0.3837915 0.0461,0.4144948 0.0614,0.1074616 V 15.35166 l 0.28673,0.06281 1.92391,0.919693 1.71939,1.043913 2.02642,1.535166 0.76746,0.799913 0.95526,1.085526 1.08553,1.389474 1.08552,1.867105 0.43421,0.998684 0.52105,1.519736 0.34737,1.21579 0.34737,1.389475 0.13026,1.432893 0.0434,2.214476 0.0548,12.614597 z"
  },
  // For multiple.png (floors 3-8, 10-15, 17) - balcony-svg-1_path2.svg
  "multiple": {
    viewBox: "0 0 115.07604 30.703321",
    transform: "translate(-107.70725, 40.405571)",
    path: "m 107.70725,-21.860764 0.24562,-3.315959 0.61407,-2.456265 1.35095,-3.193145 1.8422,-2.824707 2.33345,-2.456265 2.8247,-1.965013 3.43877,-1.473758 2.33346,-0.614066 1.59657,-0.122814 82.40771,-0.122815 1.96501,0.368441 2.33346,0.73688 1.96501,0.982506 2.08783,0.982507 1.96501,1.596572 0.9825,1.105318 0.98251,1.228135 1.10532,1.473759 0.73688,1.596572 0.85969,1.842199 0.61407,2.701893 0.36844,1.350946 v 5.526598 l 0.12281,9.2109957 -114.95323,-0.1228132 z"
  },
  // For 2ND-and-9TH.png (floors 2 and 9) - balcony-svg-2.svg
  "2nd-9th": {
    viewBox: "0 0 114.95323 31.317392",
    transform: "translate(48.265617, 76.267051)",
    path: "m -48.142807,-57.845054 0.245628,-3.193148 0.614066,-2.701891 0.859692,-2.087827 1.350947,-2.456264 1.350947,-1.842199 1.842198,-1.842201 2.947519,-1.965013 2.456265,-1.105318 2.947519,-0.982506 1.228132,-0.245626 83.635847,0.122812 1.105318,0.122814 2.210638,0.614066 1.965013,0.73688 1.596573,0.859693 1.842201,1.350946 2.70189,2.824705 1.719387,2.333453 1.473758,3.438771 0.736881,3.561585 v 3.193145 12.035703 l -114.953231,0.122814 z"
  },
  // For 16th.png (floor 16) - balcony-svg-3.svg
  "16th": {
    viewBox: "0 0 114.97894 31.697365",
    transform: "translate(-126.00789, -14.155264)",
    path: "m 126.09473,32.913158 0.17369,-1.997368 0.0868,-1.823686 0.43421,-1.736841 0.69474,-2.171053 1.38947,-2.518421 1.30263,-1.823684 1.99737,-2.257895 2.43158,-1.736842 2.2579,-1.215789 2.51842,-0.868421 3.12631,-0.521053 81.80526,-0.08684 0.95527,0.260526 1.47631,0.08684 2.17106,0.694737 2.43158,1.042105 1.73684,1.128948 1.56316,1.042105 1.21579,1.215789 1.30263,1.389474 1.30263,1.910526 0.86842,1.736843 0.69474,1.823684 0.52105,1.736841 0.34737,2.171055 -0.0868,1.823683 0.17368,13.547367 -114.97895,0.08684 z"
  }
};

// Total number of viewpoints for balcony carousel
const TOTAL_BALCONY_POINTS = 4;

// Balcony Overlay Component
function BalconyOverlay({ 
  onBalconyClick, 
  isSelected = false,
  floorType = "multiple"
}) {
  const pathRef = useRef(null);

  // Get SVG config based on floor type
  const svgConfig = BALCONY_SVG_CONFIG[floorType] || BALCONY_SVG_CONFIG["multiple"];

  // Correct positions for each floor plan image
  const getPositionByFloorType = (type) => {
    const positions = {
      "1st": { top: "9.4%", left: "53.6%", width: "20.4%" },
      "multiple": { top: "14.0%", left: "53.5%", width: "20.5%" },
      "2nd-9th": { top: "13.7%", left: "55.7%", width: "20.5%" },
      "16th": { top: "15.7%", left: "53.7%", width: "19.8%" },
    };
    return positions[type] || positions["multiple"];
  };

  const position = getPositionByFloorType(floorType);

  const handleMouseEnter = () => {
    if (pathRef.current && !isSelected) {
      gsap.to(pathRef.current, {
        fill: "rgba(59, 130, 246, 0.5)",
        stroke: "#3B82F6",
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (pathRef.current && !isSelected) {
      gsap.to(pathRef.current, {
        fill: "rgba(59, 130, 246, 0.1)",
        stroke: "rgba(59, 130, 246, 0.3)",
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
    
    onBalconyClick?.();
  };

  // Update colors when isSelected changes
  useEffect(() => {
    if (pathRef.current) {
      gsap.to(pathRef.current, {
        fill: isSelected ? "rgba(76, 175, 80, 0.5)" : "rgba(59, 130, 246, 0.1)",
        stroke: isSelected ? "#4CAF50" : "rgba(59, 130, 246, 0.3)",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isSelected]);

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        height: 'auto',
        zIndex: 10,
      }}
      viewBox={svgConfig.viewBox}
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform={svgConfig.transform}>
        <path
          ref={pathRef}
          d={svgConfig.path}
          fill={isSelected ? "rgba(76, 175, 80, 0.5)" : "rgba(59, 130, 246, 0.1)"}
          stroke={isSelected ? "#4CAF50" : "rgba(59, 130, 246, 0.3)"}
          strokeWidth="0.5"
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

// Balcony View Carousel Component
function BalconyViewCarousel({ 
  floorNumber, 
  currentPoint, 
  onPointChange,
  zoom,
  pan,
  isDragging 
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
    
    const newPoint = currentPoint === 1 ? TOTAL_BALCONY_POINTS : currentPoint - 1;
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
    
    const newPoint = currentPoint === TOTAL_BALCONY_POINTS ? 1 : currentPoint + 1;
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
      {/* Balcony View Image */}
      <div
        ref={imageRef}
        className="relative inline-block w-full h-full"
        style={{ 
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: 'center center',
        }}
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
        {Array.from({ length: TOTAL_BALCONY_POINTS }, (_, i) => i + 1).map((point, index) => (
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
  
  // Balcony selection state
  const [firstFloorBalconySelected, setFirstFloorBalconySelected] = useState(false);
  const [secondFloorBalconySelected, setSecondFloorBalconySelected] = useState(false);
  
  // View mode state: 'floorplan' or 'balcony' - controls which image is in main view
  const [firstFloorViewMode, setFirstFloorViewMode] = useState('floorplan');
  const [secondFloorViewMode, setSecondFloorViewMode] = useState('floorplan');
  
  // Balcony carousel point state (1-4)
  const [firstFloorBalconyPoint, setFirstFloorBalconyPoint] = useState(1);
  const [secondFloorBalconyPoint, setSecondFloorBalconyPoint] = useState(1);
  
  // Right panel visibility state
  const [isRightPanelHidden, setIsRightPanelHidden] = useState(false);
  
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

  // Helper function to get floor type for balcony SVG selection
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

  // Balcony click handlers - swap ALL floors to balcony view
  const handleFirstFloorBalconyClick = () => {
    setFirstFloorBalconySelected(true);
    setFirstFloorViewMode('balcony');
    setFirstFloorBalconyPoint(1); // Reset to Point 1 when entering balcony view
    
    // Also switch second floor to balcony view if it exists
    if (secondFloor) {
      setSecondFloorBalconySelected(true);
      setSecondFloorViewMode('balcony');
      setSecondFloorBalconyPoint(1);
    }
    
    console.log("Balcony clicked - switching all floors to balcony view");
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  const handleSecondFloorBalconyClick = () => {
    setSecondFloorBalconySelected(true);
    setSecondFloorViewMode('balcony');
    setSecondFloorBalconyPoint(1); // Reset to Point 1 when entering balcony view
    
    // Also switch first floor to balcony view
    setFirstFloorBalconySelected(true);
    setFirstFloorViewMode('balcony');
    setFirstFloorBalconyPoint(1);
    
    console.log("Balcony clicked - switching all floors to balcony view");
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  // Thumbnail click handlers - swap back to floor plan view for ALL floors
  const handleFirstFloorThumbnailClick = () => {
    setFirstFloorBalconySelected(false);
    setFirstFloorViewMode('floorplan');
    
    // Also switch second floor back to floor plan view if it exists
    if (secondFloor) {
      setSecondFloorBalconySelected(false);
      setSecondFloorViewMode('floorplan');
    }
    
    console.log("Thumbnail clicked - switching all floors back to floor plan");
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  const handleSecondFloorThumbnailClick = () => {
    setSecondFloorBalconySelected(false);
    setSecondFloorViewMode('floorplan');
    
    // Also switch first floor back to floor plan view
    setFirstFloorBalconySelected(false);
    setFirstFloorViewMode('floorplan');
    
    console.log("Thumbnail clicked - switching all floors back to floor plan");
    if ('vibrate' in navigator) navigator.vibrate(30);
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
    if ((floorType === 'first' && firstFloorZoom > 1) || (floorType === 'second' && secondFloorZoom > 1)) {
      setIsDragging(true);
      setActiveDragFloor(floorType);
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
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

  // Get floor plan image based on floor number
  const getFloorPlanImage = useCallback((floorNumber) => {
    const floor = parseInt(floorNumber);
    
    if (floor === 1) {
      return '/floors-images/1st.png';
    }

    if (floor === 2 || floor === 9) {
      return '/floors-images/2ND-and-9TH.png';
    }
    
    if (floor === 16) {
      return '/floors-images/16th.png';
    }
    
    if ((floor >= 3 && floor <= 8) || (floor >= 10 && floor <= 15) || floor === 17) {
      return '/floors-images/multiple.png';
    }
    
    return '/floors-images/multiple.png';
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
      // Reset balcony selections and view modes
      setFirstFloorBalconySelected(false);
      setSecondFloorBalconySelected(false);
      setFirstFloorViewMode('floorplan');
      setSecondFloorViewMode('floorplan');
      setFirstFloorBalconyPoint(1);
      setSecondFloorBalconyPoint(1);
    } else if (show && !lockedFloor) {
      setFirstFloor(null);
      setSecondFloor(null);
      setFirstFloorZoom(1);
      setSecondFloorZoom(1);
      setFirstFloorPan({ x: 0, y: 0 });
      setSecondFloorPan({ x: 0, y: 0 });
      setFirstFloorBalconySelected(false);
      setSecondFloorBalconySelected(false);
      setFirstFloorViewMode('floorplan');
      setSecondFloorViewMode('floorplan');
      setFirstFloorBalconyPoint(1);
      setSecondFloorBalconyPoint(1);
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
      setSecondFloorBalconySelected(false);
      setSecondFloorViewMode('floorplan');
      setSecondFloorBalconyPoint(1);
    } else {
      // Selecting a new second floor
      setSecondFloor(floorData);
      setSecondFloorZoom(1);
      setSecondFloorPan({ x: 0, y: 0 });
      
      // If currently in balcony view mode, keep the new floor in balcony view
      if (currentlyInBalconyMode) {
        setSecondFloorBalconySelected(true);
        setSecondFloorViewMode('balcony');
        setSecondFloorBalconyPoint(1); // Start at Point 1 for new floor
      } else {
        setSecondFloorBalconySelected(false);
        setSecondFloorViewMode('floorplan');
        setSecondFloorBalconyPoint(1);
      }
    }
    
    if ('vibrate' in navigator) navigator.vibrate(30);
  }, [firstFloor, secondFloor, isFloorSelectable, isInBalconyViewMode]);

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
              <div>
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
                {/* Balcony view indicator */}
                {(firstFloorViewMode === 'balcony' || secondFloorViewMode === 'balcony') && (
                  <p className="text-sm text-blue-600 mt-1 normal-case">
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
                    {/* Zoom Controls */}
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
                    {/* Zoom indicator */}
                    <div className="absolute bottom-3 left-3 z-20 bg-white/80 px-2 py-1 rounded text-xs text-gray-600">
                      {Math.round(firstFloorZoom * 100)}%
                    </div>
                    {/* View mode indicator */}
                    <div className="absolute top-3 left-3 z-20 bg-[#C19A40] text-white px-2 py-1 rounded text-xs">
                      {firstFloorViewMode === 'balcony' ? `Balcony View` : 'Floor Plan'}
                    </div>
                    
                    {/* Main Content Area with Thumbnail */}
                    <div className="relative bg-white flex-1 min-h-0 flex flex-col">
                      {/* Main View Area */}
                      <div 
                        className="relative flex-1 min-h-0 overflow-hidden"
                        onMouseDown={(e) => handleMouseDown(e, 'first')}
                        onWheel={(e) => handleWheel(e, 'first')}
                        style={{ cursor: firstFloorZoom > 1 ? (isDragging && activeDragFloor === 'first' ? 'grabbing' : 'grab') : 'zoom-in' }}
                      >
                        <div 
                          className="w-full h-full flex items-center justify-center p-2"
                          style={{ minHeight: '100%' }}
                        >
                          {/* Show Floor Plan or Balcony Carousel based on view mode */}
                          {firstFloorViewMode === 'floorplan' ? (
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
                                src={getFloorPlanImage(firstFloor.info.floorNumber)}
                                alt={`Floor ${firstFloor.info.floorNumber} Plan`}
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
                              {/* Balcony Overlay - only show on floor plan view */}
                              <BalconyOverlay
                                onBalconyClick={handleFirstFloorBalconyClick}
                                isSelected={firstFloorBalconySelected}
                                floorType={getFloorType(firstFloor.info.floorNumber)}
                              />
                            </div>
                          ) : (
                            <BalconyViewCarousel
                              floorNumber={firstFloor.info.floorNumber}
                              currentPoint={firstFloorBalconyPoint}
                              onPointChange={setFirstFloorBalconyPoint}
                              zoom={firstFloorZoom}
                              pan={firstFloorPan}
                              isDragging={isDragging && activeDragFloor === 'first'}
                            />
                          )}
                        </div>
                      </div>
                      
                      {/* Thumbnail Area - Bottom Right */}
                      {firstFloorViewMode === 'balcony' && (
                        <Thumbnail
                          imageSrc={getFloorPlanImage(firstFloor.info.floorNumber)}
                          onClick={handleFirstFloorThumbnailClick}
                          borderColor="#C19A40"
                          label="Floor Plan"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Second Floor (if selected) */}
                  {hasSecondFloor && (
                    <div className="bg-white rounded-lg shadow-sm relative overflow-hidden flex flex-col border-2" style={{ borderColor: '#BDD1B1' }}>
                      {/* Zoom Controls */}
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
                      {/* Zoom indicator */}
                      <div className="absolute bottom-3 left-3 z-20 bg-white/80 px-2 py-1 rounded text-xs text-gray-600">
                        {Math.round(secondFloorZoom * 100)}%
                      </div>
                      {/* View mode indicator */}
                      <div className="absolute top-3 left-3 z-20 bg-[#BDD1B1] text-gray-800 px-2 py-1 rounded text-xs">
                        {secondFloorViewMode === 'balcony' ? `Balcony View` : 'Floor Plan'}
                      </div>
                      
                      {/* Main Content Area with Thumbnail */}
                      <div className="relative bg-white flex-1 min-h-0 flex flex-col">
                        {/* Main View Area */}
                        <div 
                          className="relative flex-1 min-h-0 overflow-hidden"
                          onMouseDown={(e) => handleMouseDown(e, 'second')}
                          onWheel={(e) => handleWheel(e, 'second')}
                          style={{ cursor: secondFloorZoom > 1 ? (isDragging && activeDragFloor === 'second' ? 'grabbing' : 'grab') : 'zoom-in' }}
                        >
                          <div 
                            className="w-full h-full flex items-center justify-center p-2"
                            style={{ minHeight: '100%' }}
                          >
                            {/* Show Floor Plan or Balcony Carousel based on view mode */}
                            {secondFloorViewMode === 'floorplan' ? (
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
                                  src={getFloorPlanImage(secondFloor.info.floorNumber)}
                                  alt={`Floor ${secondFloor.info.floorNumber} Plan`}
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
                                {/* Balcony Overlay - only show on floor plan view */}
                                <BalconyOverlay
                                  onBalconyClick={handleSecondFloorBalconyClick}
                                  isSelected={secondFloorBalconySelected}
                                  floorType={getFloorType(secondFloor.info.floorNumber)}
                                />
                              </div>
                            ) : (
                              <BalconyViewCarousel
                                floorNumber={secondFloor.info.floorNumber}
                                currentPoint={secondFloorBalconyPoint}
                                onPointChange={setSecondFloorBalconyPoint}
                                zoom={secondFloorZoom}
                                pan={secondFloorPan}
                                isDragging={isDragging && activeDragFloor === 'second'}
                              />
                            )}
                          </div>
                        </div>
                        
                        {/* Thumbnail Area - Bottom Right */}
                        {secondFloorViewMode === 'balcony' && (
                          <Thumbnail
                            imageSrc={getFloorPlanImage(secondFloor.info.floorNumber)}
                            onClick={handleSecondFloorThumbnailClick}
                            borderColor="#BDD1B1"
                            label="Floor Plan"
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