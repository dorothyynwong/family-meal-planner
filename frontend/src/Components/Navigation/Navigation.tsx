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

    const handleClick = (event: { currentTarget: { id: string } }) => {
        const targetId = event.currentTarget.id;

        switch(targetId)
        {
            case "home":
                navigate('/home');
                break;
            case "recipes":
                navigate('/recipes');
                break;
            case "meals":
                navigate('/meal-plans');
                break;
            case "shoppingList":
                navigate('/shopping-list');
                break;
        }
        setIsOpen(false);

    }

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
                    <Nav.Link id="home" className="custom-nav-link" onClick={handleClick}>Home</Nav.Link>
                    <Nav.Link id="recipes" className="custom-nav-link" onClick={handleClick}>Recipes</Nav.Link>
                    <Nav.Link id="meals" className="custom-nav-link" onClick={handleClick}>Meals</Nav.Link>
                    <Nav.Link id="shoppingList" className="custom-nav-link" onClick={handleClick}>Shopping List</Nav.Link>
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
