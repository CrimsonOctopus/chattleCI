import * as React from 'react';
import { Socket } from './Socket';

export class ChatBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'text':''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event){
        this.setState({ text : event.target.value });
    }
    
    handleSubmit(event) {
        var message = {
            text : this.state.text
        }
        this.props.submitfnc(message);
        this.setState({ text: '' });
        event.preventDefault();
    }
    
    render() {
        return (
        <div>
        <form onSubmit={this.handleSubmit}>
            <input type='text' placeholder='Enter your message' value={this.state.text} onChange={this.handleChange}/>
            <input type="submit" value="Submit" onClick={this.handleSubmit} />
        </form>
        </div>);
    }
}