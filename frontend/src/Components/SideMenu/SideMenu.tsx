import "./SideMenu.scss";
import { useState } from "react";
import SideMenuToggleButton from "./SideMenuToggleButton";
import Navigation from "../Navigation/Navigation";


const SideMenu:React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <SideMenuToggleButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
            <div className={isOpen? "side-menu-show" : "side-menu-hidden"} id="side-menu" data-testid="side-menu">
                <Navigation />
            </div>
        </>
    );
};

export default SideMenu;
