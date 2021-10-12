import db from '../../models/index';
import checkauth from '../utils/auth';

export default {
  Query: {},
  Mutation: {
    async setRating(
      _: any,
      { entityId, rating }: { entityId: number; rating: number },
      context: any,
    ): Promise<Record<string, unknown>> {
      const user = checkauth(context);

      try {
        await db.models.Rating.upsert({
          entityId,
          userId: user.id,
          rating,
        });

        return {
          success: true,
        };
      } catch (err: any) {
        console.log(err);
        if (err.original && err.original.code === '23503') {
          console.log('Entity does not exists');
          return {
            success: false,
            errors: [
              {
                path: 'entityId',
                message: 'Content does not exists.',
                type: 'Recipe',
              },
            ],
          };
        }

        return {
          success: false,
        };
      }
    },
  },
};
