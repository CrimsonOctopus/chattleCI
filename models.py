import os
import flask_sqlalchemy, app

app.app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db = flask_sqlalchemy.SQLAlchemy(app)

class Message (db.Model):
    id = db.Column(db.Integer,primary_key=True) # key
    text = db.Column(db.String(1024))
    username = db.Column(db.String(120))
    picture = db.Column(db.String(200))
    link = db.Column(db.String(200))
    
    def __init__(self,t,username,picture,link):
        self.text=t
        self.username=username
        self.picture=picture
        self.link=link
        
    def __repr__(self):
        # what's __repr__?
        return'<Message text: %s>' % self.text
        
class UserProfile (db.Model):
    id = db.Column(db.Integer,primary_key=True) # key
    username = db.Column(db.String(120))
    picture = db.Column(db.String(200))
    
    def __init__(self,username,picture):
        self.username=username
        
    def __repr__(self):
        # what's __repr__?
        return'<UserProfile text: %s>' % self.username