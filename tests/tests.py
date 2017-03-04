import unittest
import functions

class ChatBotResponseTest(unittest.TestCase):
    def test_not_command(self):
        response = functions.get_chatbot_response('Potato')
        self.assertEquals(response, '')
    def test_hello_command(self):
        response = functions.get_chatbot_response('!! add 5 1')
        self.assertEquals(response, '51')

if __name__ == '__main__':
    unittest.main()