import React, { Component } from 'react';
import { URL } from '../shared/Constants';


class ChallengeSuggestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null
        }
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
        this.fileUploadHandler = this.fileUploadHandler.bind(this)
    }

    fileSelectedHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
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
                <h1>File Upload</h1>
                <input type="file" onChange={this.fileSelectedHandler} name="uploadedFile" />
                <button type="submit" onClick={this.fileUploadHandler}>Upload</button>
            </div>
        );
    }
}

export default ChallengeSuggestion;