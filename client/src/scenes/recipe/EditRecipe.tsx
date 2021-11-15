import * as React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuthContext } from '../../context/auth';
import Recipe from '../../components/Recipe';
import ConfirmDialog from '../../components/ConfirmDialog';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import { validateRecipe } from '../../utils/validators';
import './styles/recipe.css';

const QUERY_RECIPE = gql`
  query ($recipeId: ID!) {
    getRecipe(recipeId: $recipeId) {
      id
      title
      summary
      directions
      ingredients
      mainImage
      prepTime
      cookTime
      author
      authorName
      published
    }
  }
`;

const DELETE_RECIPE = gql`
  mutation deleteRecipe($recipeId: ID!) {
    deleteRecipe(recipeId: $recipeId)
  }
`;

const UPDATE_RECIPE = gql`
  mutation updateRecipe(
    $recipeId: ID!
    $title: String!
    $summary: String!
    $directions: String!
    $ingredients: String!
    $prepTime: Int!
    $cookTime: Int!
    $published: Boolean!
    $mainImage: Upload
    $removeImage: Boolean
  ) {
    updateRecipe(
      recipeInput: {
        id: $recipeId
        title: $title
        summary: $summary
        directions: $directions
        ingredients: $ingredients
        prepTime: $prepTime
        cookTime: $cookTime
        published: $published
        mainImage: $mainImage
        removeImage: $removeImage
      }
    ) {
      success
      errors {
        ... on UserInputError {
          path
          message
        }
      }
    }
  }
`;

