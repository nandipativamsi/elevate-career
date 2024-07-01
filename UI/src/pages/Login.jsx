import axios from 'axios';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../constants/apiConstants';
import { withRouter } from "react-router-dom";
import './login.css';
import {useState} from 'react';

function LoginForm(props) {
    const [state , setState] = useState({
        email : "",
        password : "",
        successMessage: null
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        const payload={
            "email":state.email,
            "password":state.password,
        }
        axios.post(API_BASE_URL+'/user/login', payload)
            .then(function (response) {
                if(response.status === 200){
                    setState(prevState => ({
                        ...prevState,
                        'successMessage' : 'Login successful. Redirecting to home page..'
                    }))
                    localStorage.setItem(ACCESS_TOKEN_NAME,response.data.token);
                    redirectToHome();
                    props.showError(null)
                }
                else if(response.code === 204){
                    props.showError("Username and password do not match");
                }
                else{
                    props.showError("Username does not exists");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }
    const redirectToRegister = () => {
        props.history.push('/register'); 
        props.updateTitle('Register');
    }
    return(
        
        <div>
            <div className="login-container">
                <form className="login-form">
                    <h2 className='login-header'>LOGIN</h2>
                    <div className="form-group">
                        <input type="email" placeholder="email@gmail.com" value={state.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="password" value={state.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="login-button" onClick={handleSubmitClick}>Login</button>
                    <p className="signup-link">
                        Don't have an account? 
                    </p>
                    <button type="submit" className="register-button" onClick={redirectToRegister}>Register here</button>
                </form>
                <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                    {state.successMessage}
                </div>
            </div>
        </div>    
    )
}

export default withRouter(LoginForm);