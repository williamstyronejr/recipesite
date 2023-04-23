import Link from 'next/link';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import Loading from '../../../components/ui/Loading';
import styles from './styles/profile.module.css';
import Image from 'next/image';

const QUERY_USER_PROFILE = gql`
  query ($userId: ID!) {
    getProfile(userId: $userId) {
      username
      bio
      profileImage
      recipes {
        id
        title
        summary
      }
    }
  }
`;

const UserNotFound = () => (
  <section className={`${styles.profile} ${styles.profile__missing}`}>
    <div className={styles.profile__404_heading}>Bummer.</div>
    <div className={styles.profile__404_msg}>This User does not exist.</div>

    <Link className={styles.profile__404_link} href="/">
      Click here to go back to home page.
    </Link>
  </section>
);

const ProfilePage = () => {
  const { query } = useRouter();

  const { loading, error, data } = useQuery(QUERY_USER_PROFILE, {
    variables: {
      userId: query.id,
    },
    skip: !query || !query.id,
  });

  if (!query || !query.id || loading) return <Loading />;
  if (error) return <UserNotFound />;
  if (!data || !data.getProfile) return <UserNotFound />;

  const { username, recipes, bio, profileImage } = data.getProfile;

  return (
    <section className={styles.profile}>
      <header className={styles.profile__header}>
        <div className={styles.profile__wrapper}>
          <div className={styles.profile__picture_wrapper}>
            <Image
              fill={true}
              className={styles.profile__picture}
              alt="User profile"
              src={profileImage}
            />
          </div>
          <div className={styles.profile__username}>{username}</div>
          <div className={styles.profile__bio}>{bio}</div>
        </div>
      </header>

      <div className={styles.profile__recipes}>
        <div className={styles.profile__title}>Top Recipes</div>
        {recipes.length === 0 ? (
          <div className={styles.profile__empty}>This user has no recipes</div>
        ) : null}

        {recipes.map((recipe: any) => (
          <Link
            className={styles.profile__recipe}
            href={`/recipe/${recipe.id}`}
            key={`recipe-${recipe.id}`}
          >
            <div className={styles.profile__recipe_title}>{recipe.title}</div>
            <div className={styles.profile__recipe_summary}>
              {recipe.summary}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProfilePage;
