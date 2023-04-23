import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gql, useMutation, useQuery } from '@apollo/client';
import Loading from './Loading';
import styles from './styles/comments.module.css';

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

        setErrors({
          content: 'Error occurred creating comment, please try again.',
        });
      },
      onError() {
        //
      },
      variables: {
        source,
        content,
      },
    }
  );

  const [deleteComment] = useMutation(MUTATION_DELETE_COMMENT, {
    update(_: any, { data: { deleteComment: res } }) {
      if (res.success) {
        //
        _.modify({
          fields: {
            getComments: (previous: any) => {
              const newCommentList = previous.filter(
                (comment: any) => `Comment:${res.comment.id}` !== comment.__ref
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
    <div className={styles.comments}>
      <h3 className={styles.comments__heading}>Comments</h3>

      <ul className={styles.comments__list}>
        <li
          className={`${styles.comments__item} ${styles.comments__item__create}`}
        >
          {errors.content ? (
            <div
              className={styles.comments__error_input}
              data-cy="comment-error"
            >
              {errors.content}
            </div>
          ) : null}

          {userId ? (
            <>
              <textarea
                className={styles.comments__textarea}
                value={content}
                onChange={(evt) => setContent(evt.target.value)}
                data-cy="comment-create"
              />

              <button
                className={styles.comments__submit}
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
            <div className={styles.comments__unauth}>
              Login in first to make a comment
            </div>
          )}
        </li>

        {loading ? <Loading /> : null}

        {fetchError ? (
          <div className={styles.comments__error}>
            Error Fetching Comments
            <button
              className={styles.comments__refetch}
              type="button"
              onClick={() => refetch()}
            >
              Reload comments
            </button>
          </div>
        ) : null}

        {comments.map((comment: any) => (
          <li
            className={styles.comments__item}
            key={`comment-${comment.id}`}
            data-cy="comment"
          >
            {comment.author === userId ? (
              <button
                className={styles.comments__delete}
                type="button"
                data-cy="comment-delete"
                onClick={() =>
                  deleteComment({ variables: { commentId: comment.id } })
                }
              >
                Delete
              </button>
            ) : null}

            <h4 className={styles.comments__author}>
              <Link
                className={styles.comment__author_link}
                href={`/account/profile/${comment.author}`}
              >
                <Image
                  fill={true}
                  className={styles.comments__img}
                  alt="User profile"
                  src={comment.profileImage}
                />
                {comment.username}
              </Link>
            </h4>

            <p className={styles.comments__content}>{comment.content}</p>

            <hr className={styles.comments__dividor} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
