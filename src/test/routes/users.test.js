const request = require('supertest');
const buildApp = require('../../app');
const UserRepo = require('../../repos/user-repo');
const pool = require('../../pool');

beforeAll(()=>{
    return pool.connect({
        host: 'localhost',
        port: 5432,
        database: 'socialnetwork2',
        user: 'postgres',
        password: 'postgresroot'
    })
})

it('create a user ', async ()=>{
    const app = buildApp();
    const startCount = await UserRepo.count();
    expect(startCount).toBe(0);

    await request(app).post('/users')
    .send({
        username: 'testuser',
        bio: 'This is a test bio'
    })
    .expect(200)
    
    const finishCount = await UserRepo.count();
    expect(finishCount).toBe(1);
})