import React , { useContext } from 'react';
import { Button } from 'react-bootstrap';
import {Container,Nav,Navbar as ReactNavbar} from "react-bootstrap";
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import firebaseService from "../services/firebase";
const Navigation = () => {
    const {currentUser,isLoaded} = useContext(AuthContext);
    return (
        <ReactNavbar>
            <Container>
                <ReactNavbar.Brand href='/'>File Trans</ReactNavbar.Brand>
                <Nav className='me-auto'>
                    <Link to="/" className='nav-link'>Home</Link>
                    <Link to="/files" className='nav-link'>Files</Link>
                    <Link to="/sent" className='nav-link'>Send</Link>

                </Nav>
                <div className={isLoaded ? '' : 'd-none'}>
                        {
                        currentUser
                            ?
                            <Button variant="outline-danger" onClick={async () => await firebaseService.signOut()}>Se déconnecter</Button>
                            :
                            <Button variant="primary" onClick={async () => await firebaseService.signInWithGoogle()}>Se connecter</Button>
                        }
                </div>
            </Container>
        </ReactNavbar>
    );
};

export default Navigation;