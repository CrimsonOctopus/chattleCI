import unittest
import app
import json

class ChatBotResponseTest(unittest.TestCase):
    def test_not_command(self):
        response = app.parseWithChatty("TestUser" + ",.," + '!! Potato',"")
        self.assertEquals(response, None)
    def test_is_command(self):
        response = app.parseWithChatty("TestUser" + ",.," + '!! help',"")
        self.assertNotEqual(response, None)
    def test_about_command(self):
        response = app.parseWithChatty("TestUser" + ",.," + '!! about',"")
        self.assertNotEqual(response, None)
    def test_say_command(self):
        response = app.parseWithChatty("TestUser" + ",.," + '!! say hello',"")
        self.assertEquals(response["text"], "TestUser says hello")
    def test_saySpecial_command(self):
        response = app.parseWithChatty("TestUser" + ",.," + '!! saySpecial \thello\nworld',"")
        self.assertEquals(response["text"], "TestUser says\n")
    def test_saySpecial_invalidArgs_command(self):
        response = app.parseWithChatty("TestUser" + ",.," + '!! saySpecial',"")
        self.assertEquals(response, None)
    def test_say_invalidArgs_command(self):
        response = app.parseWithChatty("TestUser" + ",.," + '!! say',"")
        self.assertEquals(response, None)
    def test_enter_command(self):
        response = app.parseWithChatty("TestUser" + ",.," + '>> TestUser',"")
        self.assertEquals(response["text"], "Welcome TestUser! Type !!help for a list of commands!")
    def test_exit_command(self):
        response = app.parseWithChatty("TestUser" + ",.," + '<< TestUser',"")
        self.assertEquals(response["text"], "Everyone say goodbye to TestUser!")
    def test_messages(self):
        messages = app.getMessages()
        self.assertNotEqual(messages,None)
    def test_invalid_user(self):
        i = app.getUserIndex("TestUser")
        self.assertLess(i,0)

if __name__ == '__main__':
    unittest.main()