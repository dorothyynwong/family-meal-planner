import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const MoreOptionsMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget); // Set the clicked element as the anchor
    };

    const handleClose = () => {
        setAnchorEl(null); // Close the menu
    };

    const handleOptionClick = (option: string) => {
        console.log(`You clicked on ${option}`);
        handleClose(); // Close the menu after clicking an option
    };

    return (
        <div>
            <IconButton onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl} // Set the anchor for the menu
                open={Boolean(anchorEl)} // Check if the menu should be open
                onClose={handleClose} // Handle menu close
            >
                <MenuItem onClick={() => handleOptionClick('Edit')}>Edit</MenuItem>
                <MenuItem onClick={() => handleOptionClick('Delete')}>Delete</MenuItem>
                <MenuItem onClick={() => handleOptionClick('Share')}>Share</MenuItem>
            </Menu>
        </div>
    );
};

export default MoreOptionsMenu;
