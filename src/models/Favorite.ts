import { Sequelize, Model } from 'sequelize';

// interface FavoriteAttributes {
//   id: number;
//   entityId: number;
//   userId: number;
//   createdAt: string;
//   updatedAt: string;
// }

export default (sequelize: Sequelize, DataTypes: any): any => {
  class Favorite extends Model {
    id!: number;

    static associate(models: any) {
      Favorite.belongsTo(models.Entity, { foreignKey: 'entityId' });
      Favorite.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Favorite.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { sequelize, modelName: 'favorite' },
  );

  return Favorite;
};
