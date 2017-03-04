import * as React from 'react';

export class ChatMessage 
extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            'message':'',
            'link':'',
            'username':''
        }
        this.state.message = JSON.parse(this.props.message);
    }
    
    render() {
        //Grab references to the user link and picture
        const link = this.state.message['link'];
        const picture = this.state.message['picture'];
        var text = this.state.message['text'];
        //Used to parse the message in to multiple lines...
        var lines = [];
        var jsxLines = [];
        
        //Used to repress errors
        if(text === null){
            text = 'None';
        } else {
            //Split on new lines
            lines = text.split("\n");
            //Convert from strings in to jsx p
            for(var i = 0; i < lines.length; i++){
                switch(lines[i].substring(0,1)){
                    case '\b':
                        jsxLines[i] = <b key={i}><p className="messageText">{lines[i]}</p></b>;
                        break;
                    case '\t':
                        jsxLines[i] = <i key={i}><p className="messageText">{lines[i]}</p></i>;
                        break;
                    default:
                        jsxLines[i] = <p className="messageText" key={i}>{lines[i]}</p>;
                        break;
                }
            }
        }
        let messageText = jsxLines;
        let messageType;
        if(!(text==='None')){
            switch(this.state.message['text'].substring(this.state.message['text'].length-4,this.state.message['text'].length)){
                case ".jpg":
                case "jpeg":
                case ".png":
                case ".gif":
                    messageText = <a href={this.state.message['text']}><img src={this.state.message['text']} className="messageImage" /></a>;
                    messageType = "Image";
                    break;
                default:
                    //Used to tell if the text is a link
                    var a  = document.createElement('a');
                    a.href = this.state.message['text'];
                    
                    if (a.host && a.host != window.location.host){
                        messageText = <p><a href={this.state.message['text']} className="messageLink">{this.state.message['text']}</a></p>;
                        messageType = "Link";
                    } else {
                        //messageText = <p className="messageText">{this.state.message['text']}</p>;
                        messageType = "Message";
                    }
                    break;
            }
        }
        
        let profileImage;
        if(!(picture==="")){
            profileImage = <img className="profilePicture" src={picture} />;
        }
        let profileName;
        if(!(link==="")){
            if(link.indexOf('@') > -1){
            let email = "mailto:"+link;
                profileName = <a href={email} className="username">{this.state.message['username']}</a>
            } else {
                profileName = <a href={link} className="username">{this.state.message['username']}</a>   
            }
        } else if(link===""){
            profileName = <b className="username">{this.state.message['username']}</b>
        }
        
        //Draw the message with the user picture and make the username bold (Not a link)
        return (<li className={((link==="" && picture==="")?"bot_":"")+"messageItem"}>
                    {profileImage}{profileName}
                    {messageText}
                </li>);
        /*//If there is user picture...
        if(!(picture==="")){
            //If there is NO link...
            if(link===""){
                //Draw the message with the user picture and make the username bold (Not a link)
                return (<li className={"message"+messageType}>
                            {profileImage}{profileName}
                            {messageText}
                        </li>);
            //If there is a link...
            } else {
                //If the link has an @ in it, it is an email...
                if(link.indexOf('@') > -1){
                    //Draw the message with a mailto link
                    let email = "mailto:"+link;
                    return (<li className="messageItem">
                            <img className="profilePicture" src={picture} /><a href={email} className="username">{this.state.message['username']}</a>
                            {messageText}
                        </li>);
                //Otherwise, it is a link
                } else {
                    //Draw the message with a link to the user's profile
                    return (<li className="messageItem">
                            <img className="profilePicture" src={picture} /><a href={link} className="username">{this.state.message['username']}</a>
                            {messageText}
                        </li>); 
                }
            }
        } else {
            //If there is NO picture or link
            if(link===""){
                //Don't draw a picture and make the name bold instead of a link
                return (<li className="bot_messageItem">
                            <b className="username">{this.state.message['username']}</b>
                            {messageText}
                        </li>);
            //If there is NO picture but there is a link
            } else {
                //Draw the user with a link but not picture
                return (<li className="messageItem">
                            <a href={link} className="username">{this.state.message['username']}</a>
                            {messageText}
                        </li>);
            }
        }*/
    }
}