import postgres from 'postgres';
const dbConfig = require('../../db.json');

const sql = postgres(dbConfig);
export default sql;
