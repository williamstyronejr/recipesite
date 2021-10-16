import * as React from 'react';
import { gql, useMutation } from '@apollo/client';
import './styles/rating.css';

const MUTATION_RATE = gql`
  mutation setRating($entityId: ID!, $rating: Int!) {
    setRating(entityId: $entityId, rating: $rating) {
      success
      errors {
        ... on UserInputError {
          message
          path
        }
        ... on MissingContentError {
          path
          message
          type
        }
      }
    }
  }
`;

const Rating = ({
  entityId,
  userRating,
  avgRating,
  totalRatings,
}: {
  entityId: string;
  userRating: number;
  avgRating: number;
  totalRatings: number;
}) => {
  const [rating, setRating] = React.useState<number>(
    userRating || Math.floor(avgRating),
  );
  const [error, setError] = React.useState<string>('');

  const [updateRating] = useMutation(MUTATION_RATE, {
    update(_: any, { data: { setRating: res } }) {
      if (res.errors) {
        return setRating(0);
      }
    },
    onError() {
      setRating(0);
      setError('A server error occurred, please try again.');
    },
  });

  const onRate = (val: number) => {
    setRating(val);
    updateRating({
      variables: {
        rating: val,
        entityId,
      },
    });
  };

  return (
    <div className="rating">
      {error ? <div className="rating__error">{error}</div> : null}

      <button
        className={`rating__btn ${rating === 5 ? 'rating__btn--active' : ''}`}
        type="button"
        onClick={() => onRate(5)}
      >
        ★
      </button>

      <button
        className={`rating__btn ${rating >= 4 ? 'rating__btn--active' : ''}`}
        type="button"
        onClick={() => onRate(4)}
      >
        ★
      </button>

      <button
        className={`rating__btn ${rating >= 3 ? 'rating__btn--active' : ''}`}
        type="button"
        onClick={() => onRate(3)}
      >
        ★
      </button>

      <button
        className={`rating__btn ${rating >= 2 ? 'rating__btn--active' : ''}`}
        type="button"
        onClick={() => onRate(2)}
      >
        ★
      </button>

      <button
        className={`rating__btn ${rating >= 1 ? 'rating__btn--active' : ''}`}
        type="button"
        onClick={() => onRate(1)}
      >
        ★
      </button>

      <div className="rating__info">
        <div className="rating__avg">{avgRating || 0}</div>
        <div className="rating__count">{totalRatings || 0} ratings</div>
      </div>
    </div>
  );
};

export default Rating;
