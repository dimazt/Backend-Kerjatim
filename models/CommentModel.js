import { Sequelize } from "sequelize"
import db from '../config/database.js';
import Project from "./ProjectModel.js";
import Task from "./TaskModel.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize

const Comment = db.define('tb_comment', {

    taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    commentParentId: {
        type: DataTypes.INTEGER
    },
    comment: {
        type: DataTypes.TEXT
    },
    file: {
        type: DataTypes.STRING
    },

}, {
    freezeTableName: true,
    paranoid: true
})

Users.hasMany(Comment)
Comment.belongsTo(Users, { foreignKey: 'userId', as: 'nama_user' })

Task.hasMany(Comment)
Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'task_detail' })
export default Comment