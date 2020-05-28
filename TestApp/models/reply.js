'use strict'
module.exports = (sequelize, DataType) => {
    var reply = sequelize.define('reply', {
        postId:{
            type:DataType.INTEGER,
            // references:{
            //     model : 'posts',
            //     key : 'id'
            // },
            allowNull:false
        },
        writer: {
            type: DataType.STRING,
            allowNull:false
        },
        content: {
            type: DataType.STRING,
            allowNull:false
        }
    },
    {
        timestamps:true
    });
    
    // reply.associate = function(models){
    //     reply.belongsTo(models.post, {
    //         foreignKey: 'postId',
    //         targetKey : 'id'
    //     })
    // }

    return reply;
};