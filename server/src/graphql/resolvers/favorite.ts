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
  Mutation: {},
};
