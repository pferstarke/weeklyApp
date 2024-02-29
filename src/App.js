import './App.css';

import {BrowserRouter as Router} from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap'
import { useState, useEffect } from 'react';

import { UserProvider } from './UserContext';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Task from './pages/Task';
import Error from './pages/Error';
import NavBar from './component/NavBar';


function App() {

  const [user, setUser] = useState({
    id: localStorage.getItem('id'),
    userName: localStorage.getItem('userName'),
    isAdmin: localStorage.getItem('isAdmin')
  });

  const clearUser = () => {
    localStorage.clear();
  };

  useEffect (() => {
    fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
      headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    })
    .then(result => result.json())
    .then(data => {
      if(typeof data._id !== 'undefined'){
        setUser({
          id: data._id,
          userName: data.userName,
          isAdmin: data.isAdmin
        })
      }
      else{
        setUser({
          id: null,
          isAdmin: null
        })
      }
      
    })
    
  }, [])


  return (
    <UserProvider value = {{user, setUser, clearUser}} >
      <Router>
        {user.id? <NavBar /> : <></>}
        
        <Container fluid>
          <Routes>
              <Route exact path="/register" element={user.id? <Task /> : <Register />} />
              <Route exact path="/login" element={user.id ? <Task/> : <Login/>}/>
              <Route exact path="/" element={user.id ? <Task/> : <Login/>}/>
              <Route exact path="/logout" element={user.id? <Logout /> : <Error />} />
              <Route exact path="*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );

}

export default App;
