import { useState, createRef, SyntheticEvent } from 'react';
import Head from 'next/head';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import { validateRecipe } from '@/utils/validators';
import Image from 'next/image';
import SelectInput from '@/components/ui/SelectInput';

const CREATE_RECIPE = gql`
  mutation createRecipe(
    $title: String
    $summary: String
    $directions: String
    $ingredients: String
    $prepTime: Int
    $cookTime: Int
    $published: Boolean!
    $mainImage: Upload
    $type: String
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
        type: $type
      }
    ) {
      recipe {
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

const CreateRecipePage = () => {
  const router = useRouter();
  const fileRef = createRef<HTMLInputElement>();
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [directions, setDirections] = useState('');
  const [ingredients, setIngredients] = useState<string>('');
  const [published, setPublished] = useState<boolean>(true);
  const [prepTime, setPrepTime] = useState<string>('');
  const [cookTime, setCookTime] = useState<string>('');
  const [mainImage, setMainImage] = useState<any>(undefined);
  const [previewImage, setPreviewImage] = useState<any | null>(null);
  const [mealType, setMealType] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createRecipe, { loading }] = useMutation(CREATE_RECIPE, {
    update(_, { data: { createRecipe: res } }) {
      if (res.errors) {
        const errs: any = {};
        res.errors.forEach((error: any) => {
          errs[error.path] = error.message;
        });

        return setErrors(errs);
      }

      if (!res.recipe)
        return setErrors({
          general: 'Server error occurred, please try again.',
        });

      router.push(`/recipe/${res.recipe.id}`);
    },
    onError() {
      setErrors({ general: 'An error occurred, please try again.' });
    },
    variables: {
      title,
      summary,
      directions,
      ingredients,
      published,
      cookTime: Number.parseInt(cookTime, 10),
      prepTime: Number.parseInt(prepTime, 10),
      mainImage,
      type: mealType,
    },
  });

  const submitHandler = (evt: SyntheticEvent<HTMLFormElement>) => {
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
    createRecipe();
  };

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
        <title>Create Recipe - Reshipi Bukku</title>
      </Head>

      <form className="form" onSubmit={submitHandler}>
        <header className="form__header">
          {errors.general ? (
            <div className="form__error">{errors.general}</div>
          ) : null}
        </header>

        <fieldset className="form__field">
          <button
            className="form__button form__button--file"
            type="button"
            onClick={() => fileRef.current?.click()}
          >
            <div className="form__preview-cover">Click to replace image</div>
            <div className="form__preview-wrapper">
              <Image
                fill={true}
                className="form__preview"
                src={previewImage || '/images/defaultRecipe.jpg'}
                alt="Preview of recipe example"
              />
            </div>
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

        <span className="form__labeling">Publish Status</span>
        <fieldset className="form__field form__field--flex">
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
            value={mealType}
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

            {errors.prepTime ? (
              <span className="form__label-error" data-cy="field-error">
                {errors.prepTime}
              </span>
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
              <span className="form__label-error" data-cy="field-error">
                {errors.cookTime}
              </span>
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
        </fieldset>

        <fieldset className="form__field">
          <label htmlFor="title" className="form__label">
            <span className="form__labeling">Title</span>

            {errors.title ? (
              <span className="form__label-error" data-cy="field-error">
                {errors.title}
              </span>
            ) : null}

            <input
              id="title"
              name="title"
              className="form__input form__input--text"
              value={title}
              onChange={(evt) => setTitle(evt.target.value)}
            />
          </label>

          <label htmlFor="summary" className="form__label">
            <span className="form__labeling">Summary</span>

            {errors.summary ? (
              <span className="form__label-error" data-cy="field-error">
                {errors.summary}
              </span>
            ) : null}

            <textarea
              id="summary"
              name="summary"
              className="form__input form__input--textarea"
              value={summary}
              onChange={(evt) => setSummary(evt.target.value)}
            />
          </label>

          <label htmlFor="ingredients" className="form__label">
            <span className="form__labeling">Ingredients</span>

            {errors.ingredients ? (
              <span className="form__label-error" data-cy="field-error">
                {errors.ingredients}
              </span>
            ) : null}

            <textarea
              id="ingredients"
              name="ingredients"
              className="form__input form__input--textarea"
              placeholder="Put each ingredients on its own line"
              value={ingredients}
              onChange={(evt) => {
                setIngredients(evt.target.value);
              }}
            />
          </label>

          <label htmlFor="directions" className="form__label">
            <span className="form__labeling">Directions</span>

            {errors.directions ? (
              <span className="form__label-error" data-cy="field-error">
                {errors.directions}
              </span>
            ) : null}

            <textarea
              id="directions"
              name="directions"
              className="form__input form__input--textarea"
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

CreateRecipePage.auth = {};

export default CreateRecipePage;
