import React from 'react';
import ReactDOM from 'react-dom'
import './Signup.css';
import Notifications, { notify } from 'react-notify-toast';
import { URL } from '../../shared/Constants';
import loginIcon from '../../images/loginIcon.png';
import { Route, Redirect } from 'react-router-dom';

class Signup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            name: '',
            email: ''
        }
        this.signup = this.signup.bind(this);
        this.goToLogin = this.goToLogin.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    signup() {
        if (this.state.username && this.state.password && this.state.name && this.state.email) {
            fetch(URL + ':8080/api/users/Add/', {
                method: 'POST',
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                    name: this.state.name,
                    email: this.state.email
                }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }).then((object) => {
                if (object.status === 200) {
                    notify.show('Account created Successfully, You can now Log in');
                }
                else {
                    notify.show('Couldnt Signup');
                }
            })
        }
        else{
            notify.show(`There are some empty fields, please fill in every field`);
        }
    }

    onChange(e) {
        this.setState({ [e.target.className]: e.target.value });
        console.log({ [e.target.className]: e.target.value });
    }
    goToLogin(){
        window.location.href = URL + ":3000/login";
    }

    render() {
        if(localStorage.getItem('userData') != null){
            return <Redirect to={{
                pathname: '/home'
            }} />
        }
        return (
            <div id="signup-outer-div">
                <div id="signupIntroText"><h2>Create an account or if you already have one Log in!</h2></div>
                <div id="signup-container">
                    <div id="signupForm">
                        <div id="loginIconDiv"><img src={loginIcon} id="loginIcon" /></div>
                        <div id="signupUsernameDiv"><input type="text" placeholder="Username" className="username" id="signupUsernameInput" onChange={this.onChange} required></input></div>
                        <div id="signupPasswordDiv"><input type="password" placeholder="Password" className="password" id="signupPasswordInput" onChange={this.onChange} required></input></div>
                        <div id="signupNameDiv"><input type="text" placeholder="First and Last name" className="name" id="signupNameInput" onChange={this.onChange} required></input></div>
                        <div id="signupEmailDiv"><input type="text" placeholder="Email" className="email" id="signupEmailInput" onChange={this.onChange} required></input></div>
                        <div id="signupButtonsDiv">
                            <button type="submit" value="Signup" id="singupSignupButton" onClick={this.signup}>Sign Up</button>
                            <button type="submit" value="Login" id="signupLoginButton" onClick={this.goToLogin}>Login</button>
                        </div>
                    </div>
                </div>
                <div><Notifications /></div>
            </div>
        );
    }
}

export default Signup;