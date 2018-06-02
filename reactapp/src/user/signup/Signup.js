import React from 'react';
import ReactDOM from 'react-dom'
import './Signup.css';
import Notifications, {notify} from 'react-notify-toast';
import { URL } from '../../shared/Constants';

class Signup extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            name:'',
            email: '',
            address: ''
        }
        this.signup = this.signup.bind(this);
        this.onChange = this.onChange.bind(this);
    }

signup(){
    if(this.state.username && this.state.password && this.state.name && this.state.email && this.state.address){
        fetch(URL + ':8080/api/users/Add/', {
            method: 'POST',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                name: this.state.name,
                email: this.state.email,
                address: this.state.address
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then((object) =>{
            if(object.status === 200){
                notify.show('Signup Done');
            }
            else{
                notify.show('Couldnt Signup');
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
            <div className="signup">
                <div id="signup-container">
                    <div className="block">
                        <label>Username: </label>
                        <input type="text" placeholder="Enter the Username" className="username" onChange={this.onChange} required></input>
                    </div>
                    <div className="block">
                        <label>Password: </label>
                        <input type="password" placeholder="Enter the Password" className="password" onChange={this.onChange} required></input>
                    </div>
                    <div className="block">
                        <label>Name: </label>
                        <input type="text" placeholder="First and Last name" className="name" onChange={this.onChange} required></input>
                    </div>
                    <div className="block">
                        <label>Email: </label>
                        <input type="text" placeholder="Enter your Email" className="email" onChange={this.onChange} required></input>
                    </div>
                    <div className="block">
                        <label>Address: </label>
                        <input type="text" className="address" placeholder="Enter your Address" onChange={this.onChange} required></input>
                    </div>
                    <div className="btncontainer" >
                        <button type="submit" value="Signup"  className="acceptbtn" onClick={this.signup}>Signup</button>
                    </div>

                </div>
                <div><Notifications /></div>
            </div>
        );
    }
}

export default Signup;