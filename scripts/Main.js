import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Content } from './Content';
import { FacebookLoginButton } from './FacebookLoginButton';
import { GoogleLoginButton } from './GoogleLoginButton';
import { UserList } from './UserList';

ReactDOM.render(<GoogleLoginButton />, document.getElementById('googleButton'));
ReactDOM.render(<FacebookLoginButton />, document.getElementById('facebookButton'));
ReactDOM.render(<Content />, document.getElementById('content'));
ReactDOM.render(<UserList />, document.getElementById('userlist'));