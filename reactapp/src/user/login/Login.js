import React from 'react';
import ReactDOM from 'react-dom'
import './Login.css';
import { URL } from '../../shared/Constants';
import Notifications, { notify } from 'react-notify-toast';
import { Redirect } from 'react-router-dom';
import loginIcon from '../../images/loginIcon.png';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }

        this.login = this.login.bind(this);
        this.goToSignUp = this.goToSignUp.bind(this);
        this.onChange = this.onChange.bind(this);
    }

goToSignUp(){
window.location.href = URL + ":3000/signup";
}


    login() {
        if (this.state.username && this.state.password) {
            const data = {
                username: this.state.username,
                password: this.state.password
            }
            fetch(URL + ':8080/api/users/Login', {
                method: 'POST',
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }).then(res => res.json().then(data => ({status: res.status, body: data})))
            .then(object =>{
                console.log(object);
                console.log(object.status);
                if (object.status === 200) {
                    fetch(URL + ':8080/api/users/View').then(res => res.json()).
                        then(d => {
                            console.log(d);
                            d.users.filter((users) => {
                                if (users.username === data.username) {
                                    window.location.href = "/home";
                                    console.log('Filter ' + users.username + ' ' + users.id + ' ' + users.password + ' ' + users.email + ' ' + users.role);
                                    const userData = { id: users.id, username: users.username, email: users.email, role: users.role };
                                    localStorage.setItem('userData', JSON.stringify(userData));
                                    return;
                                }
                            })
                        })
                    notify.show('LOGIN DONE!!');
                }
                else {
                    notify.show('Username or Password incorrect!!');
                }
            })

        }
    }

    onChange(e) {
        this.setState({ [e.target.className]: e.target.value });
        console.log({ [e.target.className]: e.target.value });
    }


    render() {

        if(localStorage.getItem('userData') != null){
            return <Redirect to={{
                pathname: '/home'
            }} />
        }

        return (
            <div id="login-outer-div">
            <div id="loginIntroText"><h2>Login or create your LabSecurity Account and start hacking!</h2></div>
                <div id="login-container">          
                    <div id="loginForm">
                    <div id="loginIconDiv"><img src ={loginIcon} id="loginIcon"/></div>
                        <div id="loginUsernameDiv"><input type="text" placeholder="Username" className="username" id="loginUsernameInput" onChange={this.onChange} required></input></div>
                        <div id="loginPasswordDiv"><input type="password" placeholder="Password" className="password" id="loginPasswordInput" onChange={this.onChange} required></input></div>
                        <div id="loginButtonsDiv">
                        <button type="submit" value="Login" id="loginButton" onClick={this.login}>Login</button>
                        <button type="submit" value="SignUp" id="signUpButton" onClick={this.goToSignUp}>Sign Up</button>
                        </div>
                    </div>
                </div>
                <div><Notifications /></div>
            </div>
        );
    }
}

export default Login;