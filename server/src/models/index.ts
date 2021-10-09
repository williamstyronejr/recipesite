/* eslint-disable @typescript-eslint/no-var-requires */
import { Sequelize, Model, DataTypes } from 'sequelize';
import User from './User';
import Recipe from './Recipe';
import Comment from './Comment';
import Bookmark from './Bookmark';

const { DATABASE_URL } = process.env;

const db: any = {};
const sequelize = new Sequelize(DATABASE_URL || '');

const models: any = {
  User: User(sequelize, DataTypes),
  Recipe: Recipe(sequelize, DataTypes),
  Comment: Comment(sequelize, DataTypes),
  Bookmark: Bookmark(sequelize, DataTypes),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

db.models = models;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
