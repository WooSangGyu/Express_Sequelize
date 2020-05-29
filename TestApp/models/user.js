'use strict'
module.exports = (sequelize, DataType) => {
    var user = sequelize.define('user', {
        userid : {
            type: DataType.STRING,
            allowNull:false,
            primaryKey: true,
            unique:true
        },
        nickname: {
            type: DataType.STRING,
            allowNull:false
        }
    });
    // post.associate = function(models){
    //     post.hasMany(models.reply, {
    //         foreignKey : 'postId',
    //         sourceKey : 'id'
    //     })
    // }

    return user;
};