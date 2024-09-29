import './App.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Layout from './Components/Layout/Layout';
import Recipes from './Pages/Recipes/Recipes';
import RecipeDetails from './Pages/RecipeDetails/RecipeDetails';
import RecipesList from './Pages/RecipesList/RecipesList';
import RecipeCreation from './Pages/RecipeCreation/RecipeCreation';
import RecipeUpdate from './Pages/RecipeUpdate/RecipeUpdate';

function App() {

  return (
    <Layout>
      <Router>
        <Routes>
          <Route path="/"
            element={<Home />} />
          <Route path="/recipes"
            element={<Recipes />} />

          <Route path="/recipes-list/:userId"
            element={<RecipesList />} />

          <Route path="/recipe-add/:recipeId"
            element={<RecipeCreation />} />

          <Route path="/recipe-add"
            element={<RecipeCreation />} />

          <Route path="/recipe-details/:recipeId"
            element={<RecipeDetails />} />

          <Route path="/recipe-edit/:recipeId"
            element={<RecipeUpdate />} />
        </Routes>
      </Router>
    </Layout>
  )
}

export default App
