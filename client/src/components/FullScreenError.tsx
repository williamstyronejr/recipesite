import * as React from 'react';

const FullScreenError = ({ error }: { error: Error }) => (
  <div className="page-error">{error.message}</div>
);

export default FullScreenError;
