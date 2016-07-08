require('styles/order.less');
require('styles/baseaddr.css');
require('styles/address2.less');
require('styles/header.css');
import React from 'react';
import app from '../../lib/app';
import dataService from '../../common/dataService';
import ChangeTitle from '../../common/ChangeTitle';
import MyInput from '../public/Input';
import MySelect from '../public/Select';
import $ from 'webpack-zepto';
import Tipsy from '../public/Tipsy';

var timer ;
class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: app.query('address'),
       "user_id":0,
       "province_id":1,
       "city_id":0,
       "town_id":0,
       "area_id":72,
       "address":"",
       "is_default":0,
       "username":"",
       "mobile":"",
       "zipcode":"",
       "ctime":0,
       "uptime":0,
       "status":0,
       "error":"",
       "canSubmit":true,
       "canDelete":true
    };
  }

  getAddressInfo(){
    var _this = this;
    app.needLogin(function (headers, url) {
      var param = {
        id: this.state.id
      };
      dataService.getJSON(url, param,
        function (data) {
          //this.setAddressForm(data.addr);
          if(data&&data.addr!=null&&typeof(data.addr)!='undefined'){
            var addr = data.addr;
            this.setState({
              "id": addr.id,
              "user_id":addr.user_id,
              "province_id":addr.province_id,
              "city_id":addr.city_id,
              "town_id":addr.town_id,
              "area_id":addr.area_id,
              "address":addr.address,
              "is_default":addr.is_default,
              "username":addr.username,
              "mobile":addr.mobile,
              "zipcode":addr.zipcode,
              "ctime":addr.ctime,
              "uptime":addr.uptime,
              "status":addr.status
            });
            this.getProvinceInfo();
          }
        }.bind(this),
        function (err, xhr) {
        }.bind(this),headers
      );
    }.bind(this),'/address/toModify.do');
  }


  handleUserProvSelect(provSelectedValue) {
    this.setState({
      province_id: provSelectedValue,
      city_id: provSelectedValue,
      area_id: 0
    });
    setTimeout(function(){
      this.getCityInfo();
    }.bind(this),0);
  }
  handleUserCitySelect(citySelectedValue) {
    this.setState({
      city_id: citySelectedValue,
      area_id: 0
    });
    setTimeout(function(){
      this.getAreaInfo();
    }.bind(this),0);
  }
  handleUserDistSelect(distSelectedValue) {
    this.setState({
      area_id: distSelectedValue
    });
  }
  //查询province信息
  getProvinceInfo(){
    var _this = this;
    require.ensure([], () => {
      var Datas = require('../../lib/area.js').default;
      var provinceData = new Array();
      for(let item in Datas[0].v){
        var tempJson = {name: Datas[0].v[item].k, id: item};
        provinceData.push(tempJson);
      }
      _this.setState({provinceData: provinceData});
      setTimeout(function(){
        _this.getCityInfo();
      },0);
    },'area');

  }
  //查询city信息
  getCityInfo(){
    var _this = this;
    require.ensure([], () => {
      var Datas = require('../../lib/area.js').default;
      var idprovince = _this.state.province_id;
      var cityData = new Array();
      for(let item in Datas[0].v[idprovince].v){
        var tempJson = {name: Datas[0].v[idprovince].v[item].k, id: item};
        cityData.push(tempJson);
      }
      _this.setState({cityData: cityData, city_id: cityData[0].id});
      setTimeout(function(){
        _this.getAreaInfo();
      },0);
    },'area');

  }
  //查询area信息
  getAreaInfo(){
    var _this = this;
    require.ensure([], () => {
      var Datas = require('../../lib/area.js').default;
      var idprovince = _this.state.province_id;
      var idcity = _this.state.city_id;
      var areaData = new Array();
      for(let item in Datas[0].v[idprovince].v[idcity].v){
        var tempJson = {name: Datas[0].v[idprovince].v[idcity].v[item], id: item};
        areaData.push(tempJson);
      }
      _this.setState({areaData: areaData, area_id: areaData[0].id});
    },'area');
  }

  submitForm(){
    if(this.state.canSubmit){
      this.setState({"canSubmit": false});
      if(this.validateInput(this.state.username,'username')&&
          this.validateInput(this.state.mobile,'mobile')&&
          this.validateInput(this.state.zipcode,'zipcode')&&
          this.validateTextarea(this.state.address)){
        app.needLogin(function (headers, url) {
          var param = {
          		"id": this.state.id,
          		"username": this.state.username,
          		"mobile": this.state.mobile,
          		"zipcode": this.state.zipcode,
          		"province_id": $("#province_id").val(),
          		"city_id": $("#city_id").val(),
          		"area_id": $("#area_id").val(),
          		"address": this.state.address,
              "is_default": this.state.is_default,
          	};
          dataService.getJSON(url, param,
            function (data) {
              this.setState({"canSubmit": true});
              window.history.go(-1);
            }.bind(this),
            function (err, xhr) {
              this.setState({"canSubmit": true});
            }.bind(this),headers
          );
        }.bind(this),'/address/save.do');
      }else {
        this.setState({"canSubmit": true});
      }
    }
  }
  deleteAddr(){
    if(this.state.canDelete){
      this.setState({"canDelete": false});
      app.needLogin(function (headers, url) {
        var param = {
        		"id": this.state.id
        	};
        dataService.getJSON(url, param,
          function (data) {
            this.setState({"canDelete": true});
            window.history.go(-1);
          }.bind(this),
          function (err, xhr) {
            this.setState({"canDelete": true});
          }.bind(this),headers
        );
      }.bind(this),'/address/delete.do');
    }
  }
  componentWillMount(){
    if(this.state.id){
      this.getAddressInfo();
    }else {
      this.getProvinceInfo();
    }
  }
  componentDidMount(){
    ChangeTitle.changeTitle('新增地址');
  }

  handlInputChange(value,nameType){
    switch(nameType){
      case 'username':
        this.setState({username: value});
        break;
      case 'mobile':
        this.setState({mobile: value.replace(/-/g,'')});
         break;
      case 'zipcode':
        this.setState({zipcode: value});
        break;
      default:
       break;
    }
  }
  addressChange(event) {
    this.setState({address: event.currentTarget.value});
  }
  isDefaultChange(event) {
    this.setState({is_default: event.currentTarget.value==1?0:1});
  }
  validateTextarea(event) {
    clearTimeout(timer);
    var value = event.currentTarget?event.currentTarget.value : event;
    if(value.trim()==''){
      this.setState({error: '详细地址不能为空'});
      timer = setTimeout(function(){
        this.setState({error: ''});
      }.bind(this),2000);
      return false;
    }else{
      return true;
    }
  }
  validateInput (value, nameType){
    var error = '';
    var value = value.trim();
    if(!value){ //没输入账号
      switch(nameType){
        case 'username':
          error = '收货人不能为空';
          break;
        case 'mobile':
          error = '手机号不能为空';
          break;
        default:
          break;
      }
    }else{                          //有输入
      switch(nameType){
        case 'username':
          error = '';
          break;
        case 'mobile':
          error = !/^1(\d){10}$/.test(value)
                ? '请输入正确的手机号' : '';
           break;
        case 'zipcode':
          error = !/^\d{6}$/gi.test(value)
               ? '邮编填写错误' : '';
          break;
        default:
         break;
      }
    }
    this.setState({error: error});
    clearTimeout(timer);
    timer = setTimeout(function(){
      this.setState({error: ''});
    }.bind(this),2000);
    return !error;
  }

  render() {

    return(
      <div className="mod-page address2 order" id="tmpl_content">
          <Tipsy content={this.state.error}></Tipsy>
          <div className="new-ct">
            <div className="new-addr">
              <div className="new-info-box">
                <div className="new-set-info">
                  <MyInput
                    placeholder="收货人姓名"
                    type="text"
                    name="username"
                    ref="address_name"
                    maxLength='25'
                    className="new-input"
                    isRequired="true"
                    inputChange={this.handlInputChange.bind(this)}
                    inputBlur={this.validateInput.bind(this)}
                    value={this.state.username}
                    />
                  <MyInput
                    placeholder="手机号"
                    type="tel"
                    name="mobile"
                    ref="address_mobile"
                    className="new-input"
                    isRequired="true"
                    inputChange={this.handlInputChange.bind(this)}
                    inputBlur={this.validateInput.bind(this)}
                    value={this.state.mobile}/>
                  <MyInput
                    placeholder="邮编（选填）"
                    type="tel"
                    name="zipcode"
                    ref="address_zip"
                    maxLength='6'
                    className="new-input"
                    isRequired="false"
                    inputChange={this.handlInputChange.bind(this)}
                    inputBlur={this.validateInput.bind(this)}
                    value={this.state.zipcode}/>
                </div>
                <div className="new-ship-addr">
                  <MySelect name="province_id"
                    id="province_id"
                    className="new-select"
                    options={this.state.provinceData}
                    onUserSelect={this.handleUserProvSelect.bind(this)}
                    initSelectedValue={this.state.province_id}/>
                  <MySelect name="city_id"
                    className="new-select"
                    id="city_id"
                    options={this.state.cityData}
                    onUserSelect={this.handleUserCitySelect.bind(this)}
                    initSelectedValue={this.state.city_id}/>
                  <MySelect name="area_id"
                    id="area_id"
                    className="new-select"
                    options={this.state.areaData}
                    onUserSelect={this.handleUserDistSelect.bind(this)}
                    initSelectedValue={this.state.area_id}/>

                  <div className="new-mg-t10">
                    <span className="new-tbl-type new-mg-b10">
                      <span className="new-tbl-cell">
                        <div className="new-post_wr">
                          <textarea
                            placeholder="详细地址"
                            name="address"
                            ref="address_where"
                            rows={5}
                            cols={30}
                            maxLength='70'
                            className="new-textarea"
                            onChange={this.addressChange.bind(this)}
                            onBlur={this.validateTextarea.bind(this)}
                            value={this.state.address}></textarea>
                        </div>
                        <span className="new-txt-err" id="where_error" />
                      </span>
                    </span>
                  </div>
                </div>
                <div>
                  <div className="form-item">
                    <label className="checkbox-group flip">
                      <input
                        ref="isDefault"
                        type="checkbox"
                        name="default"
                        checked={this.state.is_default==1}
                        value={this.state.is_default}
                        onChange={this.isDefaultChange.bind(this)}/>
                      <span className="indicator">设为默认地址</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a
            href="javascript:;"
            className="operate"
            id="address_submit" onClick={this.submitForm.bind(this)}>保存</a>
          <a
            href="javascript:;"
            id="address_delete"
            className="new-abtn-type new-mg-t15" style={{display:this.state.id!=''?'block':'none'}} onClick={this.deleteAddr.bind(this)}>删除此地址</a>
        </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
