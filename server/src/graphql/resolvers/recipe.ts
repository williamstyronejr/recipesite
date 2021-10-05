import { Op } from 'sequelize';
import db from '../../models/index';
import checkAuth from '../utils/auth';
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
    async getUserRecipes(
      _: any,
      { userId, publishedType }: { userId: string; publishedType: string },
      content: any,
    ): Promise<Array<any>> {
      const user = await checkAuth(content);
      console.log(user.id, userId);

      if (publishedType === 'private' && user.id.toString() !== userId)
        return [];

      const params: { published?: boolean; author: string } = {
        author: userId,
      };
      if (publishedType === 'private') params.published = false;
      if (publishedType === 'public') params.published = true;

      console.log(params);
      const recipes = await db.models.Recipe.findAll({ where: params });

      return recipes;
    },
    async searchRecipes(
      _: any,
      {
        search: { q, order, author, offset, limit },
      }: {
        search: {
          q: string;
          author: string;
          order: string;
          offset: number;
          limit: number;
        };
      },
    ): Promise<any | null> {
      const ordering = order === 'rating' ? [[]] : [['createdAt', 'DESC']];
      const where: { q?: any } = {};
      const innerWhere: { username?: string } = {};
      if (author) innerWhere.username = author;
      if (q)
        where.q = {
          [Op.like]: q,
        };

      const recipes = await db.models.Recipe.findAll({
        where: {
          ...where,
          published: true,
        },
        include: {
          model: db.models.User,
          as: 'user',
          where: innerWhere,
          attributes: { exclude: ['hash'] }, // Remove hash from results
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
