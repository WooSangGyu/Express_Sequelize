'use strict';

module.exports = (sequelize, DataType) => {
    var suclass = sequelize.define('suclass', {
        classname: {
            type: DataType.STRING,
            allowNull: false,
            unique:true
        },
        classcode: {
            type: DataType.STRING,
            allowNull: false,
            unique: true,
            primaryKey:true
        }
        // ,
        // studentcode: {
        //     type:DataType.TEXT,
        //     allowNull:true
        // }
    },
    {
        timestamps:false
    });
    return suclass;
};