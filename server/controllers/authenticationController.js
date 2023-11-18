const jwt = require('jsonwebtoken');

const userController = require('../controllers/userController');
const authenticationController = {};
const config = require('config');

authenticationController.createCookie = (req, res, next) => {
    try {
        if (req.cookies.SSID) res.clearCookie('SSID');
        const user_id = res.locals.user_id;
        const jToken = jwt.sign({ user_id }, process.env.SECRET, { expiresIn: '1h' });
        res.cookie('SSID', jToken, { expires: new Date(Date.now() + 600_000), httpOnly: true });
        return next();
    } catch (error) {
        return next({
            log: "Error occurred creating the cookie",
            status: 500,
            message: { error: "Error in authenticationController.createCookie controller" },
        });
    }
};

authenticationController.verifyCookie = async (req, res, next) => {
    const jToken = req.cookies.SSID;
    if (!jToken) {
        return res.status(403).json({ Error: 'Unauthorized: Token Not Provided' });
    };

    try {
        const decoded = jwt.verify(jToken, process.env.SECRET);
        res.locals.decoded = decoded;
        return next();
    } catch (error) {
        res.locals.verified = false;
        return next();
    };
};

authenticationController.clearCookie = async (req, res, next) => {
    try {
        if (res.locals.verified === true) {
            await res.clearCookie('SSID');
        };
        return next();
    } catch (error) {
        return next({
            log: "Error occurred in clearing the cookie",
            status: 500,
            message: { error: "Error in authenticationController.clearCookie controller" },
        });
    };
};

authenticationController.googleOauthHandler = async (req, res, next) => {
 // get code form query string
 const code = req.query.code;

 try {
    // get id and access token with the code
    const {id_token, access_token} = await userController.getGoogleOAuthToken(code);
    // console.log(id_token, access_token, 'testing');

    // then get the user with token   
    // const googleUser = jwt.decode(id_token); -- another way to validate
    const googleUser = await userController.getGoogleUser(id_token, access_token);

    console.log(googleUser, 'user');

    if (!googleUser.verified_email){
        return res.status(403).send({ message: 'Google Account is not verified'});
    }

    // then upsert user and create session
    const user = await userController.upsertUser(googleUser);
    console.log(user, 'upsertUser');
    res.locals.user_id = user.rows[0].user_id;
    console.log(res.locals.user_id, 'user_id');
    // already have middleware for this
    // create access & refresh token
    // set cookies
    // redirect to client
    return next();
 } catch (error) {
    return next({
        log: "Error occurred in handling Google OAuth",
        status: 500,
        message: { error: "Error in authenticationController.googleOauthHandler" },
    });
 }
}

module.exports = authenticationController;