import { ReactElement, useState } from "react";
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface OverflowMenuProps {
    menuItems: ReactElement[];
    handleOptionsClick?: (option: string) => void;
}

const OverflowMenu: React.FC<OverflowMenuProps> = ({menuItems, handleOptionsClick}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                    paper: { className: "more-options-menu" }
                }}
            >
                {menuItems.map((menuItem, index) => (
                    <MenuItem key={index} onClick={() => {handleOptionsClick?.(menuItem.props.id); handleClose();}}>
                        {menuItem}
                    </MenuItem>
                ))}

            </Menu>
        </div>
    );
}

export default OverflowMenu;