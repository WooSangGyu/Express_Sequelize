'use strict'
module.exports = (sequelize, DataType) => {
    var student = sequelize.define('student', {
        name: {
            type: DataType.STRING,
            allowNull: true,
            unique:true,
        },
        studentcode: {
            type: DataType.STRING,
            allowNull: true,
            unique: true,
            primaryKey:true
        }
    },
    {
        timestamps:false
    });
    return student;
};