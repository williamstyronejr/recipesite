import { Op } from 'sequelize';
import db from '../../models/index';
import checkAuth from '../utils/auth';
import { validateRecipe } from '../utils/validators';
import { uploadImage } from './utils';
import { QueryTypes } from 'sequelize';

export default {
  Query: {
    async getRecipe(
      _: any,
      { recipeId }: { recipeId: string },
      context: any,
    ): Promise<any | null> {
      const user = checkAuth(context, false);
      const recipeData = await db.models.Recipe.findByPk(recipeId, {
        include: [
          {
            model: db.models.User,
            as: 'user',
            attributes: { exclude: ['hash'] }, // Remove hash from results
          },
        ],
      });

      if (!recipeData) return null; // Recipe not found

      /**
       * Can't get sub querys to work using raw query for now
       */
      const ratingData: Array<{
        avgRating?: number;
        ratingCount?: number;
        rating?: number;
      }> = await db.sequelize.query(
        `
            SELECT 
              AVG("rating") as "avgRating",
              COUNT("rating") as "ratingCount"
              ${
                user
                  ? `, (SELECT "rating" FROM "ratings" WHERE "userId"=${user.id} AND "entityId"=${recipeData.entityId})`
                  : ''
              }
            FROM "public"."ratings"
            WHERE "entityId" = ${recipeData.entityId}
          `,
        { type: QueryTypes.SELECT },
      );

      const recipe = recipeData.toJSON();

      return {
        ...recipe,
        authorName: recipe.user.username,
        avgRating: ratingData.length ? ratingData[0].avgRating : 0,
        ratingCount: ratingData.length ? ratingData[0].ratingCount : 0,
        userRating: ratingData.length ? ratingData[0].rating : 0,
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
      const { errors, valid } = validateRecipe(
        title,
        summary,
        directions,
        ingredients,
        cookTime,
        prepTime,
        published,
      );

      if (!valid) {
        return {
          errors,
          recipe: null,
        };
      }
      const fileName = await uploadImage(mainImage);

      const entity = await db.models.Entity.create({});
      const recipe = await db.models.Recipe.create({
        entityId: entity.id,
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

      return { recipe, errors: null };
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
          cookTime: string;
          prepTime: string;
          published: boolean;
          mainImage: any;
          removeImage: boolean;
        };
      },
      context: any,
    ): Promise<Record<string, unknown>> {
      const user = checkAuth(context);
      const { errors, valid } = validateRecipe(
        title,
        summary,
        directions,
        ingredients,
        cookTime,
        prepTime,
        published,
      );

      if (!valid) {
        return {
          errors,
          success: false,
        };
      }

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

      return {
        success: results[0] > 0,
        errors: null,
      };
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
