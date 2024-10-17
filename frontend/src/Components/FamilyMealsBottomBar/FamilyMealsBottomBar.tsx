import { AppBar, Box, Fab, IconButton, styled, Toolbar } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  });

const FamilyMealsBottomBar: React.FC = () => {
    return (<>
        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
                <StyledFab color="secondary" aria-label="add">
                    <AddIcon />
                </StyledFab>
                <Box sx={{ flexGrow: 1 }} />
            </Toolbar>
        </AppBar>
    </>)
}

export default FamilyMealsBottomBar;