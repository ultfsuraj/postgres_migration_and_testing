const express = require('express');
const usersRouter = require('./routes/users');

module.exports = ()=>{
    const app = express();
    app.use(express.json()); 
    app.use('/api', usersRouter);
    
    return app;
}