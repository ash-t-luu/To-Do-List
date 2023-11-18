const bcrypt = require('bcrypt');
const pool = require('../database/connectToDb');
const config = require('config');
const axios = require('axios');
const qs = require('querystring');
const userController = {};

userController.createUser = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(401).json({ Error: 'Invalid username or password' });
    };

    try {
        //check if user exists
        const checkUserQuery = `SELECT *
        FROM users
        WHERE username = $1`;
        const value = [username];

        const existingUser = await pool.query(checkUserQuery, value);

        if (existingUser.rowCount >= 1) {
            return res.status(401).json({ Error: 'User already exists' });
        } else {
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const bcryptPassword = await bcrypt.hash(password, salt);

            const createUserQuery = `INSERT INTO users
            (username, password) 
            VALUES ($1, $2)
            RETURNING *`;

            const result = await pool.query(createUserQuery, [username, bcryptPassword]);

            res.locals.user = result;
            return next();
        }
    } catch (error) {
        console.error('Error executing query:', error);
        return next({
            log: 'Error occured in userController.createUser',
            status: 500,
            message: { err: 'An error occurred in userController.createUser' },
        });
    }
};

userController.verifyUser = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(401).json({ error: 'Invalid username or password' });
    };

    const existingUser = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
    if (existingUser.rowCount === 0) {
        return res.redirect('/signup');
    };

    console.log(`Made it to bcrypt in userController.verifyUser`);

    try {
        bcrypt
            .compare(password, existingUser.rows[0].password)
            .then((result) => {
                if (result === false) {
                    return next({
                        log: 'Incorrect username or password',
                        status: 401,
                        message: { err: 'An error occurred in userController.verifyUser' },
                    });
                } else {
                    console.log('Bcrypt compare successful');
                    res.locals.user_id = existingUser.rows[0].user_id;
                    return next();
                };
            });
    } catch (error) {
        return next({
            log: 'Error occurred verifying the user',
            status: 500,
            message: { err: 'Error in userController.verifyUser controller' },
        });
    };
};

userController.getGoogleOAuthToken = async (code) => {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
        code,
        client_id: config.get('googleClientId'),
        client_secret: config.get('googleClientSecret'),
        redirect_uri: config.get('googleOauthRedirectUrl'),
        grant_type: 'authorization_code'
    };

    // console.log(values, 'values');
    try {
        const result = await axios.post(url, qs.stringify(values), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        return result.data;
    } catch (error) {
        console.error('ERROR: ', error.response.data.error);
        throw new Error(error.message);
    }
}

userController.getGoogleUser = async (id_token, access_token) => {
    try {
        const result = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
            headers: {
                Authorization: `Bearer ${id_token}`
            }
        });
        return result.data;
    } catch (error) {
        console.error('ERROR: ', error.response.data.error);
        throw new Error(error.message);
    }
};

userController.upsertUser = async (googleUser) => {

    try {
        const checkUserQuery = `SELECT * FROM users WHERE email = $1`;
        const checkUserRes = await pool.query(checkUserQuery, [googleUser.email]);

        if (checkUserRes.rows.length > 0) {
            const updateUserQuery = `UPDATE users SET oauth_email = $1
            WHERE email = $2 RETURNING *`;
            const result = await pool.query(updateUserQuery, [googleUser.email]);
            return result;
        } else {
            const insertUserQuery = `INSERT INTO users (user_id, username, password, email, oauth_email) VALUES (uuid_generate_v4(), $1, $2, $3, $4) RETURNING *`;
            const defaultPass = 'oauthuser'
            const values = [googleUser.name, defaultPass, googleUser.email, googleUser.email];
            const result = await pool.query(insertUserQuery, values);
            return result;
        }
    } catch (error) {
        console.error('ERROR: ', error.response.data.error);
        throw new Error(error.message);
    }
};

module.exports = userController;