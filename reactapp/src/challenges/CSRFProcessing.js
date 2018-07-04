import React, { Component } from 'react';
import queryString from 'query-string';

class CSRFProcessing extends React.Component {

    constructor(props) {
        super(props);
        
    }

    componentDidMount(){
        console.log(this.props.value);  
        var montante = this.props.value.montante;
        var contaReceptora = this.props.value.contaReceptora;

        if(montante==undefined || contaReceptora ==undefined){
            console.log("Campos Errados ou não passados");
        }
        else{
            console.log(montante); 
            console.log(contaReceptora); 
            if((contaReceptora == "7432") && (montante == 1000)){
                console.log("Parabéns, conseguiu executar o ataque com sucesso");
            }
            else{
                console.log("Errou, tente novamente");
            }
        }
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

export default CSRFProcessing;