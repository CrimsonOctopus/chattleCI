"""
This is the main server file for this application. It imports flask (For HTML templating, Python server, webpack script watching, JS React, etc).
"""
import os
import sys
import flask
import flask_socketio
import json
import requests
import urllib
import xml.etree.ElementTree as ET

app = flask.Flask(__name__)
import models

#Get the flask_socketio socket
socketio = flask_socketio.SocketIO(app)

#Chatroom messages
messages = []
users = []

#API Keys/Secrets
google_api_key = os.getenv("GOOGLE_API_KEY")
#apisecret = os.getenv("IMAGES_API_SECRET")

#index endpoint
@app.route('/')
def index():
    return flask.render_template('index.html')
#index endpoint
@app.route('/about')
def about():
    return "About this app: Not much to say"
"""@socketio.on('connect') 
def on_connect():
    socketio.emit('client connected', {
        'message': 'connected'
})"""
#On socketio connect... (When a client connects...)
#TODO: Authenticate before showing messages
@socketio.on('user connected') 
def on_user_connect(data):
    text = ''
    if data['facebook_user_token']!='':
        response=requests.get('https://graph.facebook.com/v2.8/me?fields=id%2Cname%2Cpicture&access_token='+data['facebook_user_token'])
        userJSON=response.json()
        print'Someone authorized with Facebook'
        if userJSON['name']!=None:
            user= {'text':userJSON['name']}
            text = userJSON['name']
    elif data['google_user_token']!='':
        response=requests.get('https://www.googleapis.com/plus/v1/people/me?key='+google_api_key+'&access_token='+data['google_user_token'])
        userJSON=response.json()
        print'Someone authorized with Google'
        if userJSON['displayName']!=None:
            user= {'text':userJSON['displayName']}
            text = userJSON['displayName']
    else:
        user = None
    if user is not None:
        #Query for all Message models
        messages = getMessages()
        #Append the new user to te list of users
        users.append(user)
        #Send the username up with the message marker >>
        serverMessage = parseWithChatty(user['text'] + ",.," + ">> "+text,"")
        #If the message had markers (It did), append the server message to the message list
        if serverMessage is not None:
            messages.append(json.dumps(serverMessage))
            
        #Emit the new list of messages to all the clients
        socketio.emit('all users', {
            'usernames': users,
        })
        
        #Emit the new list of messages to all the clients
        socketio.emit('all messages', {
            'messages': messages,
        })
        
        return user['text']
    else:
        #Emit the new list of messages to all the clients
        socketio.emit('all messages', {
            'messages': None
        })
    
@socketio.on('user quit') 
def on_quit(data):
    print data['username']+" is leaving!"
    user= {'text':data['username']}
    #users = getUsers()
    
    index = getUserIndex(data['username'])
        
    #Query for all Message models
    messages = getMessages()
    
    serverMessage = parseWithChatty(user['text'] + ",.," + "<< "+data['username'],"")
    if serverMessage is not None:
        messages.append(json.dumps(serverMessage))
    #Emit the new list of messages to all the clients
    socketio.emit('all users', {
        'usernames': users,
    })
    
    #Emit the new list of messages to all the clients
    socketio.emit('all messages', {
        'messages': messages,
    })
    
    return data['username']
    
#On socketio disconnect... (When a client disconnects...)
#TODO: Authenticate before showing messages
@socketio.on('user disconnected') 
def on_disconnect(data):
    print'Someone disconnected!'
    
    socketio.emit('user quit', {
        'service': data['service'],'username':data['username']
    })
    
    return data['username'];

