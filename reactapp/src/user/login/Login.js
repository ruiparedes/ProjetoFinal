import React from 'react';
import ReactDOM from 'react-dom'
import './Login.css';
import { URL } from '../../shared/Constants';
import Notifications, {notify} from 'react-notify-toast';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        this.login = this.login.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    login() {
        if (this.state.username && this.state.password) {
            const data = {
                username: this.state.username,
                password: this.state.password
            }
            fetch(URL + ':8080/api/users/Login', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }).then((object) => {
                if (object.status === 200) {
                    notify.show('LOGIN DONE!!');
                }
                else{
                    notify.show('Username or Password incorrect!!');
                }
            })

        }
    }

    onChange(e) {
        this.setState({ [e.target.className]: e.target.value });
        console.log({[e.target.className]: e.target.value});
    }


    render() {
        return (
            <div className="login">
                <div id="login-container">
                    <div className="block">
                        <label>Username: </label>
                        <input type="text" placeholder="Enter the Username" className="username" onChange={this.onChange} required></input>
                    </div>
                    <div className="block">
                        <label>Password: </label>
                        <input type="password" placeholder="Enter the Password" className="password" onChange={this.onChange} required></input>
                    </div>
                    <div className="btncontainer" >
                        <button type="submit" value="Signup" className="acceptbtn" onClick={this.login}>Login</button>
                    </div>
                </div>
                <div><Notifications /></div>
            </div>
        );
    }
}

export default Login;