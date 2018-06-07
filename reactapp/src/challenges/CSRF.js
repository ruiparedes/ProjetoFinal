import React, { Component } from 'react';
import { URL } from '../../shared/Constants';

class CSRF extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            CSRFAttack: ''
        }
    
        this.sendAttack = this.sendAttack.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    
    onChange(e) {
        this.setState({ [e.target.className]: e.target.value });
        console.log({[e.target.className]: e.target.value});
    }
    
sendAttack(){

    //Codigo para enviar os dados para um componente diferente.

}


    render() {
        return (
            <div>
                <div className="block">
                        <label>Attack: </label>
                        <input type="text" placeholder="Enter the Attack" className="CSRFAttack" onChange={this.onChange} required></input>
                    </div>
                <div className="btncontainer" >
                    <button type="submit" value="Attack" className="acceptbtn" onClick={this.sendAttack}>Attack</button>
                </div>
            </div>
        );
    }
}

export default CSRF;