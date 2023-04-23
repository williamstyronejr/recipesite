import * as React from 'react';
import Link from 'next/link';
import styles from './styles/faq.module.css';

const QuestionItem = ({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode | null | undefined;
}) => {
  const [active, setActive] = React.useState<boolean>(false);

  return (
    <li
      className={`${styles.faq__item} ${
        active ? styles.faq__item__active : ''
      }`}
    >
      <button
        className={styles.faq__button}
        onClick={() => setActive(!active)}
        type="button"
      >
        <div className={styles.faq__question}>{question}</div>
        <div className={styles.faq__toggle}>
          <span className={`${styles.faq__bar} ${styles.faq__bar__1}`} />
          <span className={`${styles.faq__bar} ${styles.faq__bar__2}`} />
        </div>
      </button>

      <div className={styles.faq__answer}>{children}</div>
    </li>
  );
};

const FaqPage = () => (
  <section className={styles.faq}>
    <header className={styles.faq__header}>
      <h1 className={styles.faq__heading}>Frequently Asked Questions (FAQ)</h1>
    </header>

    <div className={styles.faq__wrapper}>
      <aside className={styles.faq__aside}>
        <div className={styles.faq__links}>
          <Link className={styles.faq__link} href="/faq#general">
            General
          </Link>

          <Link className={styles.faq__link} href="/faq#account">
            Profile & Account
          </Link>

          <Link className={styles.faq__link} href="/faq#recipes">
            Recipes
          </Link>
        </div>
      </aside>

      <div className={styles.faq__questions}>
        <ul id="general" className={styles.faq__list}>
          <li className={`${styles.faq__item} ${styles.faq__item__title}`}>
            General
          </li>
          <QuestionItem question="Do I have to pay to use Reshipi Bukku?">
            <p className={styles.faq__answer_text}>
              No. Reshipi Bukku is built for people who want to find, share, and
              store their family recipes for free, the way it should be.
            </p>
          </QuestionItem>
        </ul>

        <ul id="account" className={styles.faq__list}>
          <li className={`${styles.faq__item} ${styles.faq__item__title}`}>
            Profile & Account
          </li>
          <QuestionItem question="How do I delete my account?">
            <p className={styles.faq__answer_text}>
              We&apos;re sad to see you go! We would really appreciate hearing
              why Reshipi Bukku is no longer for you. Feel free to
              <Link className={styles.faq__answer_link} href="/feedback">
                {' '}
                tell use more{' '}
              </Link>
              about what we can provide for you.
            </p>
            <p className={styles.faq__answer_text}>
              To permanently delete your account:
              <ul className={styles.faq__answer_list}>
                <li className={styles.faq__answer_item}>
                  Go to your Account settings page
                </li>
                <li className={styles.faq__answer_item}>
                  Click &quot;Delete Account&quot; at the bottom fo the page.
                </li>
              </ul>
            </p>
          </QuestionItem>

          <QuestionItem question="How long does it take to set up my profile?">
            <p className={styles.faq__answer_text}>
              You can set up your profile in under 10 minutes.
            </p>
          </QuestionItem>

          <QuestionItem question="How can I see how my profile is doing?">
            <p className={styles.faq__answer_text}>
              We provide all users with analytics about that recipes to give you
              actionable insight on how to get more eyes on your pages. You can
              track profile visits and recipes views.
            </p>
          </QuestionItem>
        </ul>

        <ul id="recipe" className={styles.faq__list}>
          <li className={`${styles.faq__item} ${styles.faq__item__title}`}>
            Recipes
          </li>
          <QuestionItem question="How do I create a new recipe?">
            <p className={styles.faq__text}>
              To create a new recipe, go to your &quot;Creator Dashboard&quot;
              and click the &quot;Create Recipe&quot; button.
            </p>
          </QuestionItem>

          <QuestionItem question="How do I delete recipes?">
            <p className={styles.faq__answer_text}>
              To delete a recipe:
              <ul className={styles.faq__answer_list}>
                <li className={styles.faq__answer_item}>
                  Go to your Recipe&apos;s page
                </li>

                <li className={styles.faq__answer_item}>
                  Click the &quot;Settings&quot; button
                </li>

                <li className={styles.faq__answer_item}>
                  Click the &quot;Delete&quot; button and follow the
                  instructions to confirm the deletion.
                </li>
              </ul>
            </p>

            <p className={styles.faq__text}>
              If just want to hide a recipe while you edit it, you can set view
              mode of the recipe to &quot;Private&quot; so only you can see it.
            </p>

            <p className={styles.faq__answer_text}>
              To set a recipe to private:
              <ul className={styles.faq__answer_list}>
                <li className={styles.faq__answer_item}>
                  Go to your Recipe&apos;s page
                </li>

                <li className={styles.faq__answer_item}>
                  Click the &quot;Settings&quot; button
                </li>

                <li className={styles.faq__answer_item}>
                  Find the &quot;Visibility&quot; toggle and switch it to
                  private.
                </li>
              </ul>
            </p>
          </QuestionItem>

          <QuestionItem question="Can I import a recipe I've written on another site?">
            <p className={styles.faq__answer_text}>
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
