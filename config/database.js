import {Sequelize} from "sequelize";

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS,{
  host: process.env.DB_HOST,
  dialect: "mysql",
  dialectOptions: {
      timezone: '+08:00', // for reading from database
      dateStrings: true
    },
    timezone: '+08:00', // for writing to database
});

export default db;