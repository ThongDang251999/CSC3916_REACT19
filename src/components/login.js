import React, { useState } from 'react';
import { submitLogin } from '../actions/authActions';
import { useDispatch } from 'react-redux';
import { Form, Button, Alert } from 'react-bootstrap';

function Login() {
  const [details, setDetails] = useState({
    username: '',
    password: '',
  });
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const updateDetails = (event) => {
    setDetails({
      ...details,
      [event.target.id]: event.target.value,
    });
  };

  const login = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    
    setError('');
    setValidated(true);
    
    // Try to dispatch login action and catch any errors
    try {
      dispatch(submitLogin(details))
        .catch(err => {
          setError('Invalid username or password. Please try again.');
        });
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="login-container">
      {error && <Alert variant="danger">{error}</Alert>}
      <Form noValidate validated={validated} onSubmit={login} className='login-form bg-dark text-light p-4 rounded'>
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            autoComplete="username"
            value={details.username}
            onChange={updateDetails}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={details.password}
            onChange={updateDetails}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide your password.
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit">Sign in</Button>
      </Form>
    </div>
  );
}

export default Login;