#On socketio recieve new message... (When client sends a message)
#TODO: Authenticate before sending messages
@socketio.on('new message') 
def messageRecieved(data):
    print'Sent a message!'
    if data['facebook_user_token']!='':
        response=requests.get('https://graph.facebook.com/v2.8/me?fields=id%2Cname%2Cpicture%2Clink&access_token='+data['facebook_user_token'])
        userJSON=response.json()
        if userJSON['name']!=None:
            print "USER DATA:"+str(userJSON);
            if userJSON.has_key('link'):
                print "LINK:"+userJSON['link']
                link = userJSON['link']
            else:
                print "NO LINK"
                link = ''
            user= {'text':userJSON['name'],'picture':userJSON['picture']['data']['url'],'link':link}
            #print 'text:'+userJSON['name']+',picture:'+userJSON['picture']+',link:'+link
            
    elif data['google_user_token']!='':
        response=requests.get('https://www.googleapis.com/plus/v1/people/me?key='+google_api_key+'&access_token='+data['google_user_token'])
        userJSON=response.json()
        if userJSON['displayName']!=None:
            print "USER DATA:"+str(userJSON);
            if userJSON.has_key('url'):
                link = userJSON['url']
            else:
                if userJSON['emails'][0].has_key('value'):
                    link = userJSON['emails'][0]['value']
                else:
                    link = ''
            user= {'text':userJSON['displayName'],'picture':userJSON['image']['url'],'link':link}
            print 'text:'+userJSON['displayName']+',picture:'+userJSON['image']['url']+',link:'+link
    else:
        user = None
    if user is not None:
        #Query for all Message models
        messages = getMessages()
        
        #Create a new message JSON
        message= {'text':data['message']['text'],'username':user['text'],'picture':user['picture'],'link':user['link']}
        serverMessage = parseWithChatty(user['text'] + ",.," + data['message']['text'], google_api_key)
        if serverMessage is None:
            #Append the new message to the global messages array
            messages.append(json.dumps(message))
            #Commit it to the DB
            commitMessage(message)
        else:
            messages.append(json.dumps(serverMessage))
        
        #Emit the new list of messages to all the clients
        socketio.emit('all messages', {
            'messages': messages
        })
        
        return message
    else:
        #Emit the new list of messages to all the clients
        socketio.emit('all messages', {
            'messages': None
        })
    
def parseWithChatty(message, apiKey):
    print "Parsing Message: "+message
    print "Checking For Markers: "+message[0:2]
    username, messageString = message.split(",.,",2)
    text = ""
    if messageString[:2]=="!!":
        print "Checking ForCommands: "+messageString[2:]
        args = messageString.split(" ")
        if args[1]=="help":
            print "Found help command"
            text = "\bCommands:\n\t-about\n\t-say 'message to say'\n\t-saySpecial '\\tThis line will be italic\\n\\bAnd this one will be bold!\\n'\n\t-translate [FromLangCode] [ToLangCode] 'message to translate and say'\n\t-translateFreq [FromLangCode] [ToLangCode]\n\b2-Letter Language Codes:\nen(glish), es(panol), fr(ench), it(alian), tl(tagalog),de(german)"
        if args[1]=="about":
            print "Found about command"
            text = "\bAbout Chattle:\nChattle is a fun and inviting chatroom that encourages individuals to expand their language boundaries by discovering their most frequently used words in foreign languages."
        elif args[1]=="translate":
            print "Found translate command"
            messageText = ""
            for i in range(0,len(args)):
                if i > 3:
                    #Such a great use of index right here... marvelous
                    messageText = " ".join(args[4:])
            print messageText
            
            translation_result = requests.get('https://translation.googleapis.com/language/translate/v2?key='+apiKey+'&source='+args[2]+'&target='+args[3]+'&q='+messageText)
            translatedText = json.loads(translation_result.content)["data"]["translations"][0]["translatedText"]
            text = username + " says " + translatedText
        elif args[1]=="translateFreq":
            print "Found translateFreq command"
            #Query for all Message models
            messages = getMessages();
            words = [];
            book = {};
            topWords=parseMessages(words,book,username,messages)
            
            translatedWords = []
            text = username + "'s most frequently used words are "
            for topWord in topWords:
                if topWord is not None:
                    print "Top"+topWord
                    translation_result = requests.get('https://translation.googleapis.com/language/translate/v2?key='+apiKey+'&source='+args[2]+'&target='+args[3]+'&q='+topWord)
                    translatedWord = '{}'.format(u""+json.loads(translation_result.content)["data"]["translations"][0]["translatedText"])
                    translatedWords.append(translatedWord)
                    print "Trans"+translatedWord
                    #print "Result"+json.loads(translation_result.content)
            text+= " ".join(translatedWords)
            print "Text"+text
        elif args[1]=="say":
            messageText = ""
            if len(args) <= 2:
                return None
            for i in range(0,len(args)):
                if i > 1:
                    #I <3 Python ternaries
                    messageText += args[i] + (" " if (i<len(args)-1) else "")
            print messageText
            
            text = username+ " says "+messageText
        elif args[1]=="saySpecial":
            messageText = ""
            if len(args) <= 2:
                return None
            for i in range(0,len(args)):
                if i > 1:
                    #I <3 Python ternaries
                    messageText += args[i] + (" " if (i<len(args)-1) else "")
            mT = messageText.split(r"\n")
            
            text = username+ " says\n"
            for i in range(0,len(mT)):
                if mT[i][:2] == r"\b":
                    text += '\b' + mT[i][2:] + '\n'
                elif mT[i][:2] == r"\t":
                    text += '\t' + mT[i][2:] + '\n'
    if messageString[:2]==">>":
        print "Chatty read that a user logged in"
        text = "Welcome "+username+"! Type !!help for a list of commands!"
    if messageString[:2]=="<<":
        print "Chatty read that a user logged out"
        text = "Everyone say goodbye to "+username+"!"
    
    if(text!=""):
        message={'text':text,'username':'Chatty','picture':'','link':''}
        commitMessage(message)
        return message
    
    return None
    
