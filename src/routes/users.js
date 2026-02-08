const express = require('express');
const UserRepo = require('../repos/user-repo');

const router = express.Router();

router.get('/users', async (req,res)=>{
    const users = await UserRepo.find();

    res.send(users)
});

router.get('/users/:id', async (req,res)=>{
    const {id} = req.params;
    const user = UserRepo.findById(id);

    if(!user){
        res.status(404).send({message: 'User not found'});
        return;
    }
    res.send(user);
});

router.post('/users', async (req,res)=>{});

router.put('/users/:id', async (req,res)=>{});

router.delete('/users/:id', async (req,res)=>{});

module.exports = router;