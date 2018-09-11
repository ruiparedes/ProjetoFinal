import React, { Component } from 'react';
import './SuggestionsManagement.css'
import { URL } from '../../shared/Constants';
import { Route, Redirect } from 'react-router-dom';

class SuggestionsManagement extends Component {

    constructor(props) {
        super(props);

        this.state = {
            allSuggestions: []
            
        }
        this.fetchAllSuggestions = this.fetchAllSuggestions.bind(this);
    }

    fetchAllSuggestions() {
        const getAllSuggestions = URL + ':8080/api/suggestions/View';
        fetch(getAllSuggestions).then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({ allSuggestions: data.challengeSuggestions })
            });
    }


    render() {
        return (
            <div>
                
            </div>
        );
    }
}

export default SuggestionsManagement;