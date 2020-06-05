'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development'; //개발모드
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// directory 내의 모든 파일을 순회하며 캐싱
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.post = require('./post')(sequelize, Sequelize);
db.reply = require('./reply')(sequelize, Sequelize);
db.student = require('./student')(sequelize, Sequelize);
db.suclass = require('./suclass')(sequelize, Sequelize);

// post와 reply의 1:N 관계 설정
db.post.hasMany(db.reply, {foreignKey: 'postId', sourceKey: 'id', onDelete:'cascade', onUpdate: 'cascade'});
db.reply.belongsTo(db.post, {foreignKey: 'postId', targetKey: 'id'});

//student , suclass의 N:M 관계 설정
db.student.belongsToMany(db.suclass, {through: 'studentclass', onDelete:'cascade', onUpdate: 'cascade', timestamps: false});
db.suclass.belongsToMany(db.student, {through: 'studentclass', onDelete:'cascade', onUpdate: 'cascade', timestamps: false});

module.exports = db;


