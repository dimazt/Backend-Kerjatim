import {Sequelize} from "sequelize";

const db = new Sequelize('kerjatim', 'dimas', '@sm4rtK1dsRs1B',{
  host: 'localhost',
  dialect: "mysql",
  dialectOptions: {
      timezone: '+08:00', // for reading from database
      dateStrings: true
    },
    timezone: '+08:00', // for writing to database
});

export default db;