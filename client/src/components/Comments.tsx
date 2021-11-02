import * as React from 'react';
import { Link } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import Loading from './Loading';
import './styles/comments.css';

const QUERY_COMMENTS = gql`
  query getComments($entityId: ID!) {
    getComments(entityId: $entityId) {
      id
      author
      content
      username
      profileImage
    }
  }
`;

const MUTATION_CREATE_COMMENT = gql`
  mutation createComment($source: ID!, $parentId: ID, $content: String!) {
    createComment(source: $source, parentId: $parentId, content: $content) {
      success
      comment {
        id
        author
        username
        profileImage
        content
      }
      errors {
        ... on UserInputError {
          path
          message
        }
      }
    }
  }
`;

const MUTATION_DELETE_COMMENT = gql`
  mutation deleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId) {
      success
      comment {
        id
      }
      errors {
        ... on UserInputError {
          path
          message
        }
      }
    }
  }
`;

const Comments = ({
  entityId,
  userId,
  source,
}: {
  entityId: number;
  userId: number | null;
  source: number;
}) => {
  const [content, setContent] = React.useState<string>('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const {
    loading,
    error: fetchError,
    data,
    refetch,
  } = useQuery(QUERY_COMMENTS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      entityId,
    },
  });

  const [createComment, { loading: loadingCreate }] = useMutation(
    MUTATION_CREATE_COMMENT,
    {
      update(_: any, { data: { createComment: res } }) {
        if (res.success) {
          _.modify({
            fields: {
              getComments: (previous: any) => {
                const newComment = _.writeFragment({
                  data: res.comment,
                  fragment: gql`
                    fragment NewComment on Comment {
                      id
                      author
                      username
                      profileImage
                      content
                    }
                  `,
                });
                return [...previous, newComment];
              },
            },
          });
          return setContent('');
        }

        if (res.errors) {
          const errs: any = {};
          res.errors.forEach((err: any) => {
            errs[err.path] = err.message;
          });

          return setErrors(errs);
        }
      },
      onError() {
        //
      },
      variables: {
        source,
        content,
      },
    },
  );

  const [deleteComment] = useMutation(MUTATION_DELETE_COMMENT, {
    update(_: any, { data: { deleteComment: res } }) {
      if (res.success) {
        //
        _.modify({
          fields: {
            getComments: (previous: any) => {
              const newCommentList = previous.filter(
                (comment: any) => `Comment:${res.comment.id}` !== comment.__ref,
              );
              return newCommentList;
            },
          },
        });
      }
    },
  });

  const comments = data && data.getComments ? data.getComments : [];

  return (
    <div className="comments">
      <h3 className="comments__heading">Comments</h3>

      <ul className="comments__list">
        <li className="comments__item comments__item--create">
          {errors.content ? (
            <div className="comments__error-input" data-cy="comment-error">
              {errors.content}
            </div>
          ) : null}

          {userId ? (
            <>
              <textarea
                className="comments__textarea"
                value={content}
                onChange={(evt) => setContent(evt.target.value)}
                data-cy="comment-create"
              />

              <button
                className="comments__submit"
                type="button"
                disabled={loadingCreate}
                data-cy="comment-create-btn"
                onClick={() => {
                  setErrors({});
                  createComment();
                }}
              >
                Comment
              </button>
            </>
          ) : (
            <div className="comments__unauth">
              Login in first to make a comment
            </div>
          )}
        </li>

        {loading ? <Loading /> : null}

        {fetchError ? (
          <div className="comments__error">
            Error Fetching Comments
            <button
              className="comments__refetch"
              type="button"
              onClick={() => refetch()}
            >
              Reload comments
            </button>
          </div>
        ) : null}

        {comments.map((comment: any) => (
          <li
            className="comments__item"
            key={`comment-${comment.id}`}
            data-cy="comment"
          >
            {comment.author === userId ? (
              <button
                className="comments__delete"
                type="button"
                data-cy="comment-delete"
                onClick={() =>
                  deleteComment({ variables: { commentId: comment.id } })
                }
              >
                Delete
              </button>
            ) : null}

            <h4 className="comments__author">
              <Link
                className="comment__author-link"
                to={`/account/profile/${comment.author}`}
              >
                <img
                  className="comments__img"
                  alt="User profile"
                  src={
                    comment.profileImage.startsWith('http')
                      ? comment.profileImage
                      : `/img/${comment.profileImage}`
                  }
                />
                {comment.username}
              </Link>
            </h4>

            <p className="comments__content">{comment.content}</p>

            <hr className="comments__dividor" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
