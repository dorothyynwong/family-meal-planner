import './App.scss'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Home';
import Layout from './Components/Layout/Layout';
import Recipes from './Pages/Recipes/Recipes';
function App() {

  return (
    <Layout>
      <Router>
        <Routes>
          <Route path="/"
            element={<Home />} />
          <Route path="/recipes"
            element={<Recipes />} />
        </Routes>
      </Router>
    </Layout>
  )
}

export default App
