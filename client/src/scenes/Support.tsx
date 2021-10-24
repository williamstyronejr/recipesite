import * as React from 'react';
import { Link } from 'react-router-dom';
import './styles/support.css';

const SupportPage = () => (
  <section className="support">
    <header className="support__header">
      <h1 className="support__heading">
        Support Center
        <div className="support__container">
          <input
            className="support__input"
            type="text"
            placeholder="Search for a support problem"
          />
        </div>
      </h1>
    </header>

    <div className="support__list">
      <div className="support__item">
        <Link className="support__link" to="/recovery">
          Forgot password
        </Link>
      </div>

      <div className="support__item">
        <Link className="support__link" to="/faq">
          Faq
        </Link>
      </div>
    </div>
  </section>
);

export default SupportPage;
