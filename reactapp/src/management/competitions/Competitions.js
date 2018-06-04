import React, { Component } from 'react';
import { URL } from '../../shared/Constants';
import ReactDOM from 'react-dom';
import './Competitions.css';



class Competitions extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            competitions: [],
            competitionName: '',
            competitionParticipants: '',
            competitionHelps: '',
            competitionDiscount: '',
            competitionStatus: ''




        }
        this.fetchCompetitions = this.fetchCompetitions.bind(this);
        this.addCompetition = this.addCompetition.bind(this);
        this.onChange = this.onChange.bind(this);
        this.deleteCompetition = this.deleteCompetition.bind(this);
    }

    componentDidMount(){
        window.competitionsListener = setInterval(() => this.fetchCompetitions(), 3000);
        this.fetchCompetitions();
    }

    componentWillUnmount() {
        clearInterval(window.competitionsListener);
    }


    onChange(e) {
        this.setState({ [e.target.className]: e.target.value });
        console.log({[e.target.className]: e.target.value});
    }


fetchCompetitions() {
    fetch(URL + ':8080/api/competitions/View').then(res => res.json()).
    then( data => this.setState({ competitions: data.competitions }));
}

addCompetition(){
    if(this.state.competitionName && this.state.competitionParticipants && this.state.competitionHelps && this.state.competitionDiscount && this.state.competitionStatus){
        fetch(URL + ':8080/api/competitions/Add', {
            method: 'POST',
            body: JSON.stringify({
                name: this.state.competitionName,
                totalParticipants: this.state.competitionParticipants,
                numberHelps: this.state.competitionHelps,
                discountPerHelp: this.state.competitionDiscount,
                status: this.state.competitionStatus
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
    }
}

deleteCompetition(competitionId){
    fetch(URL + ':8080/api/competitions/Delete',{
        method: 'POST',
        body: JSON.stringify({
           id: competitionId
        }),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });
}


    render() {
        return (

            <div>
                <table className="competitionsTable">
                    <tr>
                        <th>Name</th>
                        <th>Total Participants</th>
                        <th>Number of Helps</th>
                        <th>Discount Per Help</th>
                        <th>Status</th>
                    </tr>
                {this.state.competitions.map((competition,competitionIndex) =>(
                    <tr key={'competition_' + competitionIndex}>
                    <td >{competition.name}</td>
                    <td >{competition.totalParticipants} participants</td>
                    <td>{competition.numberHelps} helps</td>
                    <td>{competition.discountPerHelp} points</td>
                    <td>{competition.status}</td>
                    <td><button type="submit" value="Delete" className="deletebtn" onClick={() =>this.deleteCompetition(competition.id)}>Delete</button></td>
                    </tr>
                ))}
                <tr>
                    <td><input type="text" placeholder="Enter competition name" className="competitionName" onChange={this.onChange} required></input></td>
                    <td><input type="text" placeholder="Enter number of Participants" className="competitionParticipants" onChange={this.onChange} required></input></td>
                    <td><input type="text" placeholder="Enter number of Helps" className="competitionHelps" onChange={this.onChange} required></input></td>
                    <td><input type="text" placeholder="Enter discount per help" className="competitionDiscount" onChange={this.onChange} required></input></td>
                    <td><input type="text" placeholder="Enter competition status" className="competitionStatus" onChange={this.onChange} required></input></td>
                </tr>
                </table>
                <button type="submit" value="AddCompetition" className="acceptbtn" onClick={this.addCompetition}>Add Competition</button>
            </div>
        );
    }
}

export default Competitions;