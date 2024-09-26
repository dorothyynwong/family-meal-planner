import './App.scss'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Home';
import Layout from './Components/Layout/Layout';
import Recipes from './Pages/Recipes/Recipes';
import NewRecipe from './Pages/NewRecipe/NewRecipe';
import RecipeDetails from './Pages/RecipeDetails/RecipeDetails';


function App() {

  return (
    <Layout>
      <Router>
        <Routes>
          <Route path="/"
            element={<Home />} />
          <Route path="/recipes"
            element={<Recipes />} />
          <Route path="/new-recipe"
            element={<NewRecipe />} />
          <Route path="/recipe-details/:id" element={<RecipeDetails />} />
        </Routes>
      </Router>
    </Layout>
  )
}

export default App
