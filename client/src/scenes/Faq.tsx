import * as React from 'react';
import { Link } from 'react-router-dom';
import './styles/faq.css';

const QuestionItem = ({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode | null | undefined;
}) => {
  const [active, setActive] = React.useState<boolean>(false);

  return (
    <li className={`faq__item ${active ? 'faq__item--active' : ''}`}>
      <button
        className="faq__button"
        onClick={() => setActive(!active)}
        type="button"
      >
        <div className="faq__question">{question}</div>
        <div className="faq__toggle">
          <span className="faq__bar faq__bar--1" />
          <span className="faq__bar faq__bar--2" />
        </div>
      </button>

      <div className="faq__answer">{children}</div>
    </li>
  );
};

const FaqPage = () => (
  <section className="faq">
    <header className="faq__header">
      <h1 className="faq__heading">Frequently Asked Questions (FAQ)</h1>
    </header>

    <div className="faq__wrapper">
      <aside className="faq__aside">
        <div className="faq__links">
          <Link className="faq__link" to="/faq#general">
            General
          </Link>

          <Link className="faq__link" to="/faq#account">
            Profile & Account
          </Link>

          <Link className="faq__link" to="/faq#recipes">
            Recipes
          </Link>
        </div>
      </aside>

      <div className="faq__questions">
        <ul id="general" className="faq__list">
          <li className="faq__item faq__item--title">General</li>
          <QuestionItem question="Do I have to pay to use Reshipi Bukku?">
            <p className="faq__answer-text">
              No. Reshipi Bukku is built for people who want to find, share, and
              store their family recipes for free, the way it should be.
            </p>
          </QuestionItem>
        </ul>

        <ul id="account" className="faq__list">
          <li className="faq__item faq__item--title">Profile & Account</li>
          <QuestionItem question="How do I delete my account?">
            <p className="faq__answer-text">
              We&apos;re sad to see you go! We would really appreciate hearing
              why Reshipi Bukku is no longer for you. Feel free to
              <Link className="faq__answer-link" to="/feedback">
                {' '}
                tell use more{' '}
              </Link>
              about what we can provide for you.
            </p>
            <p className="faq__answer-text">
              To permanently delete your account:
              <ul className="faq__answer-list">
                <li className="faq__answer-item">
                  Go to your Account settings page
                </li>
                <li className="faq__answer-item">
                  Click &quot;Delete Account&quot; at the bottom fo the page.
                </li>
              </ul>
            </p>
          </QuestionItem>

          <QuestionItem question="How long does it take to set up my profile?">
            <p className="faq__answer-text">
              You can set up your profile in under 10 minutes.
            </p>
          </QuestionItem>

          <QuestionItem question="How can I see how my profile is doing?">
            <p className="faq__answer-text">
              We provide all users with analytics about that recipes to give you
              actionable insight on how to get more eyes on your pages. You can
              track profile visits and recipes views.
            </p>
          </QuestionItem>
        </ul>

        <ul id="recipe" className="faq__list">
          <li className="faq__item faq__item--title">Recipes</li>
          <QuestionItem question="How do I create a new recipe?">
            <p className="faq__text">
              To create a new recipe, go to your &quot;Creator Dashboard&quot;
              and click the &quot;Create Recipe&quot; button.
            </p>
          </QuestionItem>

          <QuestionItem question="How do I delete recipes?">
            <p className="faq__answer-text">
              To delete a recipe:
              <ul className="faq__answer-list">
                <li className="faq__answer-item">
                  Go to your Recipe&apos;s page
                </li>

                <li className="faq__answer-item">
                  Click the &quot;Settings&quot; button
                </li>

                <li className="faq__answer-item">
                  Click the &quot;Delete&quot; button and follow the
                  instructions to confirm the deletion.
                </li>
              </ul>
            </p>

            <p className="faq__text">
              If just want to hide a recipe while you edit it, you can set view
              mode of the recipe to &quot;Private&quot; so only you can see it.
            </p>

            <p className="faq__answer-text">
              To set a recipe to private:
              <ul className="faq__answer-list">
                <li className="faq__answer-item">
                  Go to your Recipe&apos;s page
                </li>

                <li className="faq__answer-item">
                  Click the &quot;Settings&quot; button
                </li>

                <li className="faq__answer-item">
                  Find the &quot;Visibility&quot; toggle and switch it to
                  private.
                </li>
              </ul>
            </p>
          </QuestionItem>

          <QuestionItem question="Can I import a recipe I've written on another site?">
            <p className="faq__answer-text">
              Unfortunately, we do not have a way to current do this. However,
              if the feature is requested enough, we will look into creating a
              tool automate the move for you.
            </p>
          </QuestionItem>
        </ul>
      </div>
    </div>
  </section>
);

export default FaqPage;
