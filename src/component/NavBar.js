import { Container, Navbar } from "react-bootstrap";
import { useContext } from "react";
import UserContext from "../UserContext";
// import Logout from "../pages/Logout";
import { Link } from "react-router-dom";


export default function NavBar () {
    
    const {user, setUser} = useContext(UserContext);

    return (
        <Navbar className="bg-dark">
            <Container>
                <Navbar.Brand as={Link} to="/" className="text-light" style={{fontWeight: 'bold'}}>{user.userName}</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    {user.id?
                    <Navbar.Text as={Link} to="/logout" style={{color: '#A8B306'}}>Sign out</Navbar.Text>
                    :
                    <>
                    <Navbar.Text className="mx-auto">Register</Navbar.Text>
                    <Navbar.Text className="mx-auto">Login</Navbar.Text>
                    </>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
      );

}