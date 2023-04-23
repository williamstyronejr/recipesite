import { Sequelize, DataTypes, Options } from 'sequelize';
import User from './User';
import Recipe from './Recipe';
import Comment from './Comment';
import Entity from './Entity';
import Rating from './Rating';
import Favorite from './Favorite';

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
  Entity: Entity(sequelize, DataTypes),
  Rating: Rating(sequelize, DataTypes),
  Favorite: Favorite(sequelize, DataTypes),
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
