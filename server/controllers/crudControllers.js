const pool = require('../database/connectToDb');
const jwt = require('jsonwebtoken');

const crudController = {};

crudController.getTask = async (req, res, next) => {
    const token = req.cookies.SSID;
    console.log('token', token);
    const tokenBody = jwt.decode(token, { complete: true });
    console.log('token', tokenBody);
    const user_id = tokenBody.payload.user_id;

    console.log('user_id', user_id);

    const getTaskQuery = `SELECT task_name, task_id
    FROM tasks
    WHERE user_id = $1`;

    try {
        // if (res.locals.verified === true) {
        const result = await pool.query(getTaskQuery, [user_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ Error: 'No tasks found' });
        };
        console.log('result', result.rows);
        res.locals.tasks = result.rows;
        return next();
        // }
    } catch (error) {
        return next({
            log: 'Error occured in crudController.getTask',
            status: 500,
            message: { err: 'An error occurred in crudController.getTask' },
        });
    }
};

crudController.addTask = async (req, res, next) => {
    const token = req.cookies.SSID;
    const tokenBody = jwt.decode(token, { complete: true });
    const user_id = tokenBody.payload.user_id;
    const { task_name } = req.body;
    const addTaskQuery = `INSERT INTO tasks
    (task_id, task_name, user_id)
    VALUES (DEFAULT, $1, $2) RETURNING *`;

    const values = [task_name, user_id];

    console.log(values);
    try {
        const result = await pool.query(addTaskQuery, values);
        res.locals.addTask = result.rows;
        return next();
    } catch (error) {
        return next({
            log: 'Error occured in crudController.addTask',
            status: 500,
            message: { err: 'An error occurred in crudController.addTask' },
        });
    }
};

crudController.updateTask = async (req, res, next) => {
    const token = req.cookies.SSID;
    const tokenBody = jwt.decode(token, { complete: true });
    const user_id = tokenBody.payload.user_id;
    const { taskId } = req.params;
    const { task_name } = req.body;

    const updateTaskQuery = `UPDATE tasks
    SET task_name = $1
    WHERE (user_id = $2 and task_id = $3)
    RETURNING *`;

    const values = [task_name, user_id, taskId];

    try {
        const result = await pool.query(updateTaskQuery, values);
        res.locals.updateTask = result.rows;
        return next();
    } catch (error) {
        return next({
            log: 'Error occured in crudController.updateTask',
            status: 500,
            message: { err: 'An error occurred in crudController.updateTask' },
        });
    }
};

crudController.deleteTask = async (req, res, next) => {
    const token = req.cookies.SSID;
    const tokenBody = jwt.decode(token, { complete: true });
    const user_id = tokenBody.payload.user_id;
    const { taskId } = req.params;

    const deleteTaskQuery = `DELETE FROM tasks
    WHERE (task_id = $1 AND user_id = $2)
    RETURNING *`;

    const values = [taskId, user_id];

    try {
        const result = await pool.query(deleteTaskQuery, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Could not find task to delete' });
        }
        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        return next({
            log: 'Error occured in crudController.deleteTask',
            status: 500,
            message: { err: 'An error occurred in crudController.deleteTask' },
        });
    }
};


module.exports = crudController;