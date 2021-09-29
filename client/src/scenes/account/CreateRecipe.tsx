import * as React from 'react';
import { useMutation, gql } from '@apollo/client';
import { useHistory, Redirect } from 'react-router-dom';
import { useAuthContext } from '../../context/auth';
import './styles/create.css';

const CREATE_RECIPE = gql`
  mutation createRecipe(
    $title: String!
    $summary: String!
    $directions: String!
    $ingredients: String!
    $prepTime: Int!
    $cookTime: Int!
    $published: Boolean!
    $mainImage: Upload
  ) {
    createRecipe(
      recipeInput: {
        title: $title
        summary: $summary
        directions: $directions
        ingredients: $ingredients
        prepTime: $prepTime
        cookTime: $cookTime
        published: $published
        mainImage: $mainImage
      }
    ) {
      id
    }
  }
`;

const CreateRecipePage = () => {
  const { state } = useAuthContext();
  const history = useHistory();
  const fileRef = React.createRef<HTMLInputElement>();
  const [title, setTitle] = React.useState<string>('');
  const [summary, setSummary] = React.useState<string>('');
  const [directions, setDirections] = React.useState('');
  const [ingredients, setIngredients] = React.useState<string>('');
  const [published, setPublished] = React.useState<boolean>(true);
  const [prepTime, setPrepTime] = React.useState<string>('');
  const [cookTime, setCookTime] = React.useState<string>('');
  const [mainImage, setMainImage] = React.useState<any>(undefined);
  const [previewImage, setPreviewImage] = React.useState<any | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [createRecipe, { loading }] = useMutation(CREATE_RECIPE, {
    update(_, { data: { createRecipe: recipeData } }) {
      history.push(`/recipe/${recipeData.id}`);
    },
    onError(err) {
      if (err.graphQLErrors[0] && err.graphQLErrors[0].extensions) {
        setErrors(err.graphQLErrors[0].extensions.errors);
      }
    },
    variables: {
      title,
      summary,
      directions: 'directions',
      ingredients: 'ingredients',
      published,
      cookTime: Number.parseInt(cookTime, 10),
      prepTime: Number.parseInt(prepTime, 10),
      mainImage,
    },
  });

  if (!state.authenticated) return <Redirect to="/signin" />;

  const submitHandler = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setErrors({});
    createRecipe();
  };

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
      <form className="form" onSubmit={submitHandler}>
        <fieldset className="form__field">
          <button
            className="form__button form__button--file"
            type="button"
            onClick={() => fileRef.current?.click()}
          >
            <div className="form__preview-cover">Click to replace image</div>
            <img
              className="form__preview"
              src={previewImage || '/img/defaultRecipe.jpg'}
              alt="Preview of recipe example"
            />
          </button>

          {previewImage ? (
            <button
              className="form__button form__button--remove"
              type="button"
              onClick={() => {
                setPreviewImage(null);
                setMainImage(null);
              }}
            >
              Remove Image
            </button>
          ) : null}

          <input
            id="photo"
            name="photo"
            className="form__input form__input--file"
            type="file"
            ref={fileRef}
            onChange={onFileChange}
            accept="image/png, image/jpeg"
          />
        </fieldset>

        <fieldset className="form__field">
          <label htmlFor="prep" className="form__label">
            <span className="form__labeling">Prep Time</span>
            {errors.prepTime ? (
              <span className="form__label-error">{errors.prepTime}</span>
            ) : null}
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
            {errors.cookTime ? (
              <span className="form__label-error">{errors.cookTime}</span>
            ) : null}
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

            <textarea
              id="summary"
              className="form__input form__input--textarea"
              name="summary"
              value={summary}
              onChange={(evt) => setSummary(evt.target.value)}
            />
          </label>
        </fieldset>

        <fieldset className="form__field">
          <label htmlFor="ingredients" className="form__label">
            <span className="form__labeling">Ingredients</span>

            {errors.prepTime ? (
              <span className="form__label-error">{errors.ingredients}</span>
            ) : null}

            <textarea
              id="ingredients"
              className="form__input form__input--textarea"
              name="ingredients"
              placeholder="Put each ingredients on its own line"
              value={ingredients}
              onChange={(evt) => {
                setIngredients(evt.target.value);
              }}
            />
          </label>
        </fieldset>

        <fieldset className="form__field">
          <label htmlFor="directions" className="form__label">
            <span className="form__labeling">Directions</span>

            {errors.directions ? (
              <span className="form__label-error">{errors.directions}</span>
            ) : null}

            <textarea
              id="directions"
              className="form__input form__input--textarea"
              name="directions"
              placeholder="Put each step on its own line"
              value={directions}
              onChange={(evt) => {
                setDirections(evt.target.value);
              }}
            />
          </label>
        </fieldset>

        <button
          className="form__button form__button--submit"
          type="submit"
          disabled={loading}
        >
          Create Recipe
        </button>
      </form>
    </section>
  );
};

export default CreateRecipePage;
