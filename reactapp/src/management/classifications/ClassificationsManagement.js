import React, { Component } from 'react';
import { URL } from '../../shared/Constants';
import { Route, Redirect } from 'react-router-dom';
import Notifications, {notify} from 'react-notify-toast';
import './ClassificationsManagement.css';
let localUser = JSON.parse(localStorage.getItem('userData'));

class ClassificationsManagement extends Component {


    constructor(props) {
        super(props);

        this.state = {
            allClassifications: [],
            name: null
            
        }
        this.fetchAllClassifications = this.fetchAllClassifications.bind(this);
        this.deleteClassification = this.deleteClassification.bind(this);
        this.addNewClassification = this.addNewClassification.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        window.challengesInfoListener = setInterval(() => this.fetchAllClassifications(), 1000);
        this.fetchAllClassifications();
    }

    fetchAllClassifications(){
        const getAllClassifications = URL + ':8080/api/classifications/View';
        fetch(getAllClassifications).then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({ allClassifications: data.classifications })
            });
    }

    deleteClassification(classificationID){
        fetch(URL + ':8080/api/classifications/Delete', {
            method: 'POST',
            body: JSON.stringify({
                id: classificationID
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json().then(data => ({status: res.status, body: data})))
        .then(obj =>{
            if(obj.status ===400){
                notify.show('Classification cannot be deleted (In-use)');
            }
        })
    }

    onChange(e) {
        this.setState({ [e.target.className]: e.target.value });
        console.log({ [e.target.className]: e.target.value });
    }
    
    addNewClassification(){
        if(this.state.name !=null){

            fetch(URL + ':8080/api/classifications/Add', {
                method: 'POST',
                body: JSON.stringify({
                    name: this.state.name
                }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }).then(res => res.json().then(data => ({status: res.status, body: data})))
            .then(obj =>{
                if(obj.status ===200){
                    notify.show('Classification added Successfully');
                }
            })
        }
    }


    render() {
        if(localStorage.getItem('userData') == null){
            return <Redirect to={{
                pathname: '/login'
            }} />
        }
        else if(localUser.role != 'admin'){
            return <Redirect to={{
                pathname: '/noAuthority'
            }} />
        }

        return (
            <div id="classificationManContainer">
                <div id="outer-management-classification-div">
                    <h1 id="classificationManagementTitle">Classifications - Management</h1>
                    <div class="divTable">
                        <div class="divTableBody">
                            <div class="divTableRow">
                                <div id="managementclassificationclassificationNameTitle">Name</div>
                            </div>
                            {this.state.allClassifications.map((classification, classificationIndex) => (
                            <div class="divTableRow">
                                <div id="managementclassificationclassificationNameValue">{classification.name}</div>
                                <div id="managementclassificationButtonsDiv">
                                <div id="managementclassificationDeleteButtonDiv"><button type="submit" value="managementclassificationDeleteButton" id="managementClassDeleteButton" onClick = { () => {this.deleteClassification(classification.id)}}>Delete</button></div>
                                </div>
                            </div>
                            ))}
                            <div class="divTableRow">
                            <div id="addClassificationNameInput"> <input type="text" placeholder="Enter Classification Name" id="classificationNameInput" onChange={this.onChange} className="name" required></input></div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" value="managementclassificationAddclassification" id="managementclassificationAddclassification"  onClick = {this.addNewClassification}>Add New Classification</button>
                </div>
            </div>
        );
    }
}

export default ClassificationsManagement;