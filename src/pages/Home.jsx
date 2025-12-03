// import { useRef, useState, useEffect } from "react";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import SmoothScroll from "../components/SmoothScroll";
// import { ScrollToPlugin } from "gsap/all";
// import ReactLenis from "lenis/react";
// import { IoHomeOutline } from "react-icons/io5";
// import { MdOutline360, MdOutlineInventory } from "react-icons/md";
// import { GrGallery } from "react-icons/gr";
// import { FloorPlanIcon } from "../components/Icons";
// import { TbStack } from "react-icons/tb";
// import { LuMapPin } from "react-icons/lu";
// import Loader from "../components/Loader";
// import OrientationLock from "../components/OrientationLock";

// gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

// const Home = () => {
//   const videoRef = useRef(null);
//   const video2Ref = useRef(null);
//   const container = useRef(null);
//   const midvidsection = useRef();
//   const textRef = useRef(null);
//   const midVideoRef = useRef(null);
//   const bottomDiv = useRef();
//   const imageRef = useRef();
//   const bottomAnimateLogo = useRef();
//   const endAnimateLogo = useRef();
//   const [scrollEnabled, setScrollEnabled] = useState(false);

//   useGSAP(
//     () => {
//       if (videoRef.current) {
//         videoRef.current.play().catch((err) => {
//           console.log("Video autoplay prevented", err);
//         });
//       }

//       // Disable scroll initially
//       document.body.style.overflow = "hidden";

//       const logo = container.current?.querySelector(".logo img");
//       const text1 = container.current?.querySelector(".text-1");
//       const text2 = container.current?.querySelector(".text-2");
//       const scrollIndicator =
//         container.current?.querySelector(".scroll-indicator");

//       if (!text1 || !text2 || !scrollIndicator) {
//         return;
//       }

//       // Create sequential timeline
//       const tl = gsap.timeline({
//         onComplete: () => {
//           // Enable scroll when animation completes
//           document.body.style.overflow = "auto";
//           setScrollEnabled(true);

//           // Play second video when scrolling is enabled
//           if (video2Ref.current) {
//             video2Ref.current.play().catch((err) => {
//               console.log("Video 2 autoplay prevented", err);
//             });
//           }
//         },
//       });

//       // Logo fade in
//       tl.fromTo(
//         logo,
//         { opacity: 0 },
//         { opacity: 1, duration: 2, delay:1, ease: "power1.inOut" }
//       )
//         // First text - fade in
//         .fromTo(
//           text1,
//           { opacity: 0 },
//           { opacity: 1, duration: 1.5, ease: "power1.inOut" },
//           "+=0.3"
//         )
//         // First text - fade out
//         .to(text1, { opacity: 0, duration: 1.5, ease: "power1.inOut" }, "+=1")
//         // Second text - fade in
//         .fromTo(
//           text2,
//           { opacity: 0 },
//           { opacity: 1, duration: 1.5, ease: "power1.inOut" },
//           "+=0.2"
//         )
//         // Second text - fade out
//         .to(text2, { opacity: 0, duration: 1.5, ease: "power1.inOut" }, "+=1")
//         // Scroll indicator - fade in and stays
//         .fromTo(
//           scrollIndicator,
//           { opacity: 0 },
//           { opacity: 1, duration: 1.5, ease: "power1.inOut" },
//           "+=0.2"
//         );
//     },
//     { scope: container }
//   );

//   // Mid section text animation with ScrollTrigger
//   useEffect(() => {
//     if (!scrollEnabled || !textRef.current || !midvidsection.current) return;

//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         textRef.current,
//         {
//           y: 100,
//           opacity: 0,
//         },
//         {
//           y: 0,
//           opacity: 1,
//           duration: 1,
//           ease: "power3.out",
//           scrollTrigger: {
//             trigger: midvidsection.current,
//             start: "top 20%", // Animation starts when top of section is 80% down the viewport
//             end: "bottom 30%", // Animation ends when top of section is 30% down the viewport
//             scrub: 1, // Smooth scrubbing effect
//             markers: false, // Set to true for debugging
//             toggleActions: "play none none reverse",
//           },
//         }
//       );
//     });

//     return () => ctx.revert();
//   }, [scrollEnabled]);

//   const width = window.innerWidth;

//   let scaleValue;
//   let yValue;

