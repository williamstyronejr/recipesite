import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import './styles/profile.css';
import Loading from '../../components/Loading';

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
  <section className="profile profile--missing">
    <div className="profile__404-heading">Bummer.</div>
    <div className="profile__404-msg">This User does not exist.</div>

    <Link className="profile__404-link" to="/">
      Click here to go back to home page.
    </Link>
  </section>
);

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();

  const { loading, error, data } = useQuery(QUERY_USER_PROFILE, {
    variables: {
      userId,
    },
  });

  if (loading) return <Loading />;
  if (error) return <UserNotFound />;
  if (!data || !data.getProfile) return <UserNotFound />;

  const { username, recipes, bio, profileImage } = data.getProfile;

  return (
    <section className="profile">
      <header className="profile__header">
        <div className="profile__wrapper">
          <img
            className="profile__picture"
            alt="User profile"
            src={
              profileImage.startsWith('http')
                ? profileImage
                : `/img/${profileImage}`
            }
          />
          <div className="profile__username">{username}</div>
          <div className="profile__bio">{bio}</div>
        </div>
      </header>

      <div className="profile__recipes">
        <div className="profile__title">Top Recipes</div>
        {recipes.length === 0 ? (
          <div className="profile__empty">This user has no recipes</div>
        ) : null}

        {recipes.map((recipe: any) => (
          <Link
            className="profile__recipe"
            to={`/recipe/${recipe.id}`}
            key={`recipe-${recipe.id}`}
          >
            <div className="profile__recipe-title">{recipe.title}</div>
            <div className="profile__recipe-summary">{recipe.summary}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProfilePage;
