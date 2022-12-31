import {Sequelize} from "sequelize"
import db from '../config/database.js';
import Task from "./TaskModel.js";

const {DataTypes} = Sequelize

const TaskList = db.define('tb_taskList',{
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    task_list: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,

        }
    },
    taskId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    status: {
        type: DataTypes.BOOLEAN
        
    }

},{
    freezeTableName: true,
    paranoid: true
})

Task.hasMany(TaskList, {foreignKey: 'taskId'})
TaskList.belongsTo(Task, {foreignKey: 'taskId',as: 'detailTask'})


export default TaskList