//   if (width >= 1280) {
//     scaleValue = 1.06;
//     yValue = -90;
//   } else if (width >= 1024) {
//     scaleValue = 1.05;
//     yValue = -75;
//   } else if (width >= 640) {
//     scaleValue = 1.03;
//     yValue = -30;
//   } else {
//     scaleValue = 1.07;
//     yValue = -90;
//   }

//   useEffect(() => {
//     if (
//       !scrollEnabled ||
//       !bottomDiv.current ||
//       !bottomAnimateLogo.current ||
//       !imageRef.current ||
//       !endAnimateLogo.current
//     )
//       return;

//     const ctx = gsap.context(() => {
//       // 💡 This prevents the flash
//       gsap.set(bottomAnimateLogo.current.querySelectorAll("*"), {
//         opacity: 0,
//         y: 100,
//         scale: 0.9,
//       });

//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: bottomDiv.current,
//           start: "top bottom", // timeline starts here     /for big screen 50% 80%
//           end: "bottom bottom", // timeline ends here
//           scrub: 10, // scrub entire timeline
//           markers: false, // for debugging
//         },
//       });

//       tl.to(bottomAnimateLogo.current.querySelectorAll("*"), {
//         opacity: 1,
//         y: 0,
//         scale: 1,
//         ease: "power2.inOut",
//         duration: 4,
//         stagger: 2,
//       })
//         .to(
//           bottomAnimateLogo.current.querySelectorAll("*"),
//           {
            
//             yPercent: -300,
//             ease: "linear",
//             duration: 2,
//             stagger: 2,
//           },
//           ">0.2"
//         )
//         .to(
//           bottomAnimateLogo.current.querySelectorAll("*"),
//           {
//             opacity: 0,
//             ease: "linear",
//             duration: 2,
//             stagger: 2,
//           },
//           "<" // runs at the same time as the previous tween
//         )
//         .to(
//           imageRef.current,
//           {
//             scale: scaleValue,  //1.05
//             y: yValue,  //90
//             ease: "power2.inOut",
//             duration: 1.5,
//           },
//           ">0.2"
//         )
//         .fromTo(
//           endAnimateLogo.current,
//           {
//             opacity: 0,
//             yPercent: 100,
//           },
//           {
//             opacity: 1,
//             yPercent: 0,
//             ease: "power2.out",
//             duration: 1.5,
//           },
//           ">0.2"
//         );
//     });

//     return () => ctx.revert();
//   }, [scrollEnabled]);

//   return (
//     <>
//     <OrientationLock />
//       <Loader>
//         {scrollEnabled && <ReactLenis root options={{ duration: 3 }} />}
//         <div
//           ref={container}
//           className="w-full h-[196vw] overflow-hidden relative "
//         >
//           {/* full body image in background */}
//           <img
//             ref={imageRef}
//             src="images/full-body.jpg"
//             className=" w-screen bg-no-repeat bg-cover bg-center absolute -z-100 origin-[center_150vw]"
//             alt=""
//           />
//           {/* Logo - Fixed within hero section */}
//           <div className="logo absolute top-1 xl:top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
//             <img
//               src="/images/logo.svg"
//               alt="Rustomjee"
//               className="h-12 xl:h-18 w-auto opacity-0
          
//             "
//             />
//           </div>

//           {/* Sequential Text at Bottom */}
//           <div className="h-screen w-full left-0 top-0 right-0 absolute z-50 select-none">
//             <div className="absolute bottom-0 md:bottom-26 lg:bottom-30 xl:bottom-10 h-20 left-0 right-0 flex justify-center ">
//               <h1
//                 className="text-1 absolute text-xl lg:text-2xl  xl:text-4xl uppercase font-bold text-center px-8 opacity-0"
//                 style={{ fontFamily: "Balgin, sans-serif", color: "white" }}
//               >
//                 A quiet statement perched above the tides of time.
//               </h1>

//               <h1
//                 className="text-2 absolute text-xl lg:text-2xl  xl:text-4xl uppercase font-bold text-center px-8 opacity-0"
//                 style={{ fontFamily: "Balgin, sans-serif", color: "white" }}
//               >
//                 Where the sea tells its secrets
//               </h1>

