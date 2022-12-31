import { Sequelize } from "sequelize"
import db from '../config/database.js';
import Users from "./UserModel.js";

const { DataTypes } = Sequelize

const Feedback = db.define('tb_feedback', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    feedback: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

}, {
    freezeTableName: true,
    paranoid: true
})
Users.hasMany(Feedback)
Feedback.belongsTo(Users, {foreignKey: 'userId'})

export default Feedback