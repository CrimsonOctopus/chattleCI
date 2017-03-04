# Chattle by Mathew Tomberlin

This is a simple chat application that allows a user to log in using a Facebook or Google account.

## Strange World Theme Pack!

The theme of this chat application is a trippy Mario world, but this theme is more
of a reflection of the apps current state as a somewhat amorphous blob of buttons and text.
The theme can be seen in the background of the page and the somewhat spare use of color
otherwise.

## Known Issues

1. Logging out of Facebook does not properly remove the user from the room list
2. Logging out of Google sometimes removes the wrong user from the room list
3. The user's access tokens are not saved in the database, therefor the user must re-log in each time
4. Whether the user is logged in via Facebook or Google is shown (the text in the buttons changes), but it's not obvious
5. Chatty the Chatbot needs to be more functional... or at least admit his uselessness