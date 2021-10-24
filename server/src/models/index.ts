/* eslint-disable @typescript-eslint/no-var-requires */
import { Sequelize, Model, DataTypes, Options } from 'sequelize';
import User from './User';
import Recipe from './Recipe';
import Comment from './Comment';
import Bookmark from './Bookmark';
import Entity from './Entity';
import Rating from './Rating';

const { DATABASE_URL, NODE_ENV } = process.env;

const options: Options = {};

// Heroku only allows SSL connections on production
if (NODE_ENV === 'production') {
  options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const sequelize: Sequelize = new Sequelize(DATABASE_URL || '', options);

const models: any = {
  User: User(sequelize, DataTypes),
  Recipe: Recipe(sequelize, DataTypes),
  Comment: Comment(sequelize, DataTypes),
  Bookmark: Bookmark(sequelize, DataTypes),
  Entity: Entity(sequelize, DataTypes),
  Rating: Rating(sequelize, DataTypes),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

const db: {
  models: any;
  sequelize: Sequelize;
  Sequelize: any;
} = {
  models: models,
  sequelize: sequelize,
  Sequelize: Sequelize,
};

export default db;
