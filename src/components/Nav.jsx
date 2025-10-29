import { forwardRef } from 'react';
import { IoHomeOutline } from "react-icons/io5";
import { MdOutline360, MdOutlineInventory } from "react-icons/md";
import { GrGallery } from "react-icons/gr";
import { FloorPlanIcon } from "./Icons";
import { TbStack } from "react-icons/tb";
import { LuMapPin } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';

const NavigationBar = forwardRef(({ 
  className = "",
  iconSize = "text-xl xl:text-2xl",
  gap = "gap-5",
  padding = "p-2 py-2 xl:p-4",
  bgColor = "bg-white",
  textColor = "text-gray-500",
  position = "absolute bottom-[0.3vw] left-1/2 -translate-x-1/2",
  showIcons = {
    home: true,
    inventory: true,
    view360: true,
    gallery: true,
    floorPlan: true,
    amenities: true,
    location: true
  }
}, ref) => {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div
      ref={ref}
      className={`${position} z-50 opacity-0  flex ${gap} xl:gap-15 xl:px-6 items-center ${padding} rounded-xs ${bgColor} ${textColor} ${className}`}
    >
      {showIcons.home && (
        <IoHomeOutline 
        title="Home"
          onClick={() => handleNavigation('/')}
          className={`hover:scale-110 hover:-translate-y-2 hover:cursor-pointer transition-all  ${iconSize}`} 
        />
      )}
      {showIcons.inventory && (
        <MdOutlineInventory 
        title="Features"
          onClick={() => handleNavigation('/inventory')}
          className={`hover:scale-110 hover:-translate-y-2 hover:cursor-pointer transition-all text-xl xl:text-2xl ${iconSize}`} 
        />
      )}
      {showIcons.view360 && (
        <MdOutline360
        title="Drone views" 
          onClick={() => handleNavigation('/360-view')}
          className={`hover:scale-110 hover:-translate-y-2 hover:cursor-pointer transition-all text-xl xl:text-2xl ${iconSize}`} 
        />
      )}
      {showIcons.gallery && (
        <GrGallery 
        title="Gallery"
          onClick={() => handleNavigation('/gallery')}
          className={`hover:scale-110 hover:-translate-y-2 hover:cursor-pointer transition-all text-xl xl:text-2xl ${iconSize}`} 
        />
      )}
      {showIcons.floorPlan && (
        <FloorPlanIcon 
        title="Floor Plan"
          onClick={() => handleNavigation('/floorplan')}
          className="hover:scale-110 hover:-translate-y-2 hover:cursor-pointer transition-all h-5 xl:h-7" 
        />
      )}
      {showIcons.amenities && (
        <TbStack 
        title='Amenities'
          onClick={() => handleNavigation('/amenities')}
          className={`hover:scale-110 hover:-translate-y-2 hover:cursor-pointer transition-all text-xl xl:text-2xl ${iconSize}`} 
        />
      )}
      {showIcons.location && (
        <LuMapPin 
        title="Map"
          onClick={() => handleNavigation('/location')}
          className={`hover:scale-110 hover:-translate-y-2 hover:cursor-pointer transition-all text-xl xl:text-2xl ${iconSize}`} 
        />
      )}
    </div>
  );
});

NavigationBar.displayName = 'NavigationBar';

export default NavigationBar;
