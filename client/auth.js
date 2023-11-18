import { fetchData } from "./taskContainer";

export async function loginUser(username, password) {
    try {
        const response = await fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok && response.status === 201) {
            const data = await response.json();
            return data;        
        } else {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }
    } catch (error) {
        throw new Error(`Error during signup: ${error.message}`);
    };
};

export async function loginOauthUser(username, password) {
    try {
        const response = await fetch('/api/sessions/oauth/google');

        if (response.ok) {
            const data = await response.json();

            if (data.message === 'OAuth Login Successful') {
                loginSection.style.display = 'none';
                taskContainer.style.display = 'flex';
                checkLoggedIn();
            } else {
                throw new Error(data.message);
            }
        } else {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }
    } catch (error) {
        throw new Error(`Error during signup: ${error.message}`);
    };
};


export async function registerUser(username, password) {
    try {
        const response = await fetch('/user/signup', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        console.log(username, password)

        if (response.ok && response.status === 201) {
            return await response.json();
        } else {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }
    } catch (error) {
        throw new Error(`Error during signup: ${error.message}`);
    }
}

export async function checkLoggedIn() {
    try {
        const response = await fetch('/user/verify', {
            method: 'GET',
            credentials: 'include'
        });

        if (response && response.status === 200) {
            await response.json();
            const main = document.querySelector('.main');
            const taskDisplay = document.querySelector('.todo-container');
            main.style.display = 'none';
            taskDisplay.style.display = 'block';
            await fetchData();
        } else {
            throw new Error('Token verification failed');
        }
    } catch (error) {
        throw new Error(`Error during verify: ${error.message}`);
    }
}