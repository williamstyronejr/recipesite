import * as React from 'react';
import './styles/fullScreenLoading.css';

const FullScreenLoading: React.FC<{ message?: string }> = ({ message }) => (
  <div className="loader">
    <div className="loader__wrapper">
      <div className="loader__loading" />
      <div className="loader__container">
        <div className="loader__pan" />
        <div className="loader__handle" />
      </div>

      <div className="loader__message">{message}</div>
    </div>
  </div>
);

FullScreenLoading.defaultProps = {
  message: 'Loading',
};

export default FullScreenLoading;
