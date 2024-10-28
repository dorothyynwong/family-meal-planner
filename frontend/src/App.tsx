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

function App() {

  return (
    <AuthProvider>
      <MealProvider>

        <Router>
          <Layout>
            <Routes>
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

              <Route path="/login"
                element={<UserLoginPage />} />

              <Route path="/signup"
                element={<UserSignupPage />} />

              <Route path="/families"
                element={<Families />} />

              <Route path="/my-families"
                element={<FamiliesList data={[]} />} />

              <Route path="/family-meals"
                element={<FamilyMealDaily />} />

              <Route path="/school-menu-edit"
                element={<SchoolMenuEdit />} />

            </Routes>
          </Layout>
        </Router>

      </MealProvider>
    </AuthProvider>
  )
}

export default App