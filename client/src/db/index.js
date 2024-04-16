import { Pool } from 'pg'
import { PgPool } from 'pg-pool'

const client = new Client({
    user: 'myuser',
    host: 'localhost',
    database: 'moviedb',
    password: 'My6Pa$$word'
})

export const query = (text, params, callback) => {
    return pool.query(text, params, callback)
}