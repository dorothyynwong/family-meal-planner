import React, { useEffect, useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import "./MoreOptionsMenu.scss";

export interface MoreOptionsMenuProps {
    menuType: string;
    id?: number;
}

const MoreOptionsMenu: React.FC<MoreOptionsMenuProps> = ({ menuType, id }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOptions, setMenuOptions] = useState<string[]>();
    const [recipeId, setRecipeId] = useState<number>();
    const navigate = useNavigate();
    useEffect(() => {
        switch (menuType) {
            case "recipeCard":
                setMenuOptions(["Details", "Edit", "Delete"]);
                break;
            case "recipeDetails":
                    setMenuOptions(["Edit", "Delete"]);
                    break;
            default:
                setMenuOptions([]); 
                break;
        }
        setRecipeId(id);

    }, [menuType, id]); 

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget); 
    };

    const handleClose = () => {
        setAnchorEl(null); 
    };

    const handleOptionClick = (option: string) => {
        switch(menuType)
        {
            case "recipeCard":
                switch(option)
                {
                    case "Details":
                        navigate(`/recipe-details/${recipeId}`)
                }
                break;
            default:
                break;

        }
        handleClose(); 
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
                    paper: {className: "more-options-menu"}
                }}
            >
                {menuOptions?.map((menuOption, index) => (
                    <MenuItem 
                        key={`menu-${index}`} 
                        onClick={() => handleOptionClick(menuOption)}>
                            {menuOption}
                    </MenuItem>
                )

                )}

            </Menu>
        </div>
    );
};

export default MoreOptionsMenu;
