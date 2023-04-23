import * as React from 'react';

const FeedbackPage = () => {
  const [type, setType] = React.useState<string>('');
  const [feedback, setFeedback] = React.useState<string>('');

  const submitHandler = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
  };

  return (
    <section className="page-form" onSubmit={submitHandler}>
      <form className="form">
        <header className="form__header">
          <h3 className="form__heading">Feedback Form</h3>
        </header>

        <fieldset className="form__field">
          <span className="form__labeling">How was your experience:</span>
          <label htmlFor="positive" className="form__label">
            <input
              id="positive"
              className="form__input form__input--radio"
              type="radio"
              name="Positive"
              value="positive"
              onChange={(evt) => setType(evt.target.value)}
              checked={type === 'positive'}
            />
            <span className="form__labeling form__labeling--inline">
              Positive
            </span>
          </label>

          <label htmlFor="negative" className="form__label">
            <input
              id="negative"
              className="form__input form__input--radio"
              type="radio"
              name="negative"
              value="negative"
              onChange={(evt) => setType(evt.target.value)}
              checked={type === 'negative'}
            />
            <span className="form__labeling form__labeling--inline">
              Negative
            </span>
          </label>
        </fieldset>

        <fieldset className="form__field">
          <label htmlFor="feedback" className="form__label">
            <span className="form__labeling">
              Tell us about your experience
            </span>

            <textarea
              id="feedback"
              className="form__input form__input--textarea"
              value={feedback}
              placeholder="Enter feedback here"
              onChange={(evt) => setFeedback(evt.target.value)}
            />
          </label>
        </fieldset>

        <button className="form__button form__button--submit" type="submit">
          Submit
        </button>
      </form>
    </section>
  );
};

export default FeedbackPage;
