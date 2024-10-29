import './App.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Layout from './Components/Layout/Layout';
import Recipes from './Pages/Recipes/Recipes';
import RecipeDetails from './Pages/RecipeDetails/RecipeDetails';
import RecipesList from './Pages/RecipesList/RecipesList';
import RecipeCreation from './Pages/RecipeCreation/RecipeCreation';
import RecipeUpdate from './Pages/RecipeUpdate/RecipeUpdate';
import MealPlanMonthly from './Pages/MeaPlanlMonthly/MealPlanMonthly';
import { MealProvider } from './Components/MealContext/MealContext';
import UserLoginPage from './Pages/UserLoginPage/UserLoginPage';
import { AuthProvider } from './Components/AuthProvider/AuthProvider';
import UserSignupPage from './Pages/UserSignupPage/UserSignupPage';
import Families from './Pages/Families/Families';
import FamiliesList from './Pages/FamiliesList/FamiliesList';
import FamilyMealDaily from './Pages/FamilyMealDaily/FamilyMealDaily';
import SchoolMenuEdit from './Pages/SchoolMenuEdit/SchoolMenuEdit';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: "Fredoka", 
  },
  palette: {
    primary: {
      main: '#8E9D76',
      contrastText: '#000000'
    },
    secondary: {
      main: '#796C50',
      contrastText: '#FFFFFF'
    }
  }
});

function App() {

  return (
    <AuthProvider>
      <MealProvider>
        <ThemeProvider theme={theme}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login"
                element={<UserLoginPage />} />

              <Route path="/signup"
                element={<UserSignupPage />} />


              <Route element={<PrivateRoute />}>
                <Route path="/"
                  element={<Home />} />

                <Route path="/home"
                  element={<Home />} />
                <Route path="/recipes"
                  element={<Recipes />} />

                <Route path="/recipes-list/"
                  element={<RecipesList />} />

                <Route path="/recipe-add/:recipeId"
                  element={<RecipeCreation />} />

                <Route path="/recipe-add"
                  element={<RecipeCreation />} />

                <Route path="/recipe-details/:recipeId"
                  element={<RecipeDetails />} />

                <Route path="/recipe-edit/:recipeId"
                  element={<RecipeUpdate />} />

                <Route path="/meal-plans"
                  element={<MealPlanMonthly />} />

                <Route path="/families"
                  element={<Families />} />

                <Route path="/my-families"
                  element={<FamiliesList data={[]} />} />

                <Route path="/family-meals"
                  element={<FamilyMealDaily />} />

                <Route path="/school-menu-edit"
                  element={<SchoolMenuEdit />} />
              </Route>

            </Routes>
          </Layout>
        </Router>
        </ThemeProvider>
      </MealProvider>
    </AuthProvider>
  )
}

export default App