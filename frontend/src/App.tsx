import './App.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Home';
import Layout from './Components/Layout/Layout';

function App() {

  return (
    <Layout>
      <Router>
        <Routes>
          <Route path="/"
            element={<Home />} />
        </Routes>
      </Router>
    </Layout>
  )
}

export default App
