import db from '../../models/index';

export default {
  Query: {
    async getCommentsByRecipe(
      _: any,
      { author }: { author: string },
    ): Promise<any | null> {
      const comments = await db.models.Comment.findAll({ where: { author } });
      return comments;
    },
  },
  Mutation: {},
};
