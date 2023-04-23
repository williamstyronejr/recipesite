import { Sequelize, Model } from 'sequelize';

export default (sequelize: Sequelize, DataTypes: any): any => {
  class Entity extends Model {
    id!: number;
  }

  Entity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { sequelize, modelName: 'entity' },
  );

  return Entity;
};
