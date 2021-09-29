import { Op } from 'sequelize';
import db from '../../models/index';
import checkAuth from '../utils/auth';
import user from './user';
import { uploadImage } from './utils';

export default {
  Query: {
    async getRecipe(
      _: any,
      { recipeId }: { recipeId: string },
      context: any,
    ): Promise<any | null> {
      let sessionUser;
      try {
        sessionUser = checkAuth(context);
      } catch (err) {
        //
      }

      const data = await db.models.Recipe.findByPk(recipeId, {
        include: {
          model: db.models.User,
          as: 'user',
          attributes: { exclude: ['hash'] }, // Remove hash from results
        },
      });
      const recipe = data.toJSON();

      console.log(recipe);

      return {
        ...recipe,
        authorName: recipe.user.username,
      };
    },
    async searchRecipes(
      _: any,
      {
        search: { q, order, offset, limit },
      }: {
        search: { q: string; order: string; offset: number; limit: number };
      },
    ): Promise<any | null> {
      const ordering = order === 'rating' ? [[]] : [['createdAt', 'DESC']];

      const recipes = await db.models.Recipe.findAll({
        where: {
          title: {
            [Op.like]: q,
          },
          published: true,
        },
        order: ordering,
        limit,
        offset,
      });
      return {
        recipes: recipes,
        endOfList: recipes.length !== limit,
      };
    },
  },
  Mutation: {
    async createRecipe(
      _: any,
      {
        recipeInput: {
          title,
          summary,
          directions,
          ingredients,
          cookTime,
          prepTime,
          published,
          mainImage,
        },
      }: {
        recipeInput: {
          title: string;
          summary: string;
          directions: string;
          ingredients: string;
          cookTime: string;
          prepTime: string;
          published: boolean;
          mainImage: any;
        };
      },
      context: any,
    ): Promise<Record<string, unknown>> {
      const user = checkAuth(context);

      const fileName = await uploadImage(mainImage);

      const recipe = await db.models.Recipe.create({
        title,
        summary,
        directions,
        ingredients,
        cookTime,
        prepTime,
        published,
        author: user.id,
        mainImage: fileName ? fileName : 'defaultRecipe.jpg',
      });
      return recipe;
    },
    async updateRecipe(
      _: any,
      {
        recipeInput: {
          id,
          title,
          summary,
          directions,
          ingredients,
          cookTime,
          prepTime,
          published,
          mainImage,
          removeImage,
        },
      }: {
        recipeInput: {
          id: number;
          title: string;
          summary: string;
          directions: string;
          ingredients: string;
          cookTime: number;
          prepTime: number;
          published: boolean;
          mainImage: any;
          removeImage: boolean;
        };
      },
      context: any,
    ): Promise<boolean> {
      const user = checkAuth(context);

      const fileName = !removeImage
        ? await uploadImage(mainImage)
        : 'defaultRecipe.jpg';

      const params: Record<string, unknown> = {};
      if (title) params.title = title;
      if (summary) params.summary = summary;
      if (directions) params.directions = directions;
      if (ingredients) params.ingredients = ingredients;
      if (cookTime) params.cookTime = cookTime;
      if (prepTime) params.prepTime = prepTime;
      if (published) params.published = published;
      if (fileName) params.mainImage = fileName;

      const results = await db.models.Recipe.update(params, {
        where: {
          id,
          author: user.id,
        },
      });

      return results[0] > 0;
    },

    async deleteRecipe(
      _: any,
      { recipeId }: { recipeId: string },
      context: any,
    ): Promise<boolean> {
      const user = checkAuth(context);

      const rowsDestroyed = await db.models.Recipe.destroy({
        where: {
          id: recipeId,
          author: user.id,
        },
      });

      return rowsDestroyed > 0;
    },
  },
};
