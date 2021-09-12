import * as React from 'react';
import './styles/support.css';

const SupportPage = () => (
  <section className="support">
    <header className="support__header">
      <h1 className="support__heading">Support Center</h1>

      <div className="support__container">
        <input
          className="support__input"
          type="text"
          placeholder="Search for a support problem"
        />
      </div>
    </header>

    <div className="support__list" />
  </section>
);

export default SupportPage;
