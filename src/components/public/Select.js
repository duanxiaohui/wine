import React from 'react';

class MySelect extends React.Component {

  // setValue() will set the value of the component, which in
  // turn will validate it and the rest of the form
  constructor(props) {
    super(props);
  }
  changeValue() {
    this.props.onUserSelect(this.refs.addrSelect.value);
  }
  render() {

    var options, selectedValue={}, _this=this;
    if (this.props.options && this.props.options.length > 0) {
      // console.log(_this.refs.addrSelect.value,"sdkjfsldjfsdlfj");
      options = this.props.options.map(function(option, i){
        if(_this.props.initSelectedValue==option.id){
          selectedValue.id = option.id;
          selectedValue.name = option.name;
        }
        return (
          <option value={option.id} key={option.id}>
            {option.name}
          </option>
        );
      });
    }else {
      options = '';
    }
    return (
      <div className="new-mg-t10">
        <span className="new-tbl-type new-mg-b10">
          <span className="new-tbl-cell">
            <span className="new-input-span new-mg-b10">
              <span className="new-sel-box new-p-re">
                <div id={selectedValue.id}>{selectedValue.name}</div>
                <span />
                <select name={this.props.name}
                  id={this.props.id}
                  className={this.props.className}
                  value={this.props.initSelectedValue}
                  onChange={this.changeValue.bind(this)}
                  ref="addrSelect">
                  {options}
                </select>
              </span>
            </span>
          </span>
        </span>
      </div>
    );
  }
}

export default MySelect;
