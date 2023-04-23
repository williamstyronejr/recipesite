import { Sequelize, Model } from 'sequelize';

// interface UserAttributes {
//   id: number;
//   username: string;
//   hash: string;
//   createdAt: Date;
//   bio: string;
// }

export default (sequelize: Sequelize, DataTypes: any): any => {
  class User extends Model {
    id!: number;
    email!: string;
    username!: string;
    hash!: string;
    bio!: string;
    profileImage!: string;

    static associate(models: any) {
      // define association here
      User.hasMany(models.Recipe, { foreignKey: 'author' });
      User.hasMany(models.Comment, { foreignKey: 'author' });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      bio: {
        type: DataTypes.STRING,
      },
      profileImage: {
        type: DataTypes.STRING,
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, modelName: 'user' }
  );

  return User;
};
