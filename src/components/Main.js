import React from 'react';
import { Link } from 'react-router';


class AppComponent extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>

   );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
