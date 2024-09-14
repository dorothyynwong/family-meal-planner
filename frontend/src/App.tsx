import './App.scss'
import './styles/global.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Home';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/"
            element={<Home />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
