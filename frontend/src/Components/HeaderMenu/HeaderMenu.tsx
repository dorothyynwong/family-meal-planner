import Avatar from "react-avatar";
import { useAuth } from "../AuthProvider/AuthProvider";
import { Link } from "react-router-dom";


const HeadMenu: React.FC = () => {
    const { nickname, avatarColor, avatarFgColor } = useAuth();

    return (
        <Link to={"/user-edit"} className="custom-nav-link">
            <Avatar name={nickname} color={avatarColor} fgColor={avatarFgColor} size="50" round={true} />
        </Link>
    );
};

export default HeadMenu;