import checkAuth from '../utils/auth';
import db from '../../models';

export default {
  Mutation: {
    async updateBookmark(
      _: any,
      { recipeId, bookmarking }: { recipeId: string; bookmarking: boolean },
      context: any,
    ): Promise<boolean> {
      const user = checkAuth(context);

      if (bookmarking) {
        const test = await db.models.Bookmark.create({
          userId: user.id,
          entityId: recipeId,
        });

        console.log(test);

        return true;
      }

      const results = await db.models.Bookmark.destory({
        where: { userId: user.id, entityId: recipeId },
      });

      return results.length > 0;
    },
  },
};
