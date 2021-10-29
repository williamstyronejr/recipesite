import { Sequelize, Model } from 'sequelize';

interface CommentAttributes {
  id: number;
  content: string;
  author: number;
  source: number;
  parentId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export default (sequelize: Sequelize, DataTypes: any): any => {
  class Comment extends Model {
    id!: number;
    content!: string;
    author!: number;
    parentId!: number | null;
    source!: number;
    createdAt!: Date;
    updatedAt!: Date;

    static associate(models: any) {
      // define association here
      Comment.belongsTo(models.Comment, { foreignKey: 'parentId' });
      Comment.belongsTo(models.User, { foreignKey: 'author' });
      Comment.belongsTo(models.Entity, {
        foreignKey: 'source',
      });
    }
  }

  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, modelName: 'comment' },
  );

  return Comment;
};
