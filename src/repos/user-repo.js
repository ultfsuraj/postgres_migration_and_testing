const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class UserRepo {
    static async find(){
        const {rows} = await pool.query('SELECT * FROM users;');

        return toCamelCase(rows);
    }

    static async findById(id){
        // REALLY BIG SECURITY ISSUE... SQL INJECTION
        // const {rows} = await pool.query(`SELECT * FROM users WHERE id = ${id};`);

        // SOLUTION: PARAMETERIZED QUERIES
        const {rows} = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);

        if(rows.length === 0){
            return null;
        }
        return toCamelCase(rows)[0];
    }

    static async insert(user){

    }

}

module.exports = UserRepo;