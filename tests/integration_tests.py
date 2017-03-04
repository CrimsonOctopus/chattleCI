# integration_tests.py
import app, unittest, flask_testing, requests

class ServerIntegrationTestCase(
    flask_testing.LiveServerTestCase
):
    def create_app(self):
        return app.app

    def test_server_sends_index(self):
        r = requests.get(self.get_server_url())
        self.assertNotEquals(r.text, None)
    def test_server_sends_about(self):
        r = requests.get(self.get_server_url())
        self.assertNotEquals(r.text, None)

if __name__ == '__main__':
    unittest.main()