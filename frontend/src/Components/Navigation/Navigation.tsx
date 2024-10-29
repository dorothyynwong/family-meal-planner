import { Button, Container, Nav, Navbar } from "react-bootstrap";
import logo from '../../Assets/familyfeast.png';
import { useAuth } from "../AuthProvider/AuthProvider";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
    setIsOpen: (newOpen: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ setIsOpen }) => {
    const { isAuthenticated, logUserOut } = useAuth();

    const navigate = useNavigate();

    const handleClick = (event: { currentTarget: { id: string } }) => {
        const targetId = event.currentTarget.id;

        switch (targetId) {
            case "home":
                navigate('/home');
                break;
            case "recipes":
                navigate('/recipes');
                break;
            case "meals":
                navigate('/meal-plans');
                break;
            case "family-meals":
                navigate('/family-meals');
                break;
            case "families":
                navigate('/families');
                break;
            case "login":
                navigate('/login');
                break;
            case "signup":
                navigate('/signup');
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
                    <img src={logo} alt="Family Meal Planner" style={{ height: '150px' }} />
                </Navbar.Brand>
                <Nav className="custom-navbar-links">
                    <Nav.Link id="home" className="custom-nav-link" onClick={handleClick}>Home</Nav.Link>
                    <Nav.Link id="recipes" className="custom-nav-link" onClick={handleClick}>Recipes</Nav.Link>
                    <Nav.Link id="meals" className="custom-nav-link" onClick={handleClick}>My Meals</Nav.Link>
                    <Nav.Link id="family-meals" className="custom-nav-link" onClick={handleClick}>Families' Meals</Nav.Link>
                    <Nav.Link id="families" className="custom-nav-link" onClick={handleClick}>Families</Nav.Link>
                    {
                        isAuthenticated ?
                        <Button className="custom-button w-100 mt-3" onClick={handleLogout}>Logout</Button> :
                        (   <>
                            <Button id="login" className="custom-button w-100 mt-3" onClick={handleClick}>Login</Button>
                            <Button id="signup" className="custom-button w-100 mt-3" onClick={handleClick}>Signup</Button>
                            </>
                        )
                    }
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Navigation;
