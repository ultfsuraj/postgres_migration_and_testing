const pg = require('pg');

class Pool {
    _pool = null;

    connect(options){
        this._pool = new pg.Pool(options);
        // checks if credentials are valid
        return this._pool.query('SELECT 1+1;');
    }
}

module.exports = new Pool();