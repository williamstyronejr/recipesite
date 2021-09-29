import { Sequelize, Model } from 'sequelize';

interface BookmarkAttributes {
  id: number;
}

export default (sequelize: Sequelize, DataTypes: any): any => {
  class Bookmark extends Model {
    id!: number;

    static associate(models: any) {
      Bookmark.belongsTo(models.User, { foreignKey: 'userId' });
      Bookmark.belongsTo(models.Recipe, { foreignKey: 'entityId' });
    }
  }

  Bookmark.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { sequelize, modelName: 'bookmark' },
  );

  return Bookmark;
};
