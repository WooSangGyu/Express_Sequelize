'use strict'
module.exports = (sequelize, DataType) => {
    var studentclass = sequelize.define('studentclass', {
        studentStudentcode: {
            type: DataType.STRING,
            allowNull: false,
            unique:true
        },
        suclassClasscode: {
            type: DataType.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        timestamps:false
    });
    return studentclass;
};