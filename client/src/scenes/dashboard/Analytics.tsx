import * as React from 'react';
import './styles/analytics.css';

const AnalyticsPage = () => (
  <section className="analytics">
    <header className="analytics__header" />

    <div className="analytics__summary">
      <div className="analytics__controls" />
    </div>

    <div className="analytics__location">
      <h4 className="analytics__subheading">Where did my views come form?</h4>
      <div className="analytics__group">
        <h5 className="analytics__">Reshipi Bukku</h5>
        <div className="analytics__views">0 views</div>
      </div>

      <div className="analytics__group">
        <h5 className="analyltics__group-heading">External</h5>
        <div className="analytics__views">0 views</div>
      </div>
    </div>
  </section>
);

export default AnalyticsPage;
