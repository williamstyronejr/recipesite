import * as React from 'react';
import { Link } from 'react-router-dom';
import './styles/faq.css';

const QuestionItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
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

      <div className="faq__answer">{answer}</div>
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
        </div>
      </aside>

      <div className="faq__questions">
        <ul id="general" className="faq__list">
          <li className="faq__item faq__item--title">General</li>
          <QuestionItem
            question="Do I have to pay to use Reshipi Bukku?"
            answer="No."
          />
        </ul>
        <ul id="general" className="faq__list">
          <li className="faq__item faq__item--title">General</li>
          <QuestionItem
            question="Do I have to pay to use Reshipi Bukku?"
            answer="No."
          />
        </ul>
        <ul id="general" className="faq__list">
          <li className="faq__item faq__item--title">General</li>
          <QuestionItem
            question="Do I have to pay to use Reshipi Bukku?"
            answer="No."
          />
        </ul>
        <ul id="general" className="faq__list">
          <li className="faq__item faq__item--title">General</li>
          <QuestionItem
            question="Do I have to pay to use Reshipi Bukku?"
            answer="No."
          />
        </ul>
      </div>
    </div>
  </section>
);

export default FaqPage;
