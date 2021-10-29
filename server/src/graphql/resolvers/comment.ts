import db from '../../models/index';
import checkAuth from '../utils/auth';

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
  Mutation: {
    async createComment(
      _: any,
      {
        source,
        parentId,
        content,
      }: {
        source: number;
        parentId: number;
        content: string;
      },
      context: any,
    ): Promise<any> {
      const user = checkAuth(context);

      // Simple validation
      if (!content || content === '') {
        return {
          success: false,
          errors: [{ path: 'content', message: 'Comment must have a message' }],
        };
      }

      try {
        const comment = await db.models.Comment.create({
          content,
          author: user.id,
          parentId,
          source,
        });

        return {
          success: true,
        };
      } catch (err) {
        console.log(err);
        return {
          success: false,
        };
      }
    },
    async deleteComment(
      _: any,
      {
        commentId,
      }: {
        commentId: number;
      },
      context: any,
    ): Promise<any> {
      const user = checkAuth(context);

      const rowDestroyed = await db.models.Comment.destroy({
        where: {
          id: commentId,
          author: user.id,
        },
      });

      return {
        success: rowDestroyed > 0,
      };
    },
  },
};
