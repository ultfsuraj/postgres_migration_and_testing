const request = require('supertest');
const buildApp = require('../../app');
const UserRepo = require('../../repos/user-repo');
const pool = require('../../pool');
const Context = require('../context');

let context;

beforeAll(async ()=>{
   context = await Context.build();
   
});

afterAll(async ()=>{
    return context.close();
})

it('create a user ', async ()=>{
    const app = buildApp();
    const startCount = await UserRepo.count();

    await request(app).post('/users')
    .send({
        username: 'testuser',
        bio: 'This is a test bio'
    })
    .expect(200)
    
    const finishCount = await UserRepo.count();
    expect((+finishCount)-(+startCount)).toBe(1);
})