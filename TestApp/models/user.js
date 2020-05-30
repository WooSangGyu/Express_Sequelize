'use strict'
module.exports = (sequelize, DataType) => {
    var user = sequelize.define('user', {
        id : {
            type: DataType.STRING,
            allowNull:false,
            primaryKey: true,
            unique:true
        },
        pwd : {
            type: DataType.STRING,
            allowNull:true,
        },
        nickname: {
            type: DataType.STRING,
            allowNull:false
        }
        // usermail : {
        //     type: DataType.STRING,
        //     allowNull:true
        // }
    });
    // post.associate = function(models){
    //     post.hasMany(models.reply, {
    //         foreignKey : 'postId',
    //         sourceKey : 'id'
    //     })
    // }

    return user;
};