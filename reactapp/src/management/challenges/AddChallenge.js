import React, { Component } from 'react';
import './AddChallenge.css';
import { URL } from '../../shared/Constants';
import Notifications, {notify} from 'react-notify-toast';
import { Route, Redirect } from 'react-router-dom';
let localUser = JSON.parse(localStorage.getItem('userData'));

class AddChallenge extends Component {

    constructor(props) {
        super(props);

        this.state = {
            allClassifications: [],
            allDifficulty: [],
            challengeName: null,
            description: null,
            folderName: null,
            mainFile: null,
            selectedClassificationID: null,
            selectedDifficultyID: null,
            solution: null,
            redirectToChallengesManagement: false

        }

        this.fetchAllClassifications = this.fetchAllClassifications.bind(this);
        this.fetchAllDifficulties = this.fetchAllDifficulties.bind(this);
        this.handleSelectedOption = this.handleSelectedOption.bind(this);
        this.handleSelectedDifficultyOption = this.handleSelectedDifficultyOption.bind(this);
        this.onChange = this.onChange.bind(this);
        this.addChallenge = this.addChallenge.bind(this);
    }

    componentDidMount() {
        
        this.fetchAllClassifications();
        this.fetchAllDifficulties();
    }

    handleSelectedOption(e) {
        this.setState({ selectedClassificationID: e.target.value });
    }

    handleSelectedDifficultyOption(e) {
        this.setState({ selectedDifficultyID: e.target.value });
    }

    onChange(e) {
        this.setState({ [e.target.className]: e.target.value });
        console.log({ [e.target.className]: e.target.value });
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

    addChallenge() {
        if (this.state.challengeName!=null && this.state.description !=null && this.state.folderName !=null && this.state.mainFile !=null && this.state.selectedClassificationID !=null && this.state.selectedDifficultyID !=null && this.state.solution !=null) {
            const link = '..challenges/'+this.state.folderName+'/'+this.state.mainFile;
            fetch(URL + ':8080/api/challenges/Add', {
                method: 'POST',
                body: JSON.stringify({
                    name: this.state.challengeName,
                    description: this.state.description,
                    link: link,
                    mainFile: this.state.mainFile,
                    solution: this.state.solution,
                    classificationID: Number(this.state.selectedClassificationID),
                    difficultyID: Number(this.state.selectedDifficultyID)
                }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }).then(res => res.json().then(data => ({status: res.status, body: data})))
            .then(obj =>{
                if(obj.status ===200){
                    notify.show('Challenge Created Successfully!');
                    this.setState({redirectToChallengesManagement: true});

                }
                else{
                    notify.show('Something went wrong, check the information provided! Some Challenge info may already exist!');
                }
            })

        }
        else{
            notify.show('Fill all the fields so you can add a new Challenge please');
        }
    }





    render() {

        if(this.state.redirectToChallengesManagement==true){
            this.setState({redirectToChallengesManagement: false});
            return <Redirect
            to={{
              pathname: "/management/challenges"
            }}
          />  
        }
        else if(localUser.role != 'admin'){
            return <Redirect to={{
                pathname: '/noAuthority'
            }} />
        }

        return (
            <div>
                <div id="addChallengeOuterDiv">
                <div id="addChallengeInnerDiv"><h1>Create Challenge</h1>
                    <div id="addChallengeFormDiv">
                        <div id="addChallengeNameTitle"><h2>Challenge Name:</h2></div>
                        <div id="addChallengeNameInput"> <input type="text" placeholder="Enter the Challenge Name" id="challengeNameInput" className="challengeName" onChange={this.onChange} required></input></div>
                        <div id="addChallengeDescriptionTitle"><h2>Description:</h2></div>
                        <div id="addChallengeDescriptionInput"> <textarea placeholder="Enter the Challenge Description" id="challengeDescriptionInput" onChange={this.onChange} className="description" required></textarea></div>
                        <div id="addChallengeFolderTitle"><h2>Folder Name:</h2></div>
                        <div id="addChallengeFolderInput"> <input type="text" placeholder="Enter the Challenge Folder Name" id="challengeFolderInput" onChange={this.onChange} className="folderName" required></input></div>
                        <div id="addChallengeMainFileTitle"><h2>Main File Name:</h2></div>
                        <div id="addChallengeMainFileInput"> <input type="text" placeholder="Enter the Challenge MainFile" id="challengeMainFileInput" onChange={this.onChange} className="mainFile" required></input></div>
                        <div id="addChallengeSolutionTitle"><h2>Solution:</h2></div>
                        <div id="addChallengeSolutionInput"> <input type="text" placeholder="Enter the Solution or write Implemented" id="challengeSolutionInput" onChange={this.onChange} className="solution" required></input></div>
                        
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
                            <div id="addChallengeButtonDiv"><button type="submit" value="addChallengeButton" id="addChallButton" onClick = {this.addChallenge}>Create Challenge</button></div>
                    </div>
                </div>
            </div>
            <div><Notifications /></div>
            </div>
        );
    }
}

export default AddChallenge;