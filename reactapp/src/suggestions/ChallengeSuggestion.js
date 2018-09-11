import React, { Component } from 'react';
import { URL } from '../shared/Constants';
import './ChallengeSuggestion.css';
import Notifications, {notify} from 'react-notify-toast';
import { Route, Redirect } from 'react-router-dom';
let localUser = JSON.parse(localStorage.getItem('userData'));
let file;

class ChallengeSuggestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allClassifications: [],
            allDifficulty: [],
            challengeName: null,
            description: null,
            mainFile: null,
            selectedClassificationID: null,
            selectedDifficultyID: null,
            solution: null,
            selectedFile: null
        }
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
        this.fileUploadHandler = this.fileUploadHandler.bind(this)
        this.fetchAllClassifications = this.fetchAllClassifications.bind(this);
        this.fetchAllDifficulties = this.fetchAllDifficulties.bind(this);
        this.addChallengeSuggestion = this.addChallengeSuggestion.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleSelectedOption = this.handleSelectedOption.bind(this);
        this.handleSelectedDifficultyOption = this.handleSelectedDifficultyOption.bind(this);
    }

    componentDidMount() {
        this.fetchAllClassifications();
        this.fetchAllDifficulties();
    }

    onChange(e) {
        this.setState({ [e.target.className]: e.target.value });
        console.log({ [e.target.className]: e.target.value });
    }

    handleSelectedOption(e) {
        this.setState({ selectedClassificationID: e.target.value });
    }

    handleSelectedDifficultyOption(e) {
        this.setState({ selectedDifficultyID: e.target.value });
    }

    fetchAllClassifications(){
        const getAllClassifications = URL + ':8080/api/classifications/View';
        fetch(getAllClassifications).then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({ allClassifications: data.classifications })
            });
    }

    fetchAllDifficulties(){
        const getAllDifficulty = URL + ':8080/api/difficulty/View';
        fetch(getAllDifficulty).then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({ allDifficulty: data.difficulty })
            });
    }

    addChallengeSuggestion() {
        if (this.state.challengeName!=null && this.state.description !=null && this.state.mainFile !=null && this.state.selectedClassificationID !=null && this.state.selectedDifficultyID !=null && this.state.solution !=null) {
        console.log(file);
        let userID = localUser.id;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('userID', userID);
        formData.append('name', this.state.challengeName);
        formData.append('mainFile', this.state.mainFile);
        formData.append('description', this.state.description);
        formData.append('solution', this.state.solution);
        formData.append('classificationID', this.state.selectedClassificationID);
        formData.append('difficultyID', this.state.selectedDifficultyID);
            
            fetch(URL + ':8080/api/challengeSuggestions/Add', {
                method: 'POST',
                body: formData
            }).then(res => res.json().then(data => ({status: res.status, body: data})))
            .then(obj =>{
                if(obj.status ===200){
                    notify.show('Challenge Suggested Successfully!');

                }
                else{
                    notify.show('Something went wrong, check the information provided!');
                }
            })

        }
        else{
            notify.show('Fill all the fields so you can suggest a new Challenge please');
        }
    }

    fileSelectedHandler = event => {
        file = event.target.files[0];
        console.log(file);
        
    }

    fileUploadHandler = () => {
        var data = new FormData()
        data.append('file', this.state.selectedFile);

        let formData = this.state.selectedFile;
        console.log(formData);
        fetch(URL + ':8080/api/challengeSuggestions/Add', {
            method: 'POST',
            body: JSON.stringify({
                file: data
            })
        });
    }

    render() {
        return (
            <div>
                <div id="addChallengeOuterDiv">
                <div id="addChallengeInnerDiv"><h1>Create Challenge</h1>
                    <div id="addChallengeFormDiv">
                        <div id="addChallengeNameTitle"><h2>Challenge Name:</h2></div>
                        <div id="addChallengeNameInput"> <input type="text" placeholder="Enter the Challenge Name" id="challengeNameInput" className="challengeName" onChange={this.onChange} required></input></div>
                        <div id="addChallengeDescriptionTitle"><h2>Description:</h2></div>
                        <div id="addChallengeDescriptionInput"> <textarea placeholder="Enter the Challenge Description" id="challengeDescriptionInput" onChange={this.onChange} className="description" required></textarea></div>
                        <div id="addChallengeMainFileTitle"><h2>Main File Name:</h2></div>
                        <div id="addChallengeMainFileInput"> <input type="text" placeholder="Enter the Challenge MainFile" id="challengeMainFileInput" onChange={this.onChange} className="mainFile" required></input></div>
                        <div id="addChallengeSolutionTitle"><h2>Solution:</h2></div>
                        <div id="addChallengeSolutionInput"> <input type="text" placeholder="Enter the Solution or write Implemented" id="challengeSolutionInput" onChange={this.onChange} className="solution" required></input></div>
                        <div id="addChallengeFileTitle"><h2>ZIP File:</h2></div>
                        <div id="addChallengeFileInput"> <input type="file" onChange={this.fileSelectedHandler} name="uploadedFile" id="challengeFileInput"/></div>
                        <div id="custom-select"><h2>Select Classification:</h2>
                                <select id="selectClassification" onChange={this.handleSelectedOption}>
                                    <option disabled selected value> -- Select a Classification -- </option>
                                    {this.state.allClassifications.map((classification, classificationIndex) => (
                                        <option value={classification.id}>{classification.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div id="custom-select"><h2>Select Difficulty:</h2>
                                <select id="selectDifficulty" onChange={this.handleSelectedDifficultyOption}>
                                    <option disabled selected value> -- Select a Difficulty -- </option>
                                    {this.state.allDifficulty.map((difficulty, difficultyIndex) => (
                                        <option value={difficulty.id}>{difficulty.level}</option>
                                    ))}
                                </select>
                            </div>
                            <div id="addChallengeButtonDiv"><button type="submit" value="addChallengeButton" id="addChallButton" onClick = {this.addChallengeSuggestion}>Create Challenge</button></div>
                    </div>
                </div>
            </div>
            <div><Notifications /></div>
            </div>
        );
    }
}

export default ChallengeSuggestion;