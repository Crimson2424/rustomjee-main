import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import Scene from "./Scene";
import { Environment, Preload } from "@react-three/drei";
import Loader from "./LoaderMap";
import { PathsProvider } from "./PathsContext";
import UIButtons from "./UiButtons";
import OrientationGuard from "./OrientationGaurd";
import Disclaimer from "./Disclaimer";
import MusicController from "./MusicController";
import MobileOrientationAndFullscreen from "./MobileOrientationAndFullscreen";

const Experience = () => {
  const [deviceReady, setDeviceReady] = useState(false);
  const [started, setStarted] = useState(false);
  const navigate = useNavigate(); // Add this hook

  const handleClose = () => {
    navigate("/home"); // Navigate to home page
  };

  return (
    <>
      {/* CLOSE BUTTON - Always visible */}
      <button
        onClick={handleClose}
        className="fixed top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 group"
        aria-label="Close and return to home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white group-hover:scale-110 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* 1. MOBILE FULLSCREEN + ORIENTATION HANDLER */}
      {!deviceReady && (
        <MobileOrientationAndFullscreen onReady={() => setDeviceReady(true)} />
      )}

      {deviceReady && !started && (
        <Disclaimer onStart={() => setStarted(true)} />
      )}

      {/* AFTER START → RENDER EVERYTHING */}
      {deviceReady && started && (
        <PathsProvider>
          {/* <MusicController play={true} /> */}
          <UIButtons />

          <div className="h-screen w-screen">
            <Loader />

            <Canvas
              camera={{
                position: [80, 120, 200],
                fov: 50,
                near: 10,
                far: 9500,
              }}
              dpr={[0.5, 2]}
              shadows
            >
              <color attach="background" args={["#7fa4c9"]} />
              <fog attach="fog" args={["#7fa4c9", 3000, 9000]} />
              <Environment preset="city" />

              <Suspense fallback={null}>
                <Scene />
                <Preload all />
              </Suspense>
            </Canvas>
          </div>
        </PathsProvider>
      )}
    </>
  );
};

export default Experience;