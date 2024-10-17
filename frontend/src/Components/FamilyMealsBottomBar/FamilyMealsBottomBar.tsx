import { AppBar, Box, Fab, IconButton, styled, Toolbar } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useMeal } from "../MealContext/MealContext";
import MealForm from "../MealForm/MealForm";

const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  });

const FamilyMealsBottomBar: React.FC = () => {
    const { modalShow, setModalShow, setMode } = useMeal();
    
    const handleClick = () => {
        setMode("Add");
        setModalShow(true);
    }

    return (
        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
                <StyledFab color="secondary" aria-label="add">
                    <AddIcon onClick={handleClick} />
                </StyledFab>
                <Box sx={{ flexGrow: 1 }} />
            </Toolbar>
        </AppBar>
    )
}

export default FamilyMealsBottomBar;