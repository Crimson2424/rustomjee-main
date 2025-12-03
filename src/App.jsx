import { BrowserRouter, Route, Routes } from "react-router-dom"
import Inventory from "./pages/Inventory"
import Home from "./pages/Home"
import Gallery from "./pages/Gallery"
import Features from "./pages/Features"
import Map from "./pages/Map"
import ScrollToTop from "./components/ScrollToTop"


const App =()=>{
    return (
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
      <Route path="/" element={<Home/>} />
      
      <Route path="/floorplan" element={<Inventory />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/features" element= {<Features/>}/>
      <Route path="/map" element={<Map />} />
   
    </Routes>
      </BrowserRouter>
    )
}
export default App