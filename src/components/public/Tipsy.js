import React from 'react';

class Tipsy extends React.Component {

  // setValue() will set the value of the component, which in
  // turn will validate it and the rest of the form
  constructor(props) {
    super(props);
    this.state = {

    };
  }


  render() {
    // An error message is returned ONLY if the component is invalid
    // or the server has returned an error message
    return (
      <div className="tipsy" calue={this.props.content} style={{display:this.props.content!=''?'block':'none'}}>{this.props.content}</div>
    );
  }
}

export default Tipsy;
