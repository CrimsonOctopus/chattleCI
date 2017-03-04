import * as React from 'react';
import {ChatMessage} from './ChatMessage';
import { Socket } from './Socket';

export class ChatMessageList
extends React.Component {
     constructor(props){
        super(props);
        this.state = {
            'IsLoggedIn':false,
            'messages':[]
        }
    }
    componentDidMount(){
        /*Socket.on('logged in', (data) => {
            console.log("Checking google");
                var auth = gapi.auth2.getAuthInstance();
                let user=auth.currentUser.get();
                
                if(user.isSignedIn()){
                    this.setState({
                        'IsLoggedIn': true,
                        'messages': data['messages']
                    });
                    console.log("User is signed in");
                } else {
                    console.log("Checking facebook");
                    var fbLogin = false;
                    FB.getLoginStatus(function(response) {
                        if (response.status == 'connected'){
                            console.log("Connected to fb");
                            this.setState({
                                'IsLoggedIn': true,
                                'messages': data['messages']
                            });
                            console.log("User is signed in");
                        }
                    });
                    if(!fbLogin){
                        this.setState({
                            'IsLoggedIn': false
                        });
                        console.log("User is logged out");   
                    }
                }
        });*/
        
        Socket.on('all users', (data) => {
            console.log("ChatMessageList recieved the list of users. Checking if the user is logged in...");
            var auth = gapi.auth2.getAuthInstance();
            let user=auth.currentUser.get();
            
            //If the user is logged in to Google...
            var loggedIn = false;
            if(user.isSignedIn()){
                //Set the flag
                loggedIn = true;
                console.log("User is signed in to Google!");
            //If they're logged in to Facebook
            } else {
                var fbLogin = false;
                FB.getLoginStatus(function(response) {
                    if (response.status == 'connected'){
                        loggedIn = true;
                        console.log("User is signed in");
                    }
                });
            }
            //If they're logged in, set the list of usernames and set them as logged in
            if(loggedIn==true){
                console.log("User is signed in!");
                this.setState({
                    'IsLoggedIn': true
                });
            }
        });
        
        //All off the messages sent by the server...
        Socket.on('all messages', (data) => {
            console.log('ChetMessageList recieved all messages, checking if user is logged in.');
            var auth = gapi.auth2.getAuthInstance();
            let user=auth.currentUser.get();
            
            //If the user is logged in to Google...
            var loggedIn = false;
            if(user.isSignedIn()){
                //Set the flag
                loggedIn = true;
                console.log("User is signed in to Google!");
            //If they're logged in to Facebook
            } else {
                var fbLogin = false;
                FB.getLoginStatus(function(response) {
                    if (response.status == 'connected'){
                        loggedIn = true;
                        console.log("User is signed in to facebook");
                    } else {
                        loggedIn = false;
                        console.log("User is signed out of facebook");
                    }
                });
            }
            //If they're logged in, set the list of usernames and set them as logged in
            if(loggedIn==true){
                console.log("User is signed in!");
                this.setState({
                    'messages': data['messages'],
                    'IsLoggedIn':true
                });
            } else {
                console.log("User is signed in!");
                this.setState({
                    'messages': data['messages'],
                    'IsLoggedIn':false
                });
            }
            
            /*if(user.isSignedIn()){
                this.setState({
                    'messages': data['messages']
                });
                console.log("User is signed in, messages: "+data['messages']);
            } else {
                console.log("Checking facebook");
                var fbLogin = false;
                var messages = []
                var isMessages = false;
                FB.getLoginStatus(function(response) {
                    if (response.status == 'connected'){
                        console.log("Connected to fb");
                        isMessages = true;
                        console.log("User is signed in");
                    }
                });
            }
            if(isMessages){
                this.setState({
                    'messages': data['messages']
                });
            }*/
        });
    }
    
    render(){
        //Convert the message list sent from the server to a ReactJS map
        const listItems = this.state.messages.map((a,i) => {
            return <ChatMessage key={i} message={a}/>
        });
        
        const isLoggedIn = this.state.IsLoggedIn;
        //If user is logged in, draw message list
        if (isLoggedIn) {
            console.log('Logged in');
            return (
                <div>
                    <ul>{listItems}</ul>
                </div>
            );
        //Else, don't
        } else {
            return (
                <div>
                    <p>Not Logged in</p>
                </div>
            ); 
        }
    }
}