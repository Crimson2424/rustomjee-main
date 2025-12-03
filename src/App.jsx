import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inventory from "./pages/Inventory";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Features from "./pages/Features";
import Map from "./pages/Map";
import ScrollToTop from "./components/ScrollToTop";
import OrientationLock from "./components/MobileOrientationAndFullscreen";
import MusicController from "./components/MusicController";
import HomeNav from "./pages/HomeNav";
import BackButtonHandler from "./components/BackButtonHandler ";

const App = () => {
  return (
    <OrientationLock>
      <MusicController play={true}/>
      <BrowserRouter>
        <ScrollToTop />
        <BackButtonHandler />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Main home with navbar - after close button */}
        <Route path="/home" element={<HomeNav />} />

          <Route path="/floorplan" element={<Inventory />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/features" element={<Features />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </BrowserRouter>
    </OrientationLock>
  );
};
export default App;
