'use strict'
module.exports = (sequelize, DataType) => {
    var post = sequelize.define('post', {
        id : {
            type: DataType.INTEGER,
            allowNull:false,
            primaryKey: true,
            autoIncrement:true
        },
        title: {
            type: DataType.STRING,
            allowNull:false
        },
        writer: {
            type: DataType.STRING,
            allowNull:false
        }
    },
    {
        timestamps:false
    });
    
    // post.associate = function(models){
    //     post.hasMany(models.reply, {
    //         foreignKey : 'postId',
    //         sourceKey : 'id'
    //     })
    // }

    return post;
};