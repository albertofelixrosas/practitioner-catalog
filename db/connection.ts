import { Sequelize } from 'sequelize';

const db = new Sequelize({
    database: 'practitioners',
    host: 'localhost',
    username: 'root',
    password: 'root',
    dialect: 'mysql',
});

export default db;
