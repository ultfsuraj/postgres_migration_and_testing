const pool = require('./Pool');

class UserRepo {
    static async find(){
        const {rows} = await pool.query('SELECT * FROM users;');
        
        return rows;
    }

    static async findById(id){

    }

    static async insert(user){

    }



}