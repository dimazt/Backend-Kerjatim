import { Sequelize } from "sequelize"
import db from '../config/database.js';

const { DataTypes } = Sequelize

const Payment = db.define('tb_payment', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
        
    },
    amount: {
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

export default Payment

