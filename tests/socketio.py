import unittest
import app
import json

class SocketIOTest(unittest.TestCase):
    def test_no_token_message(self):
        client = app.socketio.test_client(app.app)
        client.emit('new message', {'facebook_user_token':'','google_user_token':'','message':{'text': "Some text"}})
        r = client.get_received()
        # print r
        self.assertEquals(len(r), 1)
        from_server = r[1]
        self.assertEquals(
            from_server['name'],
            'all messages'
        )
        data = from_server['args'][0]
        self.assertEquals( data['messages'], None )
    def test_no_token_connected(self):
        client = app.socketio.test_client(app.app)
        client.emit('user connected',  {'facebook_user_token':'','google_user_token':'','username':'TestUser'})
        r = client.get_received()
        # print r
        #self.assertEquals(len(r), 2)
        from_server = r[1]
        self.assertEquals( from_server['name'], 'all messages' )
        data = from_server['args'][0]
        self.assertEquals( data['messages'], None )
    def test_disconnected(self):
        client = app.socketio.test_client(app.app)
        client.emit('user disconnected',  {'service':'Google','username':'TestUser'})
        r = client.get_received()
        # print r
        #self.assertEquals(len(r), 2)
        from_server = r[1]
        self.assertEquals( from_server['name'], 'user quit' )
        data = from_server['args'][0]
        self.assertEquals( data['service'], 'Google' )
        self.assertEquals( data['username'], 'TestUser' )
    def test_user_quit(self):
        client = app.socketio.test_client(app.app)
        client.emit('user quit', {'username':'TestUser'})
        r = client.get_received()
        # print r
        #self.assertEquals(len(r), 2)
        from_server = r[1]
        self.assertEquals(
            from_server['name'],
            'all messages'
        )
        data = from_server['args'][0]
        self.assertNotEquals( data['usernames'], None )

if __name__ == '__main__':
    unittest.main()