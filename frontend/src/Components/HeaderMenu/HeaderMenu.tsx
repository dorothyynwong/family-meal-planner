import Avatar from "react-avatar";
import { useAuth } from "../AuthProvider/AuthProvider";


const HeadMenu:React.FC = () => {
    const {nickname, avatarColor, avatarFgColor} = useAuth();
    
    return (
        <Avatar name={nickname} color={avatarColor} fgColor={avatarFgColor} size="50" round={true} />
    );
};

export default HeadMenu;