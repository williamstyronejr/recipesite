import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import styles from './styles/rating.module.css';

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
  disabled = false,
}: {
  entityId: string;
  userRating: number;
  avgRating: number;
  totalRatings: number;
  disabled?: boolean;
}) => {
  const [rating, setRating] = useState<number>(
    userRating || Math.floor(avgRating)
  );

  const [updateRating] = useMutation(MUTATION_RATE, {
    update(_: any, { data: { setRating: res } }) {
      if (res.errors) {
        return setRating(0);
      }
    },
    onError() {
      setRating(0);
    },
  });

  const onRate = (val: number) => {
    if (disabled) return;

    setRating(val);
    updateRating({
      variables: {
        rating: val,
        entityId,
      },
    });
  };

  return (
    <div className={styles.rating}>
      <button
        className={`${styles.rating__btn} ${
          rating === 5 ? styles.rating__btn__active : ''
        }`}
        type="button"
        onClick={() => onRate(5)}
      >
        ★
      </button>

      <button
        className={`${styles.rating__btn} ${
          rating >= 4 ? styles.rating__btn__active : ''
        }`}
        type="button"
        onClick={() => onRate(4)}
      >
        ★
      </button>

      <button
        className={`${styles.rating__btn} ${
          rating >= 3 ? styles.rating__btn__active : ''
        }`}
        type="button"
        onClick={() => onRate(3)}
      >
        ★
      </button>

      <button
        className={`${styles.rating__btn} ${
          rating >= 2 ? styles.rating__btn__active : ''
        }`}
        type="button"
        onClick={() => onRate(2)}
      >
        ★
      </button>

      <button
        className={`${styles.rating__btn} ${
          rating >= 1 ? styles.rating__btn__active : ''
        }`}
        type="button"
        onClick={() => onRate(1)}
      >
        ★
      </button>

      <div className={styles.rating__info}>
        <div className={styles.rating__avg}>{avgRating || 0}</div>
        <div className={styles.rating__count}>{totalRatings || 0} ratings</div>
      </div>
    </div>
  );
};

Rating.defaultProps = {
  disabled: false,
};

export default Rating;
