// Remember to set type: module in package.json or use .mjs extension
import { join } from 'node:path'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

let db;

export const createConnection = async () => {
    // db.json file path
    const __dirname = process.cwd()
    const file = join(__dirname, 'db.json')

    // Configure lowdb to write data to JSON file
    const adapter = new JSONFile(file)
    const defaultData = { drones: [], medication:[]}
    db = new Low(adapter, defaultData)
};

export const getConnection = () => db;



// // Read data from JSON file, this will set db.data content
// // If JSON file doesn't exist, defaultData is used instead
// await db.read()

// // Create and query items using plain JavaScript
// db.data.posts.push('hello world')
// const firstPost = db.data.posts[0]

// // If you don't want to type db.data everytime, you can use destructuring assignment
// const { posts } = db.data
// posts.push('hello world')

// // Finally write db.data content to file
// await db.write()
