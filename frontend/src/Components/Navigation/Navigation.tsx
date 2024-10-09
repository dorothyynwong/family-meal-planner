import { Container, Nav, Navbar } from "react-bootstrap";
import logo from '../../Assets/watermelon.png';
import { useAuth } from "../AuthProvider/AuthProvider";

const Navigation: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Navbar expand="lg">
            <Container className="custom-navbar-container">
                <Navbar.Brand href="home">
                    <img src={logo} alt="Family Meal Planner" style={{ height: '100px' }} />
                </Navbar.Brand>
                <Nav className="custom-navbar-links">
                    <Nav.Link className="custom-nav-link" href="/home">Home</Nav.Link>
                    <Nav.Link className="custom-nav-link" href="/recipes">Recipes</Nav.Link>
                    <Nav.Link className="custom-nav-link" href="/meal-plans/1">Meals</Nav.Link>
                    <Nav.Link className="custom-nav-link" href="/shopping-list">Shopping List</Nav.Link>
                    {
                        isAuthenticated &&
                        <Nav.Link className="custom-nav-link" href="/">Logout</Nav.Link>
                    }
                    {
                        !isAuthenticated &&
                        <>
                            <Nav.Link className="custom-nav-link" href="/login">Login</Nav.Link>
                            <Nav.Link className="custom-nav-link" href="/signup">Signup</Nav.Link>
                        </>
                        
                    }
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Navigation;
