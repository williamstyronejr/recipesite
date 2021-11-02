import db from '../../models/index';
import checkAuth from '../utils/auth';

export default {
  Query: {
    async getComments(
      _: any,
      { entityId }: { entityId: number },
    ): Promise<any | null> {
      try {
        const comments: any = await db.sequelize.query(`
        WITH RECURSIVE comment_tree (id, content, author, username, "parentId", "profileImage", "createdAt") AS
        (
          SELECT comments.id AS id, content, author, username, "parentId", users."profileImage" as "profileImage",  comments."createdAt" as createdAt
          FROM comments INNER JOIN users ON users.id = comments.author
          WHERE source=${entityId} AND "parentId" IS NULL
          UNION ALL
          SELECT  c.id, c.content, c.author, users.username, c."parentId", users."profileImage" as "profileImage", c."createdAt" as createdAt
          FROM comments as c
          JOIN comment_tree ct ON ct.id = c."parentId" 
          JOIN users  ON users.id = c.author
          ) 
          SELECT * 
          FROM comment_tree
          `);

        return comments[0];
      } catch (err) {
        return [];
      }
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
      const sessionUser = checkAuth(context);

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
          author: sessionUser.id,
          parentId,
          source,
        });

        const user = await db.models.User.findByPk(sessionUser.id);

        return {
          success: true,
          comment: {
            ...comment.toJSON(),
            username: user.username,
            profileImage: user.profileImage,
          },
        };
      } catch (err) {
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

      try {
        const rowDestroyed = await db.models.Comment.destroy({
          where: {
            id: commentId,
            author: user.id,
          },
        });

        return {
          success: rowDestroyed > 0,
          comment: {
            id: commentId,
          },
        };
      } catch (err) {
        return {
          success: false,
        };
      }
    },
  },
};
