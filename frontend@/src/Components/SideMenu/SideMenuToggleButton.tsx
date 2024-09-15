import "./SideMenu.scss";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";

interface ToggleButtonProps {
    isOpen: boolean;
    onClick: () => void;
}


const ToggleButton:React.FC<ToggleButtonProps> = ({isOpen, onClick}) => {
    return (
        <div className="side-menu-toggle-button">
        {isOpen?  <RxCross2 onClick={onClick} size="40"/> : <RxHamburgerMenu onClick={onClick} size="40"/>}
        </div>
    );
};

export default ToggleButton;
