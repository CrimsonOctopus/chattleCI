import * as React from 'react';
import {UserProfile} from './UserProfile';
import { Socket } from './Socket';

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());
    
    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
    //io.emit('sign in', {'user':{'username': profile.getName(),}});
};

export class UserList
extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            'usernames':[],
            'IsLoggedIn':false,
        }
    }
    
    //When the component is mounted, add the Socketio listeners
    componentDidMount(){
        Socket.on('all users', (data) => {
            console.log("UserList recieved the list of users. Checking if the user is logged in...");
            var auth = gapi.auth2.getAuthInstance();
            let user=auth.currentUser.get();
            
            //If the user is logged in to Google...
            var loggedIn = false;
            if(user.isSignedIn()){
                //Set the flag
                loggedIn = true;
                console.log("User is signed in to Google!"+data['usernames']);
            //If they're logged in to Facebook
            } else {
                FB.getLoginStatus(function(response) {
                    if (response.status == 'connected'){
                        //Set the flag
                        loggedIn = true;
                        console.log("User is signed in");
                    }
                });
            }
            //If they're logged in, set the list of usernames and set them as logged in
            if(loggedIn==true){
                console.log(data['usernames']);
                this.setState({
                    'usernames': data['usernames'],
                    'IsLoggedIn': true
                });
            }
        });
        
        /*Socket.on('all messages', (data) => {
            console.log('all messages recieved, checking if user is logged in');
            console.log("Checking google");
            var auth = gapi.auth2.getAuthInstance();
            let user=auth.currentUser.get();
            
            if(user.isSignedIn()){
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
            }
        });*/
    }
    
    render(){
        //Convert the list of usernames passed from the server to a ReactJS map
        const listItem = this.state.usernames.map((a,i)=>{
            return <UserProfile key={i} username={a}/>;
        })
        /*var output = [];
        console.log("Usernames"+this.state.usernames);
        for(var i = 0; i < this.state.usernames.length; i++){
            output.push(<li key={i}>{this.state.usernames[i]}</li>);
        }*/
        console.log("Test");
        //If logged in, render UserList
        if(this.state.IsLoggedIn==true){
          return (
                <div>
                    <h4>Active Users</h4>
                    <ul>{listItem}</ul>
                </div>
            );
        //Else, don't
        } else {
            return <div><h4>Active Users</h4></div>;
        }
    }
}