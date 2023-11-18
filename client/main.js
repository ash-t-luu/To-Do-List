import { loginOauthUser, loginUser, registerUser } from './auth.js';
import { checkLoggedIn } from './auth.js';
import { getGoogleOauthURL } from './oauth.js';
import './oauth.js';
import './api.js';
import './taskContainer.js';
import './styles.css';

const loginSection = document.getElementById('loginForm');
const signupSection = document.getElementById('signUpForm');
const signupLink = document.getElementById('signupLink');
const taskContainer = document.querySelector('.todo-container');
const oAuthLink = document.createElement('a');
oAuthLink.href = getGoogleOauthURL();
oAuthLink.textContent = 'OAuth Login';

loginSection.appendChild(oAuthLink);

loginSection.addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await loginUser(username, password);
        if (response && response.message === 'Login Successful') {
            loginSection.style.display = 'none';
            taskContainer.style.display = 'flex';
            checkLoggedIn();
        } else {
            console.error('Error logging in:', response.message);
        };
    } catch (error) {
        console.error('Error:', error);
    };
});

signupLink.addEventListener('click', function (e) {
    e.preventDefault();
    loginSection.style.display = 'none';
    signupSection.style.display = 'flex';
});

signupSection.addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username-register').value;
    const password = document.getElementById('password-register').value;
    try {
        const response = await registerUser(username, password);
        console.log('response', response);
        if (response && response.message === 'Signup Successful') {
            loginSection.style.display = 'flex';
            signupSection.style.display = 'none';
        } else {
            console.error('Error signing up:', response.message);
        };
    } catch (error) {
        console.error('Error:', error);
    };
});

