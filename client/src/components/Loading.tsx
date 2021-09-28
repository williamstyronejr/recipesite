import * as React from 'react';
import './styles/loading.css';

const Loading = () => (
  <div className="loader loader--inpage">
    <div className="loader__wrapper">
      <div className="loader__loading" />
      <div className="loader__container">
        <div className="loader__pan" />
        <div className="loader__handle" />
      </div>
    </div>
  </div>
);

export default Loading;
