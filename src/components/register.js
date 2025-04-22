import React, { useState } from 'react';
import { submitRegister } from '../actions/authActions';
import { useDispatch } from 'react-redux';
import { Form, Button, Alert } from 'react-bootstrap';

function Register() {
    const [details, setDetails] = useState({
        name: '',
        username: '',
        password: ''
    });
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();

    const updateDetails = (event) => {
        setDetails({
          ...details,
            [event.target.id]: event.target.value
        });
    };

    const register = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }
        
        if (details.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        
        setError('');
        setValidated(true);
        dispatch(submitRegister(details));
    };

    return (
        <div className="register-container">
            {error && <Alert variant="danger">{error}</Alert>}
            <Form noValidate validated={validated} onSubmit={register} className='register-form bg-dark text-light p-4 rounded'>
                <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                        onChange={updateDetails} 
                        value={details.name} 
                        type="text" 
                        placeholder="Name" 
                        required 
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide your name.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="username" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        onChange={updateDetails} 
                        value={details.username} 
                        autoComplete="username" 
                        type="email" 
                        placeholder="Enter email" 
                        required 
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid email.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        onChange={updateDetails} 
                        value={details.password} 
                        autoComplete="new-password" 
                        type="password" 
                        placeholder="Password" 
                        required 
                        minLength="6"
                    />
                    <Form.Control.Feedback type="invalid">
                        Password must be at least 6 characters long.
                    </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit">Register</Button>
            </Form>
        </div>
    );
}

export default Register;