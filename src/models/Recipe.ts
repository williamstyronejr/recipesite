import { Sequelize, Model } from 'sequelize';

// interface RecipeAttributes {
//   id: number;
//   title: string;
//   author: string;
//   summary: string;
//   ingredients: string;
//   directions: string;
//   published: boolean;
//   createdAt: Date;
// }

export default (sequelize: Sequelize, DataTypes: any): any => {
  class Recipe extends Model {
    id!: number;
    entityId!: number;
    title!: string;
    summary!: string;
    ingredients!: string;
    directions!: string;
    published!: boolean;
    cookTime!: number;
    prepTime!: number;
    mainImage!: string;
    createdAt!: Date;
    type!: string;

    static associate(models: any) {
      // define association here
      Recipe.belongsTo(models.Entity, { foreignKey: 'entityId' });
      Recipe.belongsTo(models.User, { foreignKey: 'author' });
    }
  }

  Recipe.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      directions: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ingredients: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      published: {
        type: DataTypes.BOOLEAN,
      },
      mainImage: {
        type: DataTypes.STRING,
      },
      prepTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      cookTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      type: {
        type: DataTypes.STRING,
      },
    },
    { sequelize, modelName: 'recipe' }
  );

  return Recipe;
};
