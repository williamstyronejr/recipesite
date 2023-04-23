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
      context: any
    ): Promise<any | null> {
      const user = checkAuth(context, false);

      try {
        const recipeData = await db.models.Recipe.findByPk(recipeId, {
          include: [
            {
              model: db.models.User,
              as: 'user',
              attributes: { exclude: ['hash'] },
            },
          ],
        });

        if (!recipeData || !recipeData.published) return null;

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
          { type: QueryTypes.SELECT }
        );
        const favoriteData = user
          ? await db.models.Favorite.findAll({
              where: { userId: user.id, entityId: recipeData.entityId },
            })
          : null;

        const recipe = recipeData.toJSON();

        return {
          ...recipe,
          authorName: recipe.user.username,
          authorImage: recipe.user.profileImage,
          avgRating: ratingData.length ? ratingData[0].avgRating : 0,
          ratingCount: ratingData.length ? ratingData[0].ratingCount : 0,
          userRating: ratingData.length ? ratingData[0].rating : 0,
          favorited: favoriteData && favoriteData.length > 0 ? true : false,
        };
      } catch (err: any) {
        // Sequlize error, invalid id type (non integer)
        if (err.original && err.original.code === '22P02') {
          // logger.warn(`Recipe with id, ${recipeId}, could not be found.`);
        }

        return null;
      }
    },
    async getUserRecipes(
      _: any,
      {
        userId,
        publishedType,
        offset,
        limit,
      }: {
        userId: string;
        publishedType: string;
        offset: number;
        limit: number;
      },
      content: any
    ): Promise<{
      recipes: Array<Record<string, unknown>>;
      endOfList: boolean;
    }> {
      const user = await checkAuth(content);

      // Users must match when getting privated recipes
      if (publishedType === 'private' && user.id.toString() !== userId)
        return { recipes: [], endOfList: true };

      const params: { published?: boolean; author: string } = {
        author: userId,
      };
      if (publishedType === 'private') params.published = false;
      if (publishedType === 'public') params.published = true;

      try {
        const recipes = await db.models.Recipe.findAll({
          where: params,
          limit,
          offset,
        });
        return { recipes, endOfList: recipes.length !== limit };
      } catch (err: any) {
        // Sequlize error, invalid id type (non integer)
        if (err.original && err.original.code === '22P02') {
          // logger.warn(`User with id, ${userId}, could not be found.`);
        }

        return { recipes: [], endOfList: true };
      }
    },
    async searchRecipes(
      _: any,
      {
        search: { q, order, offset, limit },
      }: {
        search: {
          q: string;
          author: string;
          order: string;
          offset: number;
          limit: number;
        };
      }
    ): Promise<any | null> {
      const ordering = order === 'rating' ? [[]] : [['createdAt', 'DESC']];
      const where: { title?: any } = {};
      if (q)
        where.title = {
          [Op.like]: q,
        };

      try {
        const recipes = await db.models.Recipe.findAll({
          where: {
            ...where,
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
      } catch (err: any) {
        return {
          recipes: [],
          endOfList: true,
        };
      }
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
          cookTime: number;
          prepTime: number;
          published: boolean;
          mainImage: any;
        };
      },
      context: any
    ): Promise<Record<string, unknown>> {
      const user = checkAuth(context);
      const { errors, valid } = validateRecipe(
        title,
        summary,
        directions,
        ingredients,
        cookTime,
        prepTime,
        published
      );

      if (!valid) {
        return {
          errors,
          recipe: null,
        };
      }

      try {
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
      } catch (err) {
        // logger.error(err);
        return {
          recipe: null,
          errors: [
            {
              path: 'general',
              message: 'An error has occurred, please try again.',
            },
          ],
        };
      }
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
      context: any
    ): Promise<Record<string, unknown>> {
      const user = checkAuth(context);
      const { errors, valid } = validateRecipe(
        title,
        summary,
        directions,
        ingredients,
        cookTime,
        prepTime,
        published
      );

      if (!valid) {
        return {
          errors,
          success: false,
        };
      }

      try {
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
        if (typeof published === 'boolean') params.published = published;
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
      } catch (err) {
        return {
          success: false,
        };
      }
    },
    async deleteRecipe(
      _: any,
      { recipeId }: { recipeId: string },
      context: any
    ): Promise<boolean> {
      const user = checkAuth(context);

      try {
        const rowsDestroyed = await db.models.Recipe.destroy({
          where: {
            id: recipeId,
            author: user.id,
          },
        });

        return rowsDestroyed > 0;
      } catch (err) {
        return false;
      }
    },
  },
};