//               <div
//                 onClick={() => {
//                   gsap.to(window, {
//                     duration: 2, // how long the scroll should take
//                     scrollTo: midvidsection.current, // can also use {y: targetRef.current, offsetY: 50}
//                     ease: "power3.inOut", // smooth easing
//                   });
//                 }}
//                 className={`scroll-indicator absolute bottom-0 flex flex-col md:bottom-0  lg:bottom-0 xl:-bottom-9 items-center opacity-0 cursor-pointer ${
//                   !scrollEnabled && "pointer-events-none "
//                 } `}
//               >
//                 <p
//                   className="text-2xl lg:text-3xl xl:text-4xl  uppercase font-bold mb-1"
//                   style={{ fontFamily: "Balgin, sans-serif", color: "white" }}
//                 >
//                   Scroll
//                 </p>
//                 <div className="flex flex-col -space-y-3">
//                   <svg
//                     className="w-7 h-7 xl:w-10 xl:h-10"
//                     fill="white"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <svg
//                     className="w-7 h-7 xl:w-10 xl:h-10"
//                     fill="white"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="relative ">
//             <div className="bg-gradient-to-b absolute translate-y-full left-0 w-full bottom-0 from-[#C0B8AF] to-transparent h-10 z-10"></div>
//             <video
//               ref={videoRef}
//               autoPlay
//               loop
//               muted
//               playsInline
//               className=" top-0 left-0 w-full object-cover -z-1 "
//             >
//               <source src="/video/beachfinal2.mp4" type="video/mp4" />
//             </video>

//             {/* //Mid-section */}
//             <div
//               ref={midvidsection}
//               className="overflow-hidden -translate-y-[0.7vw] absolute w-full h-full -z-100 "
//             >
//               <video
//                 ref={midVideoRef}
//                 autoPlay
//                 loop
//                 muted
//                 playsInline
//                 className="w-full"
//               >
//                 <source src="/video/newcenter2.mp4" />
//               </video>
//               {/* Text on Left Side - Vertically Centered */}
//               <div className="absolute h-[10vw] left-8 lg:left-15 top-1/2 -translate-y-1/2 z-40">
//                 <h1
//                   ref={textRef}
//                   className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl  uppercase font-bold"
//                   style={{
//                     fontFamily: "Balgin, sans-serif",
//                     color: "#1d2938",
//                   }}
//                 >
//                   A DREAM
//                   <br />
//                   IN BANDRA
//                 </h1>
//               </div>
//             </div>

//             <div className="w-full h-fit translate-y-[calc(100%-0.7vw)] absolute bottom-0 z-50 ">
//               <img
//                 src="/images/overlay1.png"
//                 alt="Overlay Top"
//                 className="w-full h-full mask-alpha bg-no-repeat bg-cover"
//               />
//             </div>
//           </div>

//           {/* Logo and Text - Center (for intro animation) */}
//           <div
//             ref={bottomDiv}
//             className="w-full h-screen absolute bottom-0 z-500 "
//           >
//             <div
//               ref={bottomAnimateLogo}
//               className="end-logo absolute h-[12vw] sm:h-[22vw] md:h-[20vw] lg:h-[10vw] xl:h-[26vw] lg:top-45 top-8 md:top-35 left-1/2 -translate-x-1/2 -translate-y-1/2  opacity-100 flex flex-col items-center"
//             >
//               <img
//                 src="/images/logo.png"
//                 alt="Rustomjee"
//                 className="h-10 md:h-20 w-auto"
//               />
//               <h1
//                 className="end-text text-2xl md:text-4xl uppercase font-bold tracking-wider opacity-100"
//                 style={{
//                   fontFamily: "Balgin, sans-serif",
//                   color: "#1d2938",
//                 }}
//               >
//                 CLIFF TOWER
//               </h1>
//             </div>

