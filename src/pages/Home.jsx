import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from "../components/SmoothScroll";
import { ScrollToPlugin } from "gsap/all";
import ReactLenis from "lenis/react";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutline360, MdOutlineInventory } from "react-icons/md";
import { GrGallery } from "react-icons/gr";
import { FloorPlanIcon } from "../components/Icons";
import { TbStack } from "react-icons/tb";
import { LuMapPin } from "react-icons/lu";
import Loader from "../components/Loader";
import OrientationLock from "../components/OrientationLock";
import NavigationBar from "../components/Nav";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const Home = () => {
  const videoRef = useRef(null);
  const video2Ref = useRef(null);
  const container = useRef(null);
  const midvidsection = useRef();
  const textRef = useRef(null);
  const midVideoRef = useRef(null);
  const bottomDiv = useRef();
  const imageRef = useRef();
  const bottomAnimateLogo = useRef();
  const endAnimateLogo = useRef();
  const [scrollEnabled, setScrollEnabled] = useState(false);

  useGSAP(
    () => {
      if (videoRef.current) {
        videoRef.current.play().catch((err) => {
          console.log("Video autoplay prevented", err);
        });
      }

      // Disable scroll initially
      document.body.style.overflow = "hidden";

      const logo = container.current?.querySelector(".logo img");
      const text1 = container.current?.querySelector(".text-1");
      const text2 = container.current?.querySelector(".text-2");
      const scrollIndicator =
        container.current?.querySelector(".scroll-indicator");

      if (!text1 || !text2 || !scrollIndicator) {
        return;
      }

      // Create sequential timeline
      const tl = gsap.timeline({
        onComplete: () => {
          // Enable scroll when animation completes
          document.body.style.overflow = "auto";
          setScrollEnabled(true);

          // Play second video when scrolling is enabled
          if (video2Ref.current) {
            video2Ref.current.play().catch((err) => {
              console.log("Video 2 autoplay prevented", err);
            });
          }
        },
      });

      // Logo fade in
      tl.fromTo(
        logo,
        { opacity: 0 },
        { opacity: 1, duration: 2, delay:1, ease: "power1.inOut" }
      )
        // First text - fade in
        .fromTo(
          text1,
          { opacity: 0 },
          { opacity: 1, duration: 1.5, ease: "power1.inOut" },
          "+=0.3"
        )
        // First text - fade out
        .to(text1, { opacity: 0, duration: 1.5, ease: "power1.inOut" }, "+=1")
        // Second text - fade in
        .fromTo(
          text2,
          { opacity: 0 },
          { opacity: 1, duration: 1.5, ease: "power1.inOut" },
          "+=0.2"
        )
        // Second text - fade out
        .to(text2, { opacity: 0, duration: 1.5, ease: "power1.inOut" }, "+=1")
        // Scroll indicator - fade in and stays
        .fromTo(
          scrollIndicator,
          { opacity: 0 },
          { opacity: 1, duration: 1.5, ease: "power1.inOut" },
          "+=0.2"
        );
    },
    { scope: container }
  );

  // Mid section text animation with ScrollTrigger
  useEffect(() => {
    if (!scrollEnabled || !textRef.current || !midvidsection.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: midvidsection.current,
            start: "top 20%", // Animation starts when top of section is 80% down the viewport
            end: "bottom 30%", // Animation ends when top of section is 30% down the viewport
            scrub: 1, // Smooth scrubbing effect
            markers: false, // Set to true for debugging
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [scrollEnabled]);

  const width = window.innerWidth;

  let scaleValue;
  let yValue;

  if (width >= 1280) {
    scaleValue = 1.06;
    yValue = -90;
  } else if (width >= 1024) {
    scaleValue = 1.05;
    yValue = -75;
  } else if (width >= 640) {
    scaleValue = 1.03;
    yValue = -30;
  } else {
    scaleValue = 1.07;
    yValue = -90;
  }

  useEffect(() => {
    if (
      !scrollEnabled ||
      !bottomDiv.current ||
      !bottomAnimateLogo.current ||
      !imageRef.current ||
      !endAnimateLogo.current
    )
      return;

    const ctx = gsap.context(() => {
      // 💡 This prevents the flash
      gsap.set(bottomAnimateLogo.current.querySelectorAll("*"), {
        opacity: 0,
        y: 100,
        scale: 0.9,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: bottomDiv.current,
          start: "top bottom", // timeline starts here     /for big screen 50% 80%
          end: "bottom bottom", // timeline ends here
          scrub: 10, // scrub entire timeline
          markers: false, // for debugging
        },
      });

      tl.to(bottomAnimateLogo.current.querySelectorAll("*"), {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "power2.inOut",
        duration: 4,
        stagger: 2,
      })
        .to(
          bottomAnimateLogo.current.querySelectorAll("*"),
          {
            
            yPercent: -300,
            ease: "linear",
            duration: 2,
            stagger: 2,
          },
          ">0.2"
        )
        .to(
          bottomAnimateLogo.current.querySelectorAll("*"),
          {
            opacity: 0,
            ease: "linear",
            duration: 2,
            stagger: 2,
          },
          "<" // runs at the same time as the previous tween
        )
        .to(
          imageRef.current,
          {
            scale: scaleValue,  //1.05
            y: yValue,  //90
            ease: "power2.inOut",
            duration: 1.5,
          },
          ">0.2"
        )
        .fromTo(
          endAnimateLogo.current,
          {
            opacity: 0,
            yPercent: 100,
          },
          {
            opacity: 1,
            yPercent: 0,
            ease: "power2.out",
            duration: 1.5,
          },
          ">0.2"
        );
    });

    return () => ctx.revert();
  }, [scrollEnabled]);

  return (
    <>
    <OrientationLock />
      <Loader>
        {scrollEnabled && <ReactLenis root options={{ duration: 3 }} />}
        <div
          ref={container}
          className="w-full h-[196vw] overflow-hidden relative "
        >
          {/* full body image in background */}
          <img
            ref={imageRef}
            src="images/full-body.jpg"
            className=" w-screen bg-no-repeat bg-cover bg-center absolute -z-100 origin-[center_150vw]"
            alt=""
          />
          {/* Logo - Fixed within hero section */}
          <div className="logo absolute top-1 xl:top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <img
              src="/images/logo.svg"
              alt="Rustomjee"
              className="h-12 xl:h-18 w-auto opacity-0
          
            "
            />
          </div>

          {/* Sequential Text at Bottom */}
          <div className="h-screen w-full left-0 top-0 right-0 absolute z-50 select-none">
            <div className="absolute bottom-0 md:bottom-26 lg:bottom-30 xl:bottom-10 h-20 left-0 right-0 flex justify-center ">
              <h1
                className="text-1 absolute text-xl lg:text-2xl  xl:text-4xl uppercase font-bold text-center px-8 opacity-0"
                style={{ fontFamily: "Balgin, sans-serif", color: "white" }}
              >
                A quiet statement perched above the tides of time.
              </h1>

              <h1
                className="text-2 absolute text-xl lg:text-2xl  xl:text-4xl uppercase font-bold text-center px-8 opacity-0"
                style={{ fontFamily: "Balgin, sans-serif", color: "white" }}
              >
                Where the sea tells its secrets
              </h1>

              <div
                onClick={() => {
                  gsap.to(window, {
                    duration: 2, // how long the scroll should take
                    scrollTo: midvidsection.current, // can also use {y: targetRef.current, offsetY: 50}
                    ease: "power3.inOut", // smooth easing
                  });
                }}
                className={`scroll-indicator absolute bottom-0 flex flex-col md:bottom-0  lg:bottom-0 xl:-bottom-9 items-center opacity-0 cursor-pointer ${
                  !scrollEnabled && "pointer-events-none "
                } `}
              >
                <p
                  className="text-2xl lg:text-3xl xl:text-4xl  uppercase font-bold mb-1"
                  style={{ fontFamily: "Balgin, sans-serif", color: "white" }}
                >
                  Scroll
                </p>
                <div className="flex flex-col -space-y-3">
                  <svg
                    className="w-7 h-7 xl:w-10 xl:h-10"
                    fill="white"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg
                    className="w-7 h-7 xl:w-10 xl:h-10"
                    fill="white"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="relative ">
            <div className="bg-gradient-to-b absolute translate-y-full left-0 w-full bottom-0 from-[#C0B8AF] to-transparent h-10 z-10"></div>
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className=" top-0 left-0 w-full object-cover -z-1 "
            >
              <source src="/video/beachfinal2.mp4" type="video/mp4" />
            </video>

            {/* //Mid-section */}
            <div
              ref={midvidsection}
              className="overflow-hidden -translate-y-[0.7vw] absolute w-full h-full -z-100 "
            >
              <video
                ref={midVideoRef}
                autoPlay
                loop
                muted
                playsInline
                className="w-full"
              >
                <source src="/video/newcenter2.mp4" />
              </video>
              {/* Text on Left Side - Vertically Centered */}
              <div className="absolute h-[10vw] left-8 lg:left-15 top-1/2 -translate-y-1/2 z-40">
                <h1
                  ref={textRef}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl  uppercase font-bold"
                  style={{
                    fontFamily: "Balgin, sans-serif",
                    color: "#1d2938",
                  }}
                >
                  A DREAM
                  <br />
                  IN BANDRA
                </h1>
              </div>
            </div>

            <div className="w-full h-fit translate-y-[calc(100%-0.7vw)] absolute bottom-0 z-50 ">
              <img
                src="/images/overlay1.png"
                alt="Overlay Top"
                className="w-full h-full mask-alpha bg-no-repeat bg-cover"
              />
            </div>
          </div>

          {/* Logo and Text - Center (for intro animation) */}
          <div
            ref={bottomDiv}
            className="w-full h-screen absolute bottom-0 z-500 "
          >
            <div
              ref={bottomAnimateLogo}
              className="end-logo absolute h-[12vw] sm:h-[22vw] md:h-[20vw] lg:h-[10vw] xl:h-[26vw] lg:top-45 top-8 md:top-35 left-1/2 -translate-x-1/2 -translate-y-1/2  opacity-100 flex flex-col items-center"
            >
              <img
                src="/images/logo.png"
                alt="Rustomjee"
                className="h-10 md:h-20 w-auto"
              />
              <h1
                className="end-text text-2xl md:text-4xl uppercase font-bold tracking-wider opacity-100"
                style={{
                  fontFamily: "Balgin, sans-serif",
                  color: "#1d2938",
                }}
              >
                CLIFF TOWER
              </h1>
            </div>

            {/* Logo and Text - Top (appears after zoom) */}
            <NavigationBar ref={endAnimateLogo}/>
          </div>
        </div>
      </Loader>
    </>
  );
};

export default Home;
