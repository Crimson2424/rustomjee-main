import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';
import { ImageContainer } from '../components/ImageContainer';
import { slidesData } from '../constants/data';
import Loader from '../components/Loader';

// Register plugins
gsap.registerPlugin(useGSAP, CustomEase);

// Create custom ease outside component (runs once)
CustomEase.create(
  "hop",
  "M0,0 C0.083,0.294 0.117,0.767 0.413,0.908 0.606,1 0.752,1 1,1 "
);

export default function StorySlider({ 
  slides = slidesData,
  duration = 2.0,
  throttleDelay = 500
}) {
  const navigate = useNavigate();
  const containerRef = useRef();
  const animatingRef = useRef(false);
  const [currentCategory, setCurrentCategory] = useState('amenities');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Touch handling
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchEndY = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50;

  // Accumulated delta for touchpad
  const accumulatedDelta = useRef(0);
  const SCROLL_THRESHOLD = 100;

  // ✅ Add useEffect to control overflow locally
  useEffect(() => {
    // Store original values
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlHeight = document.documentElement.style.height;

    // Apply slider-specific styles
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.height = '100vh';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.height = originalHtmlHeight;
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  // Calculate category boundaries
  const categorySlideCount = slides.reduce((acc, slide) => {
    acc[slide.category] = (acc[slide.category] || 0) + 1;
    return acc;
  }, {});

  const totalSlides = slides.length;
  
  const amenitiesWidth = (categorySlideCount.amenities / totalSlides) * 100;
  const apartmentWidth = (categorySlideCount.apartment / totalSlides) * 100;

  const overallProgress = ((currentSlideIndex + 1) / totalSlides) * 100;

  // Animate text elements when slide becomes active
  const animateTextElements = (slideElement) => {
    const heading = slideElement.querySelector('.text-heading');
    const text = slideElement.querySelector('.text-body');
    const subtext = slideElement.querySelector('.text-subtext');

    if (!heading) return;

    const tl = gsap.timeline({ delay: 0 });

    gsap.set([heading, text, subtext].filter(Boolean), {
      opacity: 0,
      y: 20,
    });

    tl.to(heading, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    });

    if (text) {
      tl.to(text, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.3");
    }

    if (subtext) {
      tl.to(subtext, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.3");
    }
  };

  const { contextSafe } = useGSAP(
  () => {
    const slider = containerRef.current.querySelector('.slider');
    let slideElements = slider.querySelectorAll('.slide');

    slideElements.forEach((slide, index) => {
      if (index > 0) {
        // ✅ Changed: Start from bottom instead of right
        gsap.set(slide, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        });
      }
    });

    const firstSlide = slideElements[0];
    if (firstSlide.querySelector('.text-heading')) {
      animateTextElements(firstSlide);
    }

    const handleSliderNext = () => {
      if (animatingRef.current) return;
      animatingRef.current = true;

      slideElements = slider.querySelectorAll('.slide');

      const firstSlide = slideElements[0];
      const secondSlide = slideElements[1];

      if (slideElements.length > 1) {
        const nextCategory = secondSlide.getAttribute('data-category');
        const nextSlideIndex = parseInt(secondSlide.getAttribute('data-slide-index'));
        
        setCurrentCategory(nextCategory);
        setCurrentSlideIndex(nextSlideIndex);
        
        const firstAnimTarget = firstSlide.querySelector('.slide-content');
        const secondAnimTarget = secondSlide.querySelector('.slide-content');
        
        // ✅ Changed: Animate from bottom (y: 500) instead of right (x: 250)
        gsap.set(secondAnimTarget, { y: 500 });

        gsap.to(secondAnimTarget, {
          y: 0,
          duration: duration,
          ease: "hop",
        });

        // ✅ Changed: Exit to top (y: -500) instead of left (x: -500)
        gsap.to(firstAnimTarget, {
          y: -500,
          duration: duration,
          ease: "hop",
        });

        // ✅ Changed: Reveal from bottom
        gsap.to(secondSlide, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: duration,
          ease: "hop",
          onUpdate: function() {
            const progress = this.progress();
            if (progress >= 0.33 && !secondSlide.dataset.textAnimated) {
              secondSlide.dataset.textAnimated = 'true';
              animateTextElements(secondSlide);
            }
          },
          onComplete: function () {
            firstSlide.remove();
            slider.appendChild(firstSlide);

            // ✅ Changed: Reset to bottom position
            gsap.set(firstSlide, {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            });
            
            delete secondSlide.dataset.textAnimated;

            animatingRef.current = false;
          },
        });
      } else {
        animatingRef.current = false;
      }
    };

    const handleSliderPrev = () => {
      if (animatingRef.current) return;
      animatingRef.current = true;

      slideElements = slider.querySelectorAll('.slide');

      const lastSlide = slideElements[slideElements.length - 1];
      const currentSlide = slideElements[0];

      if (slideElements.length > 1) {
        const prevCategory = lastSlide.getAttribute('data-category');
        const prevSlideIndex = parseInt(lastSlide.getAttribute('data-slide-index'));
        
        setCurrentCategory(prevCategory);
        setCurrentSlideIndex(prevSlideIndex);
        
        const currentAnimTarget = currentSlide.querySelector('.slide-content');
        const lastAnimTarget = lastSlide.querySelector('.slide-content');
        
        slider.removeChild(lastSlide);
        slider.insertBefore(lastSlide, currentSlide);

        gsap.set(lastSlide, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        });
        // ✅ Changed: Start from top (y: -500) instead of left (x: -500)
        gsap.set(lastAnimTarget, { y: -500 });
        gsap.set(currentAnimTarget, { y: 0 });

        gsap.to(lastAnimTarget, {
          y: 0,
          duration: duration,
          ease: "hop",
        });

        // ✅ Changed: Exit to bottom (y: 500) instead of right (x: 250)
        gsap.to(currentAnimTarget, {
          y: 500,
          duration: duration,
          ease: "hop",
        });

        // ✅ Changed: Hide to bottom
        gsap.to(currentSlide, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          duration: duration,
          ease: "hop",
          onUpdate: function() {
            const progress = this.progress();
            if (progress >= 0.33 && !lastSlide.dataset.textAnimated) {
              lastSlide.dataset.textAnimated = 'true';
              animateTextElements(lastSlide);
            }
          },
          onComplete: function () {
            gsap.set(currentAnimTarget, { y: 0 });
            delete lastSlide.dataset.textAnimated;
            animatingRef.current = false;
          },
        });
      } else {
        animatingRef.current = false;
      }
    };

    // ... rest of the code stays the same
    const handleWheel = contextSafe((event) => {
      if (animatingRef.current) {
        accumulatedDelta.current = 0;
        return;
      }

      const delta = event.deltaY;
      accumulatedDelta.current += delta;

      if (Math.abs(accumulatedDelta.current) >= SCROLL_THRESHOLD) {
        if (accumulatedDelta.current > 0) {
          handleSliderNext();
        } else {
          handleSliderPrev();
        }
        
        accumulatedDelta.current = 0;
      }
    });

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.handleSliderNext = handleSliderNext;
    window.handleSliderPrev = handleSliderPrev;

    return () => {
      window.removeEventListener("wheel", handleWheel);
      delete window.handleSliderNext;
      delete window.handleSliderPrev;
    };
  },
  { scope: containerRef }
);


  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return;

    const deltaY = touchStartY.current - touchEndY.current;
    const deltaX = touchStartX.current - touchEndX.current;
    
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > minSwipeDistance) {
        if (window.handleSliderNext) {
          window.handleSliderNext();
        }
      }
      else if (deltaY < -minSwipeDistance) {
        if (window.handleSliderPrev) {
          window.handleSliderPrev();
        }
      }
    }

    touchStartY.current = 0;
    touchStartX.current = 0;
    touchEndY.current = 0;
    touchEndX.current = 0;
  };

  const jumpToCategory = contextSafe((category) => {
    if (animatingRef.current || currentCategory === category) return;
    
    const slider = containerRef.current.querySelector('.slider');
    const slideElements = Array.from(slider.querySelectorAll('.slide'));
    
    const targetIndex = slideElements.findIndex(
      slide => slide.getAttribute('data-category') === category
    );
    
    if (targetIndex === -1 || targetIndex === 0) return;
    
    const targetSlide = slideElements[targetIndex];
    const targetSlideIndex = parseInt(targetSlide.getAttribute('data-slide-index'));
    
    setCurrentCategory(category);
    setCurrentSlideIndex(targetSlideIndex);
    
    animatingRef.current = true;

    const currentSlide = slideElements[0];
    
    const currentAnimTarget = currentSlide.querySelector('.slide-content');
    const targetAnimTarget = targetSlide.querySelector('.slide-content');

    gsap.set(targetAnimTarget, { x: 250 });

    gsap.to(targetAnimTarget, {
      x: 0,
      duration: duration,
      ease: "hop",
    });

    gsap.to(currentAnimTarget, {
      x: -500,
      duration: duration,
      ease: "hop",
    });

    gsap.to(targetSlide, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: duration,
      ease: "hop",
      onUpdate: function() {
        const progress = this.progress();
        if (progress >= 0.33 && !targetSlide.dataset.textAnimated) {
          targetSlide.dataset.textAnimated = 'true';
          animateTextElements(targetSlide);
        }
      },
      onComplete: function () {
        for (let i = 0; i < targetIndex; i++) {
          const slideToMove = slider.querySelector('.slide');
          slideToMove.remove();
          slider.appendChild(slideToMove);
          gsap.set(slideToMove, {
            clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
          });
        }

        delete targetSlide.dataset.textAnimated;
        animatingRef.current = false;
      },
    });
  });

  const renderSlideContent = (slide) => {
  return (
    <div className="slide-content absolute top-0 left-0 w-full h-full bg-black flex items-center justify-center">
      {slide.revealImage ? (
        <ImageContainer 
          baseImage={slide.src} 
          revealImage={slide.revealImage} 
        />
      ) : (
        <img
          src={slide.src}
          alt={`Slide ${slide.id}`}
          className="max-w-full max-h-full object-contain"
          style={{ 
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        />
      )}
    </div>
  );
};


  return (
    <>
    <Loader>
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-screen h-screen bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        overscrollBehavior: 'none',
        overscrollBehaviorY: 'none',
        touchAction: 'none'
      }}
    >
      {/* Close Button - Top Left */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-sm hover:bg-[#1d2938] rounded-full transition-all duration-300 cursor-pointer group"
      >
        <svg 
          className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
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

      {/* Logo - Top Right */}
      <div className='fixed top-4 right-4 z-50 flex justify-end items-end'>
        <img src="/images/logo.svg" alt="Rustomjee" className="h-12 w-auto"/>
      </div>

      <div className="slider absolute top-0 left-0 w-full h-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            data-category={slide.category}
            data-slide-index={index}
            className="slide absolute top-0 left-0 w-full h-full overflow-hidden will-change-transform"
          >
            {renderSlideContent(slide)}
          </div>
        ))}

        <div className='bottom-6 w-[90%] sm:w-[50%] px-4 sm:px-12 absolute left-1/2 -translate-x-1/2 z-50'>
          <div className='relative w-full h-1 bg-white/30 rounded-none overflow-hidden opacity-50'>
            <div 
              className='h-full bg-white transition-all duration-300 ease-out rounded-none'
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>
      
    </div>
    </Loader>
    </>
  );
}
