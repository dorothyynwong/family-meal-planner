import { Button, Container, Nav, Navbar } from "react-bootstrap";
import logo from '../../Assets/watermelon.png';
import { useAuth } from "../AuthProvider/AuthProvider";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
    setIsOpen: (newOpen: boolean)=>void;
}

const Navigation: React.FC<NavigationProps> = ({setIsOpen}) => {
    const { isAuthenticated, logUserOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logUserOut();
        setIsOpen(false);
        navigate("/");
    }

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
                        <Button onClick={handleLogout}>Logout</Button>
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
