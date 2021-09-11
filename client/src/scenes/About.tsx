import * as React from 'react';
import './styles/about.css';

const AboutPage = () => (
  <>
    <section className="about">
      <header className="about__header">
        <h1 className="about__heading">
          Empowering home chiefs around the world to explore and learn
        </h1>
      </header>
    </section>

    <section className="mission">
      <header className="mission__header">
        <h2 className="mission__heading">
          Our mission is to help creators spread their love for food and store
          family memories.
        </h2>

        <p className="mission__description">
          To us, food is more than what we eat. We believe in sharing out
          experiences through food and being a place to store those special
          family recipes.
        </p>
      </header>
    </section>

    <section className="passionate">
      <header className="passionate__header">
        <h3 className="passionate__heading">
          We&apso;re passionate about creating
        </h3>
        <div className="passionate__list">
          <span className="passionate__item">COMMUNITY</span>
          <span className="passionate__item">FOOD</span>
          <span className="passionate__item">FAMILY</span>
        </div>
      </header>
    </section>
  </>
);

export default AboutPage;