const EditRecipe = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const { state } = useAuthContext();
  const history = useHistory();
  const fileRef = React.createRef<HTMLInputElement>();
  const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = React.useState<boolean>();
  const [title, setTitle] = React.useState<string>('');
  const [directions, setDirections] = React.useState<string>('');
  const [summary, setSummary] = React.useState<string>('');
  const [ingredients, setIngredients] = React.useState<string>('');
  const [prepTime, setPrepTime] = React.useState<string>('');
  const [cookTime, setCookTime] = React.useState<string>('');
  const [mainImage, setMainImage] = React.useState<any>(undefined);
  const [published, setPublished] = React.useState<boolean>(false);
  const [previewImage, setPreviewImage] = React.useState<any>(null);
  const [removeImage, setRemoveImage] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [deleteRecipe] = useMutation(DELETE_RECIPE, {
    update(_, { data: { deleteRecipe: complete } }) {
      if (complete) history.push(`/account/profile/${state.id}`);
    },
    onError() {
      setErrors({ general: 'Recipe could not be deleted, please try again.' });
    },
    variables: {
      recipeId,
    },
  });

  const [updateRecipe] = useMutation(UPDATE_RECIPE, {
    update(_, { data: { updateRecipe: res } }) {
      if (res.errors) {
        const errs: any = {};
        res.errors.forEach((error: any) => {
          errs[error.path] = error.message;
        });

        return setErrors(errs);
      }
      history.push(`/recipe/${recipeId}`);
    },
    onError() {
      setErrors({ general: 'Server error occurrer, please try again.' });
    },
    variables: {
      recipeId,
      title,
      directions,
      ingredients,
      summary,
      prepTime: parseInt(prepTime, 10),
      cookTime: parseInt(cookTime, 10),
      published,
      mainImage: mainImage === 'defaultRecipe.jpg' ? undefined : mainImage,
      removeImage,
    },
  });

  const { loading, error } = useQuery(QUERY_RECIPE, {
    onCompleted(data) {
      setTitle(data.getRecipe.title);
      setDirections(data.getRecipe.directions);
      setSummary(data.getRecipe.summary);
      setPublished(data.getRecipe.published);
      setMainImage(data.getRecipe.mainImage);
      setCookTime(data.getRecipe.cookTime.toString());
      setPrepTime(data.getRecipe.prepTime.toString());
      setIngredients(data.getRecipe.ingredients);
    },
    variables: {
      recipeId,
    },
  });

  if (error) return <Error />;
  if (loading) return <Loading />;

  function submitHandler(evt: React.SyntheticEvent<HTMLFormElement>) {
    evt.preventDefault();

    const validateErr = validateRecipe(
      title,
      prepTime,
      cookTime,
      summary,
      directions,
      ingredients,
      published,
    );
    if (Object.keys(validateErr).length > 0) return setErrors(validateErr);

    setErrors({});
    updateRecipe();
  }

  function onFileChange(evt: React.SyntheticEvent<HTMLInputElement>): void {
    if (!evt.currentTarget.files || evt.currentTarget.files?.length === 0) {
      return;
    }

    setMainImage(evt.currentTarget.files[0]);

    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      if (e.target) setPreviewImage(e.target.result);
    };

    fileReader.readAsDataURL(evt.currentTarget.files[0]);
  }

  return (
    <section className="form-wrapper form-wrapper--wide">
      {previewVisible ? (
        <Recipe
          id=""
          entityId=""
          title={title}
          summary={summary}
          prepTime={prepTime}
          cookTime={cookTime}
          authorName={state.username || ''}
          author={state.id as number}
          mainImage={mainImage}
          ingredients={ingredients}
          directions={directions}
          avgRating={0}
          userRating={0}
          ratingCount={0}
          onPreviewClose={() => {
            setPreviewVisible(false);
          }}
          isPreview
          isOwner
        />
      ) : (
        <form className="form" onSubmit={submitHandler}>
          <header className="form__header">
            {errors.general ? (
              <div className="form__error">{errors.general}</div>
            ) : null}

            <button
              className="form__button form__button--preview"
              type="button"
              onClick={() => setPreviewVisible(true)}
            >
              Preview
            </button>

            <button
              className="form__button form__button--delete"
              type="button"
              onClick={() => setDialogVisible(true)}
            >
              Delete
            </button>

            {dialogVisible ? (
              <ConfirmDialog
                onConfirm={() => {
                  setDialogVisible(false);
                  deleteRecipe();
                }}
                onCancel={() => {
                  setDialogVisible(false);
                }}
                message="Are you sure you want to delete your recipe?"
              />
            ) : null}
          </header>

          <fieldset className="form__field">
            <label
              htmlFor="recipeImage"
              className="form__label form__label--file"
            >
              <button
                className="form__button form__button--file"
                type="button"
                onClick={() => fileRef.current?.click()}
              >
                <div className="form__preview-cover">
                  Click to replace image
                </div>
                <img
                  className="form__preview"
                  src={previewImage || `/img/${mainImage}`}
                  alt="Recipe example"
                />
              </button>
              <input
                id="recipeImage"
                name="recipeImage"
                type="file"
                className="form__input form__input--file"
                ref={fileRef}
                onChange={onFileChange}
              />
            </label>

            {previewImage || mainImage !== 'defaultRecipe.jpg' ? (
              <button
                className="form__button form__button--remove"
                type="button"
                onClick={() => {
                  setPreviewImage(null);
                  setMainImage('defaultRecipe.jpg');
                  setRemoveImage(true);
                }}
              >
                Remove Image
              </button>
            ) : null}
          </fieldset>

          <fieldset className="form__field">
            <label htmlFor="prep" className="form__label">
              <span className="form__labeling">Prep Time</span>
              <input
                id="prep"
                name="prep"
                type="text"
                className="form__input form__input--text"
                value={prepTime}
                onChange={(evt) => setPrepTime(evt.target.value)}
              />
            </label>

            <label htmlFor="cook" className="form__label">
              <span className="form__labeling">Cook Time</span>
              <input
                id="cook"
                name="cook"
                type="text"
                className="form__input form__input--text"
                value={cookTime}
                onChange={(evt) => setCookTime(evt.target.value)}
              />
            </label>

            <label htmlFor="published" className="form__label">
              <span className="labeling">Private</span>
              <input
                id="published"
                name="published"
                className="form__input form__input--radio"
                type="radio"
                value="private"
                checked={!published}
                onChange={() => setPublished(false)}
              />
            </label>

            <label htmlFor="published" className="form__label">
              <span className="labeling">Public</span>
              <input
                id="published"
                name="published"
                className="form__input form__input--radio"
                type="radio"
                value="public"
                checked={published}
                onChange={() => setPublished(true)}
              />
            </label>
          </fieldset>

          <fieldset className="form__field">
            <label htmlFor="title" className="form__label">
              <span className="form__labeling">Title</span>

              {errors.title ? (
                <span className="form__label-error">{errors.title}</span>
              ) : null}

              <input
                id="title"
                name="title"
                className="form__input form__input--text"
                value={title}
                onChange={(evt) => setTitle(evt.target.value)}
              />
            </label>
          </fieldset>

          <fieldset className="form__field">
            <label htmlFor="summary" className="form__label">
              <span className="form__labeling">Summary</span>

              {errors.summary ? (
                <span className="form__label-error">{errors.summary}</span>
              ) : null}

              <input
                id="summary"
                name="summary"
                className="form__input form__input--text"
                value={summary}
                onChange={(evt) => setSummary(evt.target.value)}
              />
            </label>
          </fieldset>

          <fieldset className="form__field">
            <label htmlFor="ingredients" className="form__label">
              <span className="form__labeling">Ingredients</span>

              {errors.ingredients ? (
                <span className="form__label-error">{errors.ingredients}</span>
              ) : null}

              <textarea
                id="ingredients"
                name="ingredients"
                className="form__input form__input--textarea"
                value={ingredients}
                onChange={(evt) => setIngredients(evt.target.value)}
              />
            </label>
          </fieldset>

          <fieldset className="form__field">
            <label htmlFor="direction" className="form__label">
              <span className="form__labeling">Direction</span>

              {errors.directins ? (
                <span className="form__label-error">{errors.directions}</span>
              ) : null}

              <textarea
                id="direction"
                name="direction"
                className="form__input form__input--textarea"
                value={directions}
                onChange={(evt) => setDirections(evt.target.value)}
              />
            </label>
          </fieldset>

          <button className="form__button form__button--submit" type="submit">
            Update
          </button>
        </form>
      )}
    </section>
  );
};

export default EditRecipe;
