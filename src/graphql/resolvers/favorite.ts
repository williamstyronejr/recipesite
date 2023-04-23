import { QueryTypes } from 'sequelize';
import db from '../../models/index';
import checkAuth from '../utils/auth';

export default {
  Query: {
    async getFavorites(
      _: any,
      { offset, limit }: { offset: number; limit: number },
      context: any,
    ): Promise<{ items: Array<any>; endOfList: boolean }> {
      const sessionUser = checkAuth(context);

      try {
        const entities = await db.sequelize.query(
          `
          SELECT * 
          FROM "favorites" 
          INNER JOIN "entities" on "entities"."id" = "favorites"."entityId"
          INNER JOIN "recipes" on "entities"."id" = "recipes"."entityId"
          WHERE "favorites"."userId" = $1
          LIMIT $2
          OFFSET $3
            `,
          {
            type: QueryTypes.SELECT,
            bind: [sessionUser.id, limit, offset],
          },
        );

        return {
          items: entities,
          endOfList: entities.length !== limit,
        };
      } catch (err) {
        return {
          items: [],
          endOfList: true,
        };
      }
    },
  },
  Mutation: {
    async setFavorite(
      _: any,
      { id, favorited }: { id: number; favorited: boolean },
      context: any,
    ): Promise<boolean> {
      const sessionUser = checkAuth(context);

      try {
        // Remove favorite
        if (!favorited) {
          const rowsDestroyed = await db.models.Favorite.destroy({
            where: { userId: sessionUser.id, entityId: id },
          });

          return rowsDestroyed > 0;
        }

        await db.models.Favorite.create({
          userId: sessionUser.id,
          entityId: id,
        });

        return true;
      } catch (err) {
        return false;
      }
    },
  },
};
