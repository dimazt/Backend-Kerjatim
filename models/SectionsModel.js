import {Sequelize} from "sequelize"
import db from '../config/database.js';
import Project from "./ProjectModel.js";


const {DataTypes} = Sequelize

const Sections = db.define('tb_sections',{
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },

    project_status: {
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


Project.hasMany(Sections)
Sections.belongsTo(Project, {foreignKey: 'projectId', as : 'project'})

export default Sections