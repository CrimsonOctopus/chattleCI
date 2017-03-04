import * as React from 'react';
import { Socket } from './Socket';

export class GoogleLoginButton
extends React.Component {
  
    constructor(props){
        super(props);
        this.state = {
          'username':'',
          'IsLoggedIn':''
        }
        //this.onSignIn = this.onSignIn.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
    }
    componentDidMount(){
        Socket.on('user left', (data) => {
            var auth = gapi.auth2.getAuthInstance();
              let user=auth.currentUser.get();
              if(user.isSignedIn()){
                  console.log(data['username']+" Left!");
                    if(data['service']=='google'){
                        Socket.emit('user quit',{'username':data['username']});   
                    }
              }
        });
        Socket.on('all users', (data) => {
            console.log("Checking google");
                var auth = gapi.auth2.getAuthInstance();
                let user=auth.currentUser.get();
                var loggedIn = false;
                if(user.isSignedIn()){
                    this.setState({
                        'IsLoggedIn': true
                    });
                    console.log("User is signed in");
                } else {
                    console.log("Checking facebook");
                    var fbLogin = false;
                    FB.getLoginStatus(function(response) {
                        if (response.status == 'connected'){
                            console.log("Connected to fb");
                            loggedIn = true;
                            console.log("User is signed in");
                        }
                    });
                    if(!fbLogin){
                        this.setState({
                            'IsLoggedIn': false
                        });
                        console.log("User is logged out");   
                    }
                    if(loggedIn==true){
                        this.setState({
                            'IsLoggedIn': true
                        });
                    }
                }
        });
        /*Socket.on('disconnect',function(){
              console.log('Disconnecting from the server!');
              var auth = gapi.auth2.getAuthInstance();
              let user=auth.currentUser.get();
              if(user.isSignedIn()){
                  auth.signOut().then(function () {
                      console.log('User signed out.');
                      Socket.emit('user disconnected',{'service':'google'});
                    });
              }
          });*/
          
          //Check user credentials (Use OAuth?)
          Socket.on('client connected',function(){
              console.log('Connecting to the server with Google!');
              var auth = gapi.auth2.getAuthInstance();
              let user=auth.currentUser.get();
              if(!user.isSignedIn()){
                  auth.signIn().then(function () {
                      console.log('User signed in with Google.');
                      Socket.emit('user connected', {'facebook_user_token':'','google_user_token':user.getAuthResponse().access_token,'username':user.name});
                    });
              }
          })
    }
    
    /*onSignIn(){
        var auth = gapi.auth2.getAuthInstance();
        let user=auth.currentUser.get();
        if(user.isSignedIn()){
            Socket.emit('user connected', {'facebook_user_token':'','google_user_token':user.getAuthResponse().id_token,'username':user.getBasicProfile().getName()});
        }
    }*/
    
    //Google Sign-In button callbacks
    //----------------------------------------------------------------------------------------------
    signIn() {
        var auth = gapi.auth2.getAuthInstance();
        auth.signIn().then(function () {
            console.log('Google Authorized!');
            let user=auth.currentUser.get();
            if(user.isSignedIn()){
              console.log('Google Authorized!');
              Socket.emit('user connected', {'facebook_user_token':'','google_user_token':user.getAuthResponse().access_token,'username':user.getBasicProfile().getName()});
            }
        });
    }
    
    signOut() {
        var auth = gapi.auth2.getAuthInstance();
        let user=auth.currentUser.get();
        if(user.isSignedIn()){
            auth.signOut().then(function () {
              console.log('Google Sign Out');
              Socket.emit('user quit',{'username':user.getBasicProfile().getName()});
            });
        }
    }
    //----------------------------------------------------------------------------------------------
    
    render() {
        //Get login state
        const isLoggedIn = this.state.IsLoggedIn!=''?this.state.IsLoggedIn:false;
        //If logged in, draw log in button
        if (isLoggedIn) {
            return (<div>
                          <div id="gSignInWrapper">
                            <div id="customBtn" className="customGPlusSignIn" onClick={this.signOut}>
                              <span className="icon"></span>
                              <span className="buttonText" style={{fontSize:'12px', fontWeight:'bold'}}>Sign Out</span>
                            </div>
                          </div>
                          <span className="g-signin2" style={{display:'none'}}></span>
                    </div>);
        //If logged out, draw log out button
        } else {
            return (<div>
                          <div id="gSignInWrapper">
                            <div id="customBtn" className="customGPlusSignIn" onClick={this.signIn}>
                              <span className="icon"></span>
                              <span className="buttonText" style={{fontSize:'12px', fontWeight:'bold'}}>Sign In</span>
                            </div>
                          </div>
                          <span className="g-signin2" style={{display:'none'}}></span>
                    </div>);
        }
    };
}