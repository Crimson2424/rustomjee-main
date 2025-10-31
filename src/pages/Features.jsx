// Broucher.jsx
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';
import { type1SlidesData } from '../constants/data';
import Loader from '../components/Loader';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, CustomEase);

// Create custom ease
CustomEase.create(
  "hop",
  "M0,0 C0.083,0.294 0.117,0.767 0.413,0.908 0.606,1 0.752,1 1,1 "
);

// GoldLine Component
const GoldLine = ({ className = "" }) => {
  return (
    <div 
      className={`h-[2px] ${className}`}
      style={{
        background: 'linear-gradient(to right, #C9A961 0%, #D4B574 30%, rgba(201, 169, 97, 0.5) 70%, transparent 100%)'
      }}
    />
  );
};

// Type1 Slide Component
// Type1 Slide Component
const Type1Slide = ({ data }) => {
  return (
    <div className={`flex w-full h-full ${data.reverse ? 'flex-row-reverse' : ''}`}>
      {/* Image container with relative positioning */}
      <div className={data.imageContainerClassName || 'w-3/4'}>
        <img 
          src={data.image.src} 
          className={data.image.className}
          alt={data.title?.text || ''}
        />
        
        {/* ✅ Overlay content - text, line, and subtext */}
        {data.overlayText?.text && (
          <div className={data.overlayPosition}>
            {/* Main overlay text */}
            <div className={`${data.overlayText.className} text-element`}>
              {data.overlayText.text}
            </div>
            
            {/* Golden line */}
            {data.overlayText.showLine && (
              <div className="text-element">
                <GoldLine className={data.overlayText.lineClassName} />
              </div>
            )}
            
            {/* Subtext */}
            {data.overlayText.subtext && (
              <div className={`${data.overlayText.subtextClassName} text-element`}>
                {data.overlayText.subtext}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content section */}
      <div className={data.contentClassName}>
        {data.title?.text && (
          <h2 className={`${data.title.className} text-element`}>
            {data.title.text}
          </h2>
        )}
        
        {data.showLineAfterTitle && (
          <div className="text-element">
            <GoldLine className={data.lineAfterTitleClassName} />
          </div>
        )}
        
        {data.description?.text && (
          <p className={`${data.description.className} text-element`}>
            {data.description.text}
          </p>
        )}

        {data.stats && data.stats.length > 0 && (
          <div className={data.statsContainerClassName}>
            {data.stats.map((stat, index) => (
              <div key={index}>
                <div className="flex items-baseline text-element">
                  {/* ✅ ONLY CHANGE: Render image if valueImage exists, otherwise text */}
                  {stat.valueImage ? (
                    <img 
                      src={stat.valueImage} 
                      alt={stat.value}
                      className={stat.valueImageClassName || stat.valueClassName}
                    />
                  ) : (
                    <span className={stat.valueClassName}>
                      {stat.value}
                    </span>
                  )}
                  
                  <span className={stat.labelClassName}>
                    {stat.label}
                  </span>
                </div>
                {stat.showLineAfter && (
                  <div className="text-element">
                    <GoldLine className={stat.lineClassName} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};




// Main Broucher Component
const Broucher = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);

  // Random slide directions
  const getRandomDirection = () => {
    const directions = [
      { 
        initial: { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)", x: -500 },
        final: { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", x: 0 }
      },
      { 
        initial: { clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)", x: 500 },
        final: { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", x: 0 }
      },
      { 
        initial: { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", y: -300 },
        final: { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", y: 0 }
      },
      { 
        initial: { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", y: 300 },
        final: { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", y: 0 }
      },
      { 
        initial: { clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)", x: -300, y: -200 },
        final: { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", x: 0, y: 0 }
      },
      { 
        initial: { clipPath: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)", x: 300, y: 200 },
        final: { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", x: 0, y: 0 }
      }
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  };

  const slideDirections = useRef(type1SlidesData.map(() => getRandomDirection()));

  useEffect(() => {
    slideDirections.current = type1SlidesData.map(() => getRandomDirection());
  }, []);

  // ✅ Animate to target slide with TEXT ANIMATIONS
  const animateToSlide = (targetIndex) => {
    if (targetIndex === currentSlide) return;
    
    gsap.killTweensOf(['.slide', '.slide-content', '.text-element']);
    
    const currentSlideEl = document.querySelector(`[data-slide-index="${currentSlide}"]`);
    const targetSlideEl = document.querySelector(`[data-slide-index="${targetIndex}"]`);
    
    if (!currentSlideEl || !targetSlideEl) return;

    const currentContent = currentSlideEl.querySelector('.slide-content');
    const targetContent = targetSlideEl.querySelector('.slide-content');
    const targetTexts = targetSlideEl.querySelectorAll('.text-element');

    const targetDirection = slideDirections.current[targetIndex];
    const currentDirection = slideDirections.current[currentSlide];

    // Set initial state for target slide
    gsap.set(targetSlideEl, { clipPath: targetDirection.initial.clipPath, zIndex: 10 });
    gsap.set(targetContent, { 
      x: targetDirection.initial.x || 0, 
      y: targetDirection.initial.y || 0 
    });
    // ✅ Set text elements invisible
    gsap.set(targetTexts, { opacity: 0, y: 30 });
    gsap.set(currentSlideEl, { zIndex: 5 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(currentSlideEl, { 
          clipPath: currentDirection.initial.clipPath,
          zIndex: 1
        });
        gsap.set(currentContent, {
          x: currentDirection.initial.x || 0,
          y: currentDirection.initial.y || 0
        });
        gsap.set(targetSlideEl, { zIndex: 1 });
      }
    });

    // Slide animations
    tl.to(currentContent, {
      x: currentDirection.initial.x || -500,
      y: currentDirection.initial.y || 0,
      duration: 2,
      ease: "hop"
    }, 0)
    
    .to(targetSlideEl, {
      clipPath: targetDirection.final.clipPath,
      duration: 2,
      ease: "hop",
    }, 0)
    
    .to(targetContent, {
      x: targetDirection.final.x || 0,
      y: targetDirection.final.y || 0,
      duration: 2,
      ease: "hop"
    }, 0)
    
    // ✅ TEXT ANIMATIONS - Sequential with hop easing
    .to(targetTexts, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.15, // Each element animates 0.15s after the previous
      ease: "hop", // ✅ Using hop easing for text
    }, 0.8); // Start text animations 0.8s after slide starts
    
    setCurrentSlide(targetIndex);
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      animateToSlide(currentSlide - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < type1SlidesData.length - 1) {
      animateToSlide(currentSlide + 1);
    }
  };

  // ✅ Initialize slides with first slide text animated
  useGSAP(() => {
    const slideElements = document.querySelectorAll('.slide');
    
    slideElements.forEach((slide, index) => {
      const direction = slideDirections.current[index];
      
      if (index === 0) {
        gsap.set(slide, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        });
        gsap.set(slide.querySelector('.slide-content'), { x: 0, y: 0 });
        
        // ✅ Animate first slide text on load
        const firstTexts = slide.querySelectorAll('.text-element');
        gsap.set(firstTexts, { opacity: 0, y: 30 });
        gsap.to(firstTexts, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "hop",
          delay: 0.3
        });
      } else {
        gsap.set(slide, {
          clipPath: direction.initial.clipPath,
        });
        gsap.set(slide.querySelector('.slide-content'), { 
          x: direction.initial.x || 0, 
          y: direction.initial.y || 0 
        });
      }
    });
  }, { scope: containerRef });

  return (
    <Loader>
    <div ref={containerRef} className="h-screen overflow-hidden relative">
      <div className="relative w-full h-full">
        {type1SlidesData.map((slideData, index) => (
          <div
            key={slideData.id}
            data-slide-index={index}
            className="slide absolute inset-0 w-full h-full overflow-hidden"
          >
            <div className="slide-content absolute inset-0 w-full h-full">
              <Type1Slide data={slideData} />
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={handlePrevSlide}
          disabled={currentSlide === 0}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 cursor-pointer transition-opacity duration-300 hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <img 
            src="/left.png" 
            alt="Previous" 
            className="w-12 h-12 md:w-16 md:h-16"
            style={{
              filter: 'brightness(0) saturate(100%) invert(61%) sepia(85%) saturate(549%) hue-rotate(359deg) brightness(92%) contrast(87%)'
            }}
          />
        </button>

        <button
          onClick={handleNextSlide}
          disabled={currentSlide === type1SlidesData.length - 1}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 cursor-pointer transition-opacity duration-300 hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <img 
            src="/right.png" 
            alt="Next" 
            className="w-12 h-12 md:w-16 md:h-16"
            style={{
              filter: 'brightness(0) saturate(100%) invert(61%) sepia(85%) saturate(549%) hue-rotate(359deg) brightness(92%) contrast(87%)'
            }}
          />
        </button>
      </div>
    </div>
    </Loader>
  );
};

export default Broucher;