import * as React from 'react';

export class UserProfile
extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            'username':''
        }
        this.state.username = this.props.username;
    }
    render() {
        return (<li>
                    <p className="messageText">{this.state.username['text']}</p>
                </li>);
    }
}