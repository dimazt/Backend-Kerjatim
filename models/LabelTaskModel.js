import {Sequelize} from "sequelize"
import db from '../config/database.js';
import Label from "./LabelModel.js";
import Task from "./TaskModel.js";

const {DataTypes} = Sequelize

const Label_Task = db.define('tb_label_task',{
    labelId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    taskId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },

},{
    freezeTableName: true,
    paranoid: true
})

Task.hasMany(Label_Task)
Label_Task.belongsTo(Task, {foreignKey: 'taskId', as: 'task_label'})

Label.hasMany(Label_Task)
Label_Task.belongsTo(Label, {foreignKey : 'labelId', as : 'label'})
export default Label_Task