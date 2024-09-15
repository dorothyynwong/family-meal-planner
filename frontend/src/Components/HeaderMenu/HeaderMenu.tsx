import Avatar from "react-avatar";

interface HeadMenuProps {
    name: string;
}

const HeadMenu:React.FC<HeadMenuProps> = ({name}) => {
    return (
        <Avatar name={name} size="50" round={true} />
    );
};

export default HeadMenu;