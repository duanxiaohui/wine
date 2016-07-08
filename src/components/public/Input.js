import React from 'react';

class MyInput extends React.Component {

  // setValue() will set the value of the component, which in
  // turn will validate it and the rest of the form
  constructor(props) {
    super(props);
    this.state = {
      _value: this.props.value,
      _isRequired: this.props.isRequired
    };
  }
  changeValue(event) {
    var value = event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value'];
    this.props.inputChange(value, this.props.name);
  }
  blurValue(event) {
    var value = event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value'];
    this.props.inputBlur(value, this.props.name);
  }
  getValue () {
    return this.state._value;
  }

  render() {
    // An error message is returned ONLY if the component is invalid
    // or the server has returned an error message
    return (
      <span className="new-span-block new-mg-b10">
        <span className="new-input-span">
          <input
            placeholder={this.props.placeholder}
            type={this.props.type || 'text'}
            name={this.props.name}
            id={this.props.id}
            className={this.props.className}
            onChange={this.changeValue.bind(this)}
            onBlur={this.blurValue.bind(this)}
            maxLength={this.props.maxLength}
            checked={this.props.type === 'checkbox' && this.getValue() ? 'checked' : null}
            value={this.props.value} />
        </span>
      </span>
    );
  }
}

export default MyInput;
