import {Row, Col, Form, Button} from 'react-bootstrap';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Register () {

    const [firstName, setFirstname] = useState('');
    const [lastName, setLastname] = useState('');
    const [userName, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [match, setMatch] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    function registerUser (e){
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/user/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                password: password1
            })
        })
        .then(result => result.json())
        .then(data => {
            if(data === "Successful registration"){
                setMessage(data);
                setIsError(false);
                navigate('/login');
            }
            else{
                setMessage(data);
                setIsError(true);
            }
            
        })
      
    }


    useEffect(() => {
        if(firstName !== '' && lastName !== '' && userName !== '' && password1 === password2 &&  password1 !== '' && password2 !== ''){
            setMatch(true);
        }
        else{
            setMatch(false);
        }
    }, [firstName, lastName, userName, password1, password2])


    return(
        <Row className="justify-content-center align-items-center" style={{minHeight: '100vh'}}>
            <Col md={5} className='align-items-center'>
                <Form onSubmit={e => registerUser(e)}>
                    <Form.Group className='m-3'>
                        <Form.Control 
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={e => setFirstname(e.target.value)}
                            required
                            className='border-5'
                        />
                    </Form.Group>
                    <Form.Group className="m-3">
                        <Form.Control 
                            type="text"
                            placeholder="Last name"
                            value={lastName}
                            onChange={e => setLastname(e.target.value)}
                            required
                            className='border-5'
                        />
                    </Form.Group>
                    <Form.Group className='m-3'>
                        <Form.Control 
                            type="text"
                            placeholder="User name"
                            value={userName}
                            onChange={e => setUsername(e.target.value)}
                            required
                            className='border-5'
                        />
                    </Form.Group>
                    <Form.Group className='m-3'>
                        <Form.Control 
                            type="password"
                            placeholder="Create password"
                            value={password1}
                            onChange={e => setPassword1(e.target.value)}
                            required
                            className='border-5'
                        />
                    </Form.Group>
                    <Form.Group className='m-3'>
                        <Form.Control 
                            type="password"
                            placeholder="Confirm password"
                            value={password2}
                            onChange={e => setPassword2(e.target.value)}
                            required
                            className='border-5'
                        />
                    </Form.Group>
                    <Form.Group className='d-flex m-3 justify-content-center'>
                        {match?
                            <Button variant="dark" type="submit">Register</Button>
                            :
                            <Button variant='dark' type="submit" disabled>Register</Button>
                        }
                    </Form.Group>
                    {isError?
                        <div className='d-flex justify-content-center text-danger'>
                            {message}
                        </div>
                        :
                        <div className='d-flex justify-content-center text-success'>
                            {message}
                        </div>
                    }
                </Form>
                <Row className='text-center'>
                    <Col xm={1}>
                        <Link to="/login">Sign in</Link>
                    </Col>
                </Row>
            </Col>
        </Row>
    )

}