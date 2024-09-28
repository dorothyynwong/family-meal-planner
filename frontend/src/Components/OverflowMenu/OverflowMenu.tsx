import { ReactElement, useState } from "react";
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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
                slotProps={{
                    paper: { className: "more-options-menu" }
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