//             {/* Logo and Text - Top (appears after zoom) */}
//             <div
//               ref={endAnimateLogo}
//               className="end-top-logo  absolute bottom-[1vw] left-1/2 -translate-x-1/2 z-50 opacity-0 flex gap-5 items-center p-2 py-2 xl:p-4 rounded-xs bg-white text-gray-500"
//             >
//               <IoHomeOutline className="hover:scale-110 hover:-translate-y-2 hover:cursor-pointer transition-all text-xl xl:text-2xl" />
//               <MdOutlineInventory className="hover:scale-110 hover:-translate-y-2 hover:cursor-pointer transition-all text-xl xl:text-2xl" />
//               <MdOutline360 className="hover:scale-110 hover:-translate-y-2 hover:cursor-pointer transition-all text-xl xl:text-2xl" />
//               <GrGallery className="hover:scale-110 hover:-translate-y-2 hover:cursor-pointer transition-all text-xl xl:text-2xl" />
//               <FloorPlanIcon className="hover:scale-110 hover:-translate-y-2 hover:cursor-pointer transition-all h-5 xl:h-7" />
//               <TbStack className="hover:scale-110 hover:-translate-y-2 hover:cursor-pointer transition-all text-xl xl:text-2xl" />
//               <LuMapPin className="hover:scale-110 hover:-translate-y-2 hover:cursor-pointer transition-all text-xl xl:text-2xl" />
//             </div>
//           </div>
//         </div>
//       </Loader>
//     </>
//   );
// };

// export default Home;

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import ReactLenis from "lenis/react";
import OrientationLock from "../components/OrientationLock";
import Loader from "../components/Loader";
import NavigationBar from "../components/Nav";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/all";

