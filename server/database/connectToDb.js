require('dotenv').config();
const { Pool } = require('pg');

const pgURL = process.env.PGURL;

const pool = new Pool({
    connectionString: pgURL
});

module.exports = {
    query: async (text, params, callback) => {
        try {
            const result = await pool.query(text, params);
            return result;
        } catch (error) {
            console.error('Error executing query: ', error.message);
            throw error;
        }
    }
};