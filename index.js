
const app = require('./src/app');
const pool = require('./src/pool');

// connect successfully before we start listening 

pool.connect({
    host: 'localhost',  
    port: 5432,
    user: 'postgres',
    password: 'postgresroot',
    database: 'socialnetwork2'
}).then(()=>{

    app().listen(3005,()=>{
        console.log('Server is running on port 3005');
    })

}).catch((err)=>{
    console.error('Failed to connect to the database:', err);
});