def wordCount(book,word):
    #If the word is longer than 3 characters... (To reduce the number of results somewhat)
    if len(word) > 3:
        print word
        #initialize count
        count = 0
        #If the dict already has the word
        if book.has_key(word):
            #Get the word count
            count = book[word]
        
        return count
    return None

def parseMessage(words,book,username, message):
    totalWords = 0
    #If this is the right user...
    if message["username"]==username:
        #If there is text...
        if message["text"] != None:
            print message["text"]
            #Split the sentance in to words
            words = message["text"].split(" ");
            #For each word
            for i in range(0,len(words)):
                totalWords+=1
                count = wordCount(book,words[i])
                if count is not None:
                    book[words[i]]=count+1
            print totalWords
            return totalWords
        else:
            return None
            
def compare_to_top(wordCount, word, topWordCount, topWords):
    #If there are "open" slots in the top words array...
    if len(topWords) < 5:
        #Add this word count to top words
        topWordCount.append(wordCount)
        #Add the word to the top words
        topWords.append(word)
        #We added it to the top words so 0 it in case it gets checked again
        wordCount=0
    #If there are no open slots...
    else:
        #For each slot
        for slot in range(0,5):
            #if the count of a word is > count of the word in a slot...
            if wordCount > topWordCount[slot]:
                #Set the top word count for the slot to the count for the word
                topWordCount[slot] = wordCount
                #Set the top word for the slot to the word
                topWords[slot] = word
                #Set the count for this word to 0 in case it gets checked again
                wordCount=0
    return wordCount

def get_top_words(book):
    #Words with highest count
    topWordCount = []
    topWords = []
    #Words
    keys = book.keys()
    #For each word
    for word in keys:
        book[word] = compare_to_top(book[word], word, topWordCount, topWords)
    return topWords
                    
def parseMessages(words,book,username,messages):
    #For each message
    for i in range(0,len(messages)):
        parseMessage(words,book,username,json.loads(messages[i]))
    
    return get_top_words(book)
        
#Commit a message to the database
def commitMessage(message):
     #Create a Message model object for the new message
    message = models.Message(message['text'],message['username'],message['picture'],message['link'])
    #Add the new Message model object to the "session" (like git's working area?)
    models.db.session.add(message)
    #Commit the changes to the database
    models.db.session.commit()

#Get all previous messages from the database
def getMessages():
    #Query for all Message models
    messagesQuery = models.Message.query.all()
    #Convert the query in to an array of strings
    all_messages = [];
    for i in range(0,len(messagesQuery)):
        message = {'text':messagesQuery[i].text, 'username':messagesQuery[i].username, 'picture':messagesQuery[i].picture, 'link':messagesQuery[i].link}
        all_messages.append(json.dumps(message))
    if len(all_messages)>0:
        return all_messages #mssgs
    
    return None
    
def getUserIndex(username):
    print "Searching for user "+username
    index = -1
    for i in range(0,len(users)):
        print users[i]['text'] +" vs "+username
        if users[i]['text']==username:
            index = i
            del users[i]
            return index
    return -1

if __name__ == '__main__':
    socketio.run(app,host=os.getenv('IP','0.0.0.0'),port=int(os.getenv('PORT',8080)),debug=True)
