import { useState, createRef, SyntheticEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuthContext } from '@/hooks/useAuth';
import Image from 'next/image';
import Recipe from '@/components/ui/Recipe';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Loading from '@/components/ui/Loading';
import ErrorPage from '@/components/ui/Error';
import { validateRecipe } from '@/utils/validators';
import SelectInput from '@/components/ui/SelectInput';

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
      authorImage
      published
      type
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
    $type: String
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
        type: $type
      }
    ) {
      success
      recipe {
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
        authorImage
        published
        type
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

const EditRecipe = () => {
  const router = useRouter();
  const { state } = useAuthContext();
  const fileRef = createRef<HTMLInputElement>();
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>();
  const [title, setTitle] = useState<string>('');
  const [directions, setDirections] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [ingredients, setIngredients] = useState<string>('');
  const [prepTime, setPrepTime] = useState<string>('');
  const [cookTime, setCookTime] = useState<string>('');
  const [mainImage, setMainImage] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<any>(null);
  const [initialImage, setInitialImage] = useState<string>('');
  const [published, setPublished] = useState<boolean>(false);
  const [removeImage, setRemoveImage] = useState<boolean>(false);
  const [authorImage, setAuthorImage] = useState<string>('');
  const [mealType, setMealType] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [deleteRecipe] = useMutation(DELETE_RECIPE, {
    update(_, { data: { deleteRecipe: complete } }) {
      if (complete) router.push(`/account/profile/${state.id}`);
    },
    onError() {
      setErrors({ general: 'Recipe could not be deleted, please try again.' });
    },
    variables: {
      recipeId: router.query.recipeId,
    },
  });

  const [updateRecipe] = useMutation(UPDATE_RECIPE, {
    update(cache, { data: { updateRecipe: res } }) {
      if (res.errors) {
        const errs: any = {};
        res.errors.forEach((error: any) => {
          errs[error.path] = error.message;
        });
        return setErrors(errs);
      }

      router.push(`/recipe/${router.query.recipeId}`);
    },
    onError() {
      setErrors({ general: 'Server error occurrer, please try again.' });
    },
    refetchQueries: [QUERY_RECIPE],
    variables: {
      recipeId: router.query.recipeId,
      title,
      directions,
      ingredients,
      summary,
      prepTime: parseInt(prepTime, 10),
      cookTime: parseInt(cookTime, 10),
      published,
      removeImage,
      type: mealType,
      mainImage:
        initialImage === mainImage || removeImage === true
          ? undefined
          : mainImage,
    },
  });

  const { loading, error } = useQuery(QUERY_RECIPE, {
    onCompleted(data) {
      setTitle(data.getRecipe.title);
      setDirections(data.getRecipe.directions);
      setSummary(data.getRecipe.summary);
      setPublished(data.getRecipe.published);
      setInitialImage(data.getRecipe.mainImage);
      setMainImage(data.getRecipe.mainImage);
      setCookTime(data.getRecipe.cookTime.toString());
      setPrepTime(data.getRecipe.prepTime.toString());
      setIngredients(data.getRecipe.ingredients);
      setAuthorImage(data.getRecipe.authorImage);
      setMealType(data.getRecipe.type);
    },
    skip: !router.query || !router.query.recipeId,
    variables: {
      recipeId: router.query.recipeId,
    },
  });

  if (error) return <ErrorPage />;
  if (loading) return <Loading />;

  function submitHandler(evt: SyntheticEvent<HTMLFormElement>) {
    evt.preventDefault();

    const validateErr = validateRecipe(
      title,
      prepTime,
      cookTime,
      summary,
      directions,
      ingredients,
      published
    );
    if (Object.keys(validateErr).length > 0) return setErrors(validateErr);

    setErrors({});
    updateRecipe();
  }

  function onFileChange(evt: SyntheticEvent<HTMLInputElement>): void {
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
      <Head>
        <title>Edit Recipe - Reshipi Bukku</title>
      </Head>
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
          favorited={false}
          authorImage={authorImage}
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

                <div className="form__preview-wrapper">
                  {previewImage || mainImage ? (
                    <Image
                      fill={true}
                      className="form__preview"
                      src={previewImage || mainImage}
                      alt="Recipe example"
                    />
                  ) : null}
                </div>
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

            {previewImage || mainImage !== '/images/defaultRecipe.jpg' ? (
              <button
                className="form__button form__button--remove"
                type="button"
                onClick={() => {
                  setPreviewImage(null);
                  setMainImage('/images/defaultRecipe.jpg');
                  setRemoveImage(true);
                }}
              >
                Remove Image
              </button>
            ) : null}
          </fieldset>

          <fieldset className="form__field form__field--flex">
            <span className="form__labeling">Publish Status</span>

            <label
              htmlFor="published-1"
              className="form__label form__label--inline form__label--radio"
            >
              <input
                id="published-1"
                name="published"
                className="form__input form__input--radio"
                type="radio"
                value="public"
                checked={published}
                onChange={() => setPublished(true)}
              />
              <div className="form__custom-radio" />
              <span className="form__labeling">Public</span>
            </label>

            <label
              htmlFor="published-2"
              className="form__label form__label--inline form__label--radio"
            >
              <input
                id="published-2"
                name="published"
                className="form__input form__input--radio"
                type="radio"
                value="private"
                checked={!published}
                onChange={() => setPublished(false)}
              />
              <div className="form__custom-radio" />
              <span className="form__labeling">Private</span>
            </label>
          </fieldset>

          <fieldset className="form__field">
            <span className="form__labeling">Recipe Type</span>

            <SelectInput
              name="type"
              title="Select Meal Type"
              value={mealType || ''}
              changeValue={(str: string) => setMealType(str)}
              options={[
                'Snack',
                'Breakfast',
                'Lunch',
                'Dinner',
                'Dessert',
                'Other',
              ]}
            />
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

EditRecipe.auth = {};

export default EditRecipe;
