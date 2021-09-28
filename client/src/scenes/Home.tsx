import * as React from 'react';
import { Link } from 'react-router-dom';
import NewsLetter from '../components/NewsLetter';
import Plate1 from '../images/plate1.png';
import Plate2 from '../images/plate2.png';
import Plate3 from '../images/plate3.png';
import Plate4 from '../images/plate4.png';
import Plate5 from '../images/plate5.png';
import Plate6 from '../images/plate6.png';
import Plate7 from '../images/plate7.png';
import Plate8 from '../images/plate8.png';
import Plate9 from '../images/plate9.png';
import './styles/home.css';

const HomePage = () => (
  <>
    <section className="home">
      <header className="home__header">
        <h1 className="home__heading">
          Let&apos;s Start Cooking With Popular Recipes
        </h1>

        <p className="home__description">
          Want to learn how to cook but confused where to start?
        </p>

        <div>
          <Link className="home__link" to="/started">
            Get Started
          </Link>
          <Link className="home__link home__link--off" to="/explore/popular">
            Explore Recipes
          </Link>
        </div>

        <svg
          className="home__blob"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M65.4,-29C77.4,-16.8,75,12.5,61.7,34.4C48.3,56.4,24.2,70.9,4.4,68.3C-15.3,65.8,-30.7,46.2,-44.8,23.8C-59,1.4,-71.9,-23.8,-64.2,-33.5C-56.5,-43.2,-28.3,-37.4,-0.8,-36.9C26.6,-36.4,53.3,-41.3,65.4,-29Z"
            transform="translate(100 100)"
          />
        </svg>
      </header>

      <div className="home__aside">
        <img className="home__food" alt="Food Plate" src={Plate9} />

        <div className="home__review home__review--top">
          <h4 className="home__title">Vegetable Stir Fry</h4>
          <div className="home__rating">
            <svg
              className="home__fire"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 511.269 511.269"
            >
              <path
                d="M140.367,465.067C116.9,438.4,93.434,410.667,78.5,377.6c-14.933-35.2-19.2-75.733-11.733-114.133
                  s24.533-74.667,49.067-105.6c-2.133,26.667,7.467,54.4,25.6,74.667c-10.667-51.2,6.4-106.667,40.533-147.2S263.034,18.133,312.1,0
                  c-24.533,25.6-27.733,66.133-18.133,100.267c9.6,34.133,29.867,64,48,94.933c18.133,30.933,35.2,62.933,36.267,98.133
                  c9.6-18.133,20.267-36.267,26.667-56.533c6.4-20.267,9.6-41.6,4.267-61.867c19.2,23.467,29.867,46.933,35.2,76.8
                  c5.333,29.867,4.267,60.8,1.067,90.667c-4.267,33.067-12.8,67.2-30.933,94.933c-21.333,33.067-55.467,56.533-92.8,69.333
                  C255.567,518.4,190.5,508.8,140.367,465.067z"
              />
              <path
                d="M221.434,504.533C308.9,538.667,395.3,435.2,347.3,355.2c0-1.067-1.067-1.067-1.067-2.133
                  c4.267,43.733-6.4,75.733-26.667,93.867c10.667-25.6,3.2-55.467-9.6-81.067c-12.8-24.533-30.933-46.933-44.8-70.4
                  c-13.867-24.533-24.533-52.267-18.133-80c-25.6,19.2-43.733,48-51.2,78.933c-7.467,30.933-3.2,65.067,10.667,93.867
                  c-16-11.733-27.733-30.933-28.8-51.2c-17.067,20.267-27.733,46.933-26.667,73.6C151.034,452.267,184.1,489.6,221.434,504.533z"
              />
            </svg>
            4.7
          </div>
          <p className="home__text">Healthy with great taste!</p>
        </div>
        <div className="home__review home__review--bottom">
          <h4 className="home__title">Vegetable Stir Fry</h4>
          <div className="home__rating">
            <svg
              className="home__fire"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 511.269 511.269"
            >
              <path
                d="M140.367,465.067C116.9,438.4,93.434,410.667,78.5,377.6c-14.933-35.2-19.2-75.733-11.733-114.133
                  s24.533-74.667,49.067-105.6c-2.133,26.667,7.467,54.4,25.6,74.667c-10.667-51.2,6.4-106.667,40.533-147.2S263.034,18.133,312.1,0
                  c-24.533,25.6-27.733,66.133-18.133,100.267c9.6,34.133,29.867,64,48,94.933c18.133,30.933,35.2,62.933,36.267,98.133
                  c9.6-18.133,20.267-36.267,26.667-56.533c6.4-20.267,9.6-41.6,4.267-61.867c19.2,23.467,29.867,46.933,35.2,76.8
                  c5.333,29.867,4.267,60.8,1.067,90.667c-4.267,33.067-12.8,67.2-30.933,94.933c-21.333,33.067-55.467,56.533-92.8,69.333
                  C255.567,518.4,190.5,508.8,140.367,465.067z"
              />
              <path
                d="M221.434,504.533C308.9,538.667,395.3,435.2,347.3,355.2c0-1.067-1.067-1.067-1.067-2.133
                  c4.267,43.733-6.4,75.733-26.667,93.867c10.667-25.6,3.2-55.467-9.6-81.067c-12.8-24.533-30.933-46.933-44.8-70.4
                  c-13.867-24.533-24.533-52.267-18.133-80c-25.6,19.2-43.733,48-51.2,78.933c-7.467,30.933-3.2,65.067,10.667,93.867
                  c-16-11.733-27.733-30.933-28.8-51.2c-17.067,20.267-27.733,46.933-26.667,73.6C151.034,452.267,184.1,489.6,221.434,504.533z"
              />
            </svg>
            4.7
          </div>
          <p className="home__text">A new addition to the weekly roster!</p>
        </div>
      </div>
    </section>

    <section className="popular">
      <div className="popular__wrapper">
        <header className="popular__header">
          <h3 className="popular__heading">Popular Foods</h3>
          <p className="popular__text">explore a variety of food recpies</p>
        </header>

        <div className="popular__catalog">
          <div className="">
            <img className="popular__image" src={Plate1} alt="Plate of food" />
          </div>
          <div className="">
            <img className="popular__image" src={Plate2} alt="Plate of food" />
          </div>
          <div className="">
            <img className="popular__image" src={Plate3} alt="Plate of food" />
          </div>
          <div className="">
            <img className="popular__image" src={Plate4} alt="Plate of food" />
          </div>
          <div className="">
            <img className="popular__image" src={Plate5} alt="Plate of food" />
          </div>
          <div className="">
            <img className="popular__image" src={Plate6} alt="Plate of food" />
          </div>
          <div className="">
            <img className="popular__image" src={Plate7} alt="Plate of food" />
          </div>
          <div className="">
            <img className="popular__image" src={Plate8} alt="Plate of food" />
          </div>
          <div className="">
            <img className="popular__image" src={Plate9} alt="Plate of food" />
          </div>
        </div>
      </div>
    </section>

    <NewsLetter />
  </>
);

export default HomePage;
