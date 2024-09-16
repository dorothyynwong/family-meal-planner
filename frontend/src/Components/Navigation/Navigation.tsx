import { Container, Nav, Navbar } from "react-bootstrap";
import logo from '../../Assets/watermelon.png';

const Navigation: React.FC = () => {
    return (
        <Navbar  expand="lg">
            <Container className="custom-navbar-container">
                <Navbar.Brand href="home">
                <img src={logo} alt="Family Meal Planner" style={{ height: '100px' }} />
                </Navbar.Brand>
                <Nav className="custom-navbar-links">
                    <Nav.Link className="custom-nav-link" href="home">Home</Nav.Link>
                    <Nav.Link className="custom-nav-link" href="recipes">Recipes</Nav.Link>
                    <Nav.Link className="custom-nav-link" href="meals">Meals</Nav.Link>
                    <Nav.Link className="custom-nav-link" href="shopping-list">Shopping List</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Navigation;
