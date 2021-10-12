import { Sequelize, Model } from 'sequelize';

export default (sequelize: Sequelize, DataTypes: any): any => {
  class Rating extends Model {
    entityId!: number;
    userId!: number;
    rating!: number;

    static associate(models: any) {
      Rating.belongsTo(models.Entity, { foreignKey: 'entityId' });
      Rating.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Rating.init(
    {
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      entityId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    { sequelize, modelName: 'rating' },
  );

  return Rating;
};
