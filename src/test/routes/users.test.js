const request = require('supertest');
const buildApp = require('../../app');
const UserRepo = require('../../repos/user-repo');
const pool = require('../../pool');

const {randomBytes} = require('crypto');
const {default: migrate} = require('node-pg-migrate');
const format = require('pg-format');

beforeAll(async ()=>{
    // randomly generating a role/user name to connect to PG as
    // postgres role has to start with a letter, randomBytes returns letters and numbers
    const roleName = 'a'+ randomBytes(4).toString('hex');

    // connect to PG as usual
    await pool.connect({
        host: 'localhost',
        port: 5432,
        database: 'socialnetwork2_test',
        user: 'postgres',
        password: 'postgresroot'
    })

    // create a new role with above generated role
    await pool.query(format(`
        CREATE ROLE %I WITH LOGIN PASSWORD %L;    
    `, roleName, roleName));

    // create a schema with the same name 
    await pool.query(format(`
        CREATE SCHEMA %I AUTHORIZATION %I;    
    `, roleName, roleName));

    // disconnect entirely from PG 
    await pool.close();

    // run migrations inside the new schema 
    // tests run in parallel, and generally migrations are done one by one
    // multiple tests running their migrations in parallel, this may error
    // with noLock: true we're saying not to lock the db when migration is running
    await migrate({
        schema: roleName,
        direction: 'up',
        log: ()=>{},
        noLock: true,
        dir: 'migrations',
        databaseUrl: {
            host: 'localhost',
            port: 5432,
            database: 'socialnetwork2_test',
            user: roleName,
            password: roleName
        }
    })

    // connect to PG as the newly created role  (same name as that of schema)
    // so all the queries executed later will refer to the schema as that of user/role
    await pool.connect({
        host: 'localhost',
        port: 5432,
        database: 'socialnetwork2_test',
        user: roleName,
        password: roleName
    });

});

afterAll(()=>{
    return pool.close();
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