// REGISTER PLUGINS
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const Home2 = () => {
  const container = useRef(null);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  // --- SECTIONS ---
  const section1 = useRef(null);
  const section2 = useRef(null);
  const section3 = useRef(null);
  

  // --- ELEMENTS ---
  const heroImage = useRef(null);
  const heroVideo = useRef(null);
  const dreamInBandra = useRef(null)
  
  const introLogo = useRef(null);
  const introText1 = useRef(null);
  const introText2 = useRef(null);
  const scrollIndicator = useRef(null);
  
  const midText = useRef(null);
  const midVideo = useRef(null);
  
  const skyImage = useRef(null)
  const bottomLogo = useRef(null);
  const bottomNavbar = useRef(null);


  const width = window.innerWidth;

  let scaleValue;
  let yValue;
  let startValue;
  let midTextStart;
  let bandraStart;
  let bandraHeight="190vh"
  // if (width >= 1536) {
  //   // 2xl screens (1536px+)
  //   scaleValue = 1.04;
  //   yValue = -70;
  // } else
 if(width>=2560){
  scaleValue = 1.25;
      yValue = -155;
      startValue = "95% top"
      midTextStart= "55% 40%"
      bandraStart = "10% top"
 }   
else if(width>=1440){
  scaleValue = 1.1;
      yValue = -20;
      startValue = "80% top"
      midTextStart= "55% 40%"
      bandraStart = "10% top"
}

 else if(width==1366 || width==1368){
      scaleValue = 1.2;
      yValue = -130;
      startValue = "80% top"
      midTextStart= "55% 40%"
      bandraStart = "10% top"
    }
 else if (width >= 1280) {
    // xl screens (1280px - 1535px)
    scaleValue = 1.03;
    yValue = -10;
    startValue = "80% top"
    midTextStart= "55% 40%"
    bandraStart = "bottom 145%"
  } 
  else if (width >= 1024) {
    // lg screens (1024px - 1279px)
    scaleValue = 1.1;
    yValue = -40;
    startValue = "70% top"
    midTextStart = "55% 40%"
    bandraStart= "20% top"
  } 
  else if(width==914){
    scaleValue= 1.03;
    yValue = 20;
    startValue= "95% top"
    midTextStart="55% top"
    bandraStart = "bottom 145%"
    bandraHeight= "200vh"
  }
  else if(width>=800){
    // screen (800px-1023px)
    scaleValue= 1.03;
    yValue = 20;
    startValue= "95% top"
    midTextStart="55% top"
    bandraStart = "bottom 145%"
  }
  else if(width==740){
    scaleValue= 1.03
    yValue = 5
    startValue= "95% top"
    midTextStart="40% top"
    bandraStart = "bottom 145%"
  }
  else if(width==720){
    scaleValue= 1.2
    yValue = -60
    startValue= "70% top"
    midTextStart="40% top"
    bandraStart = "20% top"
    bandraHeight = "140vh"
  }
  else if (width >= 640) {
    // sm/md screens (640px - 1023px)
    scaleValue = 1.03;
    yValue = -10;
    startValue= "85% top"
    midTextStart= "30% top"
    bandraStart = "bottom 145%"
  } else {
    // Mobile screens (< 640px)
    scaleValue = 1.03;
    yValue = -10;
    startValue = "100% top"
    bandraStart = "bottom 145%"
  }
  // ========================================================
  // 1. INTRO ANIMATION
  // ========================================================
  useGSAP(
    () => {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "auto";
          setScrollEnabled(true);
        },
      });

      if (introLogo.current) {
        tl.fromTo(introLogo.current, { opacity: 0 }, { opacity: 1, duration: 2, delay: 0.5, ease: "power1.inOut" });
      }
      if (introText1.current) {
        tl.fromTo(introText1.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: "power1.inOut" }, "+=0.3")
          .to(introText1.current, { opacity: 0, duration: 1.5, delay: 1, ease: "power1.inOut" }, "+=0");
      }
      if (introText2.current) {
        tl.fromTo(introText2.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: "power1.inOut" }, "+=0.2")
          .to(introText2.current, { opacity: 0, duration: 1.5, delay: 1, ease: "power1.inOut" }, "+=0");
      }
      if (scrollIndicator.current) {
        tl.fromTo(scrollIndicator.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: "power1.inOut" }, "+=0.2");
      }

      return () => {
        document.body.style.overflow = "auto";
      };
    },
    { scope: container }
  );

  // ========================================================
  // 2. MID TEXT ANIMATION
  // ========================================================
  useEffect(() => {
    if (!midText.current || !section1.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        midText.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            markers: false,
            trigger: section1.current,
            start: bandraStart,
            end: "bottom 130%", 
            scrub: 1, 
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // ========================================================
  // 3. BOTTOM ANIMATION
  // ========================================================
  useEffect(() => {
    if (!section3.current || !bottomLogo.current) return;

    const ctx = gsap.context(() => {
      const navTarget = ".bottom-nav";

      // Initial States
      gsap.set(bottomLogo.current, { opacity: 0, yPercent: 50, scale: 0.9 });
      gsap.set(navTarget, { opacity: 0, yPercent: 100 });

      // --- TIMELINE 1: LOGO ANIMATION ---
      // Triggers earlier (when section enters view)
      const tlLogo = gsap.timeline({
        scrollTrigger: {
          // markers: true,
          trigger: section3.current,
          // start: "55% 40%", 
          start: midTextStart ,
          end: "90% 65%",
          scrub: 2,
          
        },
      });

      tlLogo.to(bottomLogo.current, {
        opacity: 1,
        yPercent: 0,
        scale: 1,
        ease: "circ.out",
        duration: 1,
        
      })
      .to(bottomLogo.current, {
        yPercent: -100, 
        opacity: 0,     
        ease:"",
        duration: 2,    
      }, "+=1.5");



      // --- TIMELINE 2: NAVBAR ANIMATION ---
      // Triggers LATER (only when you are closer to the bottom)
      const tlNav = gsap.timeline({
        scrollTrigger: {
          trigger: section3.current,
          markers: false,
          // ✅ DIFFERENT START: Starts when top of Section 3 hits 20% from top 
          // (meaning you have scrolled much further down)
          start: startValue, 
          end: "top top",
          scrub: 2, 
        },
      });

      tlNav.to(skyImage.current, {
        y: yValue,
        scale: scaleValue, 
        ease: "power3.in", // Smooth easing
        duration: 10, 
               // ✅ ADDED: Takes 3 seconds to zoom in automatically
      },);

      tlNav.to(navTarget, {
        opacity: 1,
        yPercent: 0,
        ease: "power1.in",
        duration: 1,
        
      }, "+=1");
      
    }, container);

    
    
    
    return () => ctx.revert();
  }, []);

  // --- TIMELINE 3: ZOOM ANIMATION ---
      // const t1Zoom = gsap.timeline({
      //   scrollTrigger: {
      //     trigger: section3.current,
      //     markers: false,
          
      //     // ✅ FIX: "bottom bottom"
      //     // Starts animation exactly when the bottom of the section hits the bottom of the screen.
      //     start: "bottom bottom", 
      //     end: "",
      //     // ✅ FIX: Removed 'scrub' and 'end'
      //     // Instead, we use toggleActions to Play when we get there, and Reverse when we leave.
      //     toggleActions: "play none none reverse",
      //   }
      // });

      // t1Zoom.to(skyImage.current, {
      //   scale: 1.2, 
      //   ease: "power2.out", // Smooth easing
      //   duration: 3,        // ✅ ADDED: Takes 3 seconds to zoom in automatically
      // });

  return (
    <>
      <OrientationLock />
      <Loader>
        {scrollEnabled && <ReactLenis root options={{ duration: 3 }} />}
        
        {/* ✅ FIX: Removed 'bg-white' so z-[-10] layers aren't hidden */}
        <div ref={container} className="w-full overflow-hidden bg-[#dedbd4]">
          
          {/* --- SECTION 1: INTRO --- */}
          {/* ✅ FIX: Added 'z-10' to ensure the mask sits ON TOP of Section 2 */}
          <section ref={section1} className="w-full relative overflow-hidden z-10 -mb-[28vh]">
            
            <img 
              ref={heroImage} 
              src="/images/TopSea1.png" 
              className="w-full -mt-[50vh] h-auto block  relative z-0 pointer-events-none" 
              alt="Hero Background" 
            />
            
            <video
              ref={heroVideo}
              muted loop playsInline autoPlay
              className="
                absolute top-0 left-0 w-full h-auto z-10 
                [mask-image:url(/images/AlphaMask.jpg)] [-webkit-mask-image:url(/images/AlphaMask.jpg)] 
                [mask-mode:luminance] [-webkit-mask-mode:luminance] 
                [mask-size:100%_100%] [-webkit-mask-size:100%_100%] 
                [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat] 
                [mask-position:center] [-webkit-mask-position:center]
              "
            >
              <source src="/video/beachfinal2.mp4" type="video/mp4" />
            </video>

            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
              <img ref={introLogo} src="/images/logo.svg" alt="Rustomjee" className="h-12 xl:h-18 lg:h-16 w-auto opacity-0 3xl:h-30 4xl:h-45" />
            </div>


{/* OVERLAY CONTAINER: Covers entire Section 1 (100vh) */}
          <div className={`absolute top-0 left-0 w-full h-[200vh] max-lg:h-[${bandraHeight}] max-lg: max-md:h-[${bandraHeight}] max-xl:h-[100vh] max-2xl:h-[155vh] 3xl:h-[160vh] z-60 pointer-events-none flex flex-col`}>
            
            {/* --- TOP HALF: INTRO TEXT & SCROLL --- */}
            {/* 'flex-1' makes it take up available space. 'justify-end' pushes content to bottom. */}
            <div className="flex-1 relative w-full flex flex-col justify-end pb-10">
              
              <div className="relative w-full h-20"> 
                {/* Intro Text 1 */}
                <h1 
                  ref={introText1} 
                  className="absolute bottom-0 w-full text-center text-4xl max-md:text-2xl max-lg:text-2xl 3xl:text-6xl 4xl:text-8xl text-white opacity-0 uppercase font-bold" 
                  style={{ fontFamily: "Balgin, sans-serif" }}
                >
                  A quiet statement perched above the tides of time.
                </h1>

                {/* Intro Text 2 */}
                <h1 
                  ref={introText2} 
                  className="absolute bottom-0 w-full text-center text-4xl max-md:text-2xl max-lg:text-2xl 3xl:text-6xl 4xl:text-8xl text-white opacity-0 uppercase font-bold" 
                  style={{ fontFamily: "Balgin, sans-serif" }}
                >
                  Where the sea tells its secrets
                </h1>

                {/* Scroll Indicator */}
                <div
                  ref={scrollIndicator}
                  className="scroll-indicator absolute bottom-0 w-full flex flex-col items-center opacity-0 cursor-pointer pointer-events-auto"
                  onClick={() => gsap.to(window, { duration: 2, scrollTo: dreamInBandra.current, ease: "power3.inOut" })}
                >
                  <p className="uppercase max-md:text-xl font-bold w-full text-center text-2xl 3xl:text-4xl 4xl:text-6xl text-white">Scroll</p>
                  <div className="flex flex-col -space-y-5 4xl:-space-y-13">
                    <svg className="w-7 h-7 xl:w-8 xl:h-8 max-md:w-5 4xl:w-20 4xl:h-20" fill="white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                    <svg className="w-7 h-7 xl:w-8 xl:h-8 max-md:w-5 4xl:w-20 4xl:h-20" fill="white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                  </div>
          
                </div>
              </div>
            </div>

            {/* --- BOTTOM HALF: MID TEXT --- */}
            {/* 'flex-1' takes the remaining height. 'items-center' centers text vertically in this space. */}
            <div 
            ref={dreamInBandra}
            className="flex-1 relative  max-md:bottom-32 w-full flex items-center justify-center">
              <h1
                ref={midText}
                className="font-bold text-5xl max-md:text-2xl max-lg:text-2xl 3xl:text-6xl 4xl:text-[120px] text-[#ffffff] opacity-0 text-center uppercase"
                style={{ fontFamily: "Balgin, sans-serif" }}
              >
                A DREAM IN BANDRA
              </h1>
            </div>

          </div>
            {/* <div className="h-screen w-full left-0 top-0 right-0 absolute z-60 select-none pointer-events-none flex justify-center">
              <div className="absolute bottom-0 md:bottom-30 lg:bottom-20 xl:bottom-30 h-20 left-0 right-0 w-full">
                <h1 ref={introText1} className="absolute uppercase font-bold w-full text-center text-4xl text-white z-30 opacity-0" style={{ fontFamily: "Balgin, sans-serif" }}>
                  A quiet statement perched above the tides of time.
                </h1>
                <h1 ref={introText2} className="absolute uppercase font-bold w-full text-center text-4xl text-white z-30 opacity-0" style={{ fontFamily: "Balgin, sans-serif" }}>
                  Where the sea tells its secrets
                </h1>
                <div
                  ref={scrollIndicator}
                  className="scroll-indicator absolute w-full flex flex-col items-center opacity-0 cursor-pointer pointer-events-auto z-40"
                  onClick={() => gsap.to(window, { duration: 2, scrollTo: section2.current, ease: "power3.inOut" })}
                >
                  <p className="uppercase font-bold w-full text-center text-2xl text-white">Scroll</p>
                  <div className="flex flex-col -space-y-5">
                    <svg className="w-7 h-7 xl:w-8 xl:h-8" fill="white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                    <svg className="w-7 h-7 xl:w-8 xl:h-8" fill="white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
            <h1
              ref={midText}
              className="absolute bottom-[75vh] left-1/2 -translate-x-1/2 font-bold text-5xl text-[#ffffff] opacity-0 text-center w-full z-50"
              style={{ fontFamily: "Balgin, sans-serif" }}
            >
              A DREAM IN BANDRA
            </h1>
            </div> */}
          </section>

          {/* --- SECTION 2: MID --- */}
          {/* ✅ FIX: Changed 'z-[-10]' to 'z-0' so it isn't hidden behind the background */}
          <section ref={section2} className="w-full h-auto relative -mb-[20vh] z-0">
            <video ref={midVideo} autoPlay loop muted playsInline className="w-full object-cover">
              <source src="/video/newcenter2.mp4" />
            </video>
          </section>

          {/* --- SECTION 3: BOTTOM --- */}
          {/* ✅ FIX: 'z-20' ensures it sits on top of both Section 1 and Section 2 */}
          <section ref={section3} className="w-full h-auto relative overflow-hidden z-20">
            <div
              ref={bottomLogo}
              className="absolute top-120 max-md:top-55 max-lg:top-100 3xl:top-230 4xl:top-380 3xl:text-7xl 4xl:text-9xl left-1/2 overflow-hidden -translate-x-1/2 text-5xl max-md:text-2xl max-lg:text-2xl text-black font-bold text-center z-30 opacity-0 mt-10"
            >
              <img src="/images/logo.png" alt="Logo" className="h-20 w-auto max-md:h-10 max-lg:h-10 3xl:h-30 4xl:h-60 mx-auto mb-4" />
              <p>CLIFF TOWER</p>
            </div>

            <div className="relative w-full">
              <img
              ref={skyImage}
              src="/images/SkyToBuilding1.2.png" alt="Cliff Tower Image" className="w-full" />
            </div>
            
              {/* Navbar Wrapper */}
            <div 
              // ✅ FIX: Changed 'top-0' to 'bottom-10' (or bottom-0)
              // This pins the navbar to the bottom of the section.
              className="absolute bottom-5 max-md:bottom-2 max-lg:bottom-2 left-0 w-full 4xl:bottom-20 px-10 z-50"
            >
                <NavigationBar className="bottom-nav opacity-0 3xl:scale-150 4xl:scale-250 " />
            </div>
          </section>

        </div>
      </Loader>
    </>
  );
};

export default Home2;