import {  useState } from "react";
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import "./OverflowMenu.scss";
interface MenuItemType {
    id: string;
    label: string; // Add label for the display text
}

interface OverflowMenuProps {
    menuItems: MenuItemType[];
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
                // slotProps={{
                //     paper: { className: "overflow-menu" }
                //   }}
                sx={{
                    '& .MuiPaper-root': {
                        backgroundColor: '#8E9D76', 
                    }
                }}
            >
                {menuItems.map(({ id, label }) => (
                    <MenuItem key={id} onClick={() => { handleOptionsClick?.(id); handleClose(); }}>
                        {label} 
                    </MenuItem>
                ))}

            </Menu>
        </div>
    );
}

export default OverflowMenu;