// Credit to react-router website

import React from 'react';
import { withRouter } from 'react-router-dom';

class ScrollToTopOfPage extends React.Component {
  
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

export const ScrollToTop = withRouter(ScrollToTopOfPage);