import {Sequelize} from "sequelize"
import db from '../config/database.js';
import Project from "./ProjectModel.js";
import Task from "./TaskModel.js";

const {DataTypes} = Sequelize

const Label = db.define('tb_label',{
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    projectId: {
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
Project.hasMany(Label)
Label.belongsTo(Project, {foreignKey: 'projectId', as: 'project_label'})

// Project.hasMany(Label)
// Label.belongsTo(Project, {foreignKey: 'projectId', as: 'label'})
export default Label