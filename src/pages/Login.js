import { useState, useEffect, useContext } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import UserContext from '../UserContext';
import { Link } from 'react-router-dom';

export default function Login () {

    const { user, setUser } = useContext(UserContext);
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isEmpty, setIsEmpty] = useState(true);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    const navigate = useNavigate();

    async function authenticate(event){

        setIsLoginLoading(true);

        event.preventDefault();

        await fetch(`${process.env.REACT_APP_API_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: userName, 
                password: password
            })
        })
        .then(result => result.json())
        .then(data => {
            if(typeof data.access !== 'undefined'){

                localStorage.setItem('token', data.access)
                getUserDetails(data.access);
                setMessage('Login Successful. Please wait a moment.')
                setIsError(false);
                navigate('/')

            }
            else{
                setIsError(true);
                setMessage(data);
            }
        })
        setIsLoginLoading(false);
        
        
    }

    function getUserDetails (token){
        fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
            headers: {Authorization: `Bearer ${token}`}
        })
        .then(result => result.json())
        .then(data => {
            setUser({
                id: data._id,
                userName: data.userName,
                isAdmin: data.isAdmin
            })
        })
    }

    useEffect(() => {
        if(userName !== '' && password !== '' ){
            setIsEmpty(false);
        }
        else{
            setIsEmpty(true);
        }
    }, [userName, password])


    return(
        <Row className="justify-content-center align-items-center" style={{minHeight: '100vh'}}>
            <Col md={5} className="mx-auto align-items-center">
            <Form onSubmit={e => authenticate(e)}>
                <Form.Group className='m-3'>
                    <Form.Control 
                        type = "text"
                        placeholder = "Enter username"
                        value = {userName}
                        onChange = {e => setUsername(e.target.value)}
                        required
                        className='border-5'
                    />
                </Form.Group>
                <Form.Group className='m-3'>
                    <Form.Control 
                        type = "password"
                        placeholder = "Enter password"
                        value = {password}
                        onChange = {e => setPassword(e.target.value)}
                        required
                        className='border-5'
                    />
                </Form.Group>
                <Form.Group className="d-flex justify-content-center m-3">
                    {isEmpty?
                        <Button variant="dark" disabled>Login</Button>
                        :
                        <>
                        {isLoginLoading?
                        <Spinner animation="border" size="sm"/>
                        :
                        <Button variant="dark"  type="submit">Login</Button>
                        }
                        </>
                    }
                    
                </Form.Group>
                {isError?
                <div className='d-flex text-danger justify-content-center'>
                    {message}
                </div>
                :
                <div className='d-flex text-success justify-content-center'>
                    {message}
                </div>
                }
            </Form>
            <Row className='text-light text-center'>
                <Col xm={1}>
                    <Link to="/register">Register here</Link>
                </Col>
            </Row>
            </Col>
        </Row>
    )

}