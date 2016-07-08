require('styles/shopcar.less');
import React from 'react';
import $ from 'webpack-zepto';
import app from '../../lib/app';
import dataService from '../../common/dataService';
import ChangeTitle from '../../common/ChangeTitle';
let noCartListImage = require('../../images/noAdd.png');

class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cartListData: {},
      translateX : 0
    }
  }
  //获取购物车信息
  getCartList(){
    var _this = this;
    app.needLogin(function (headers, url) {
      var param = {};
      dataService.getJSONByGet(url, param,
        function (data) {
          _this.setState({cartListData: data});
        },
        function (err, xhr) {
        },headers
      );
    },'/cart/list.do');
  }

  handleRadioChange(event){
    this.stopPropagationAndPreventDefault(event);
    var values = event.currentTarget.value.split(',');
    var _this = this;
    app.needLogin(function (headers, url) {
      var param = {pid: values[0], checked: (values[1]=='true'?'false':'true')};
      dataService.getJSON(url, param,
        function (data) {
          _this.setState({cartListData: data});
        },
        function (err, xhr) {
        },headers
      );
    },'/cart/checkItem.do');
  }
  //全选按钮
  handleRadioCheckAllChange(event){
    this.stopPropagationAndPreventDefault(event);
    var _this = this,
        checkAll = this.refs.checkAllRef.value;
    app.needLogin(function (headers, url) {
      var param = {checked: (checkAll=='true'?'false':'true')};
      dataService.getJSON(url, param,
        function (data) {
          _this.setState({cartListData: data});
        },
        function (err, xhr) {
        },headers
      );
    },'/cart/checkAll.do');
  }
  handleDecrease(event){
    this.stopPropagationAndPreventDefault(event);
    var _this = this,
        pid = event.currentTarget.value,
        value = this.refs['input_num'+pid].value;
    app.needLogin(function (headers, url) {
      var param = {num: --value, pid: pid};
      dataService.getJSON(url, param,
        function (data) {
          _this.setState({cartListData: data});
        },
        function (err, xhr) {
        },headers
      );
    },'/cart/change.do');
  }
  handleIncrease(event){
    this.stopPropagationAndPreventDefault(event);
    var _this = this,
        pid = event.currentTarget.value,
        value = this.refs['input_num'+pid].value;
    app.needLogin(function (headers, url) {
      var param = {num: ++value, pid: pid};
      dataService.getJSON(url, param,
        function (data) {
          _this.setState({cartListData: data});
        },
        function (err, xhr) {
        },headers
      );
    },'/cart/change.do');
  }
  handleDelete(event){
    this.stopPropagationAndPreventDefault(event);
    var _this = this,
        pid = event.currentTarget.value;
    app.needLogin(function (headers, url) {
      var param = { pid: pid};
      dataService.getJSON(url, param,
        function (data) {
          _this.setState({cartListData: data});
        },
        function (err, xhr) {
        },headers
      );
    },'/cart/remove.do');
  }
  handleSubmit(event){
    window.location.href='/action/pay/order.html?fromCart=true';
  }
  //滑动删除事件
  slideDeleteEvent(){
    function prevent_default(e) {
        e.preventDefault();
    }

    function disable_scroll() {
        $(document).on('touchmove', prevent_default);
    }

    function enable_scroll() {
        $(document).off('touchmove', prevent_default);
    }
    var x, y;
    $(document).on('touchstart', function(e) {
        $('.shopcar-product-wrap').css({
          'transform': 'translate(0px,0px)',
          '-webkit-transform': 'translate(0px,0px)',
          'transition': 'all .3s linear 0s',
          '-webkit-transition': 'all .3s linear 0s'
        });
    });
    $(document)
        .on('touchstart', '.shopcar-product-wrap', function(e) {
            //$('.shopcar-product-wrap').css({'transform': 'translate(0px,0px)','-webkit-transform': 'translate(0px,0px)'}); // close em all
            x = e.changedTouches[0].pageX; // anchor point
            y = e.changedTouches[0].pageY;
        })
        .on('touchmove', '.shopcar-product-wrap', function(e) {
            var changeX = e.changedTouches[0].pageX - x;
            var changeY = e.changedTouches[0].pageY - y;
            if(Math.abs(changeY)>40){
              return false;
            }
            if(Math.abs(changeX)>20){
							e.preventDefault();
							e.stopPropagation();
						}
        })
        .on('touchend', '.shopcar-product-wrap', function(e) {
            var change = e.changedTouches[0].pageX - x;
            var new_left;
            if (change < -20) {
                new_left = '-70';
            } else {
                new_left = '0';
            }
            // e.currentTarget.style.left = new_left
            $(this).css({
              'transform': 'translate('+new_left+'px,0px)',
              '-webkit-transform': 'translate('+new_left+'px,0px)',
            });
            //enable_scroll()
        });


  }

  //阻止冒泡
  stopPropagationAndPreventDefault(e){
    e.stopPropagation();
    e.preventDefault();
  }
  componentDidMount(){
    this.getCartList();
    this.slideDeleteEvent();
    //setTimeout(this.slideDeleteEvent,2000);
    ChangeTitle.changeTitle('购物车');

  }
  render() {
    var cartList = this.state.cartListData, _this = this,
        cartListJsx = '', checkAll=true;
    if(cartList.data&&cartList.data.items&&cartList.data.items.length>0){
      cartListJsx = cartList.data.items.map(function(item){
        if(item.checked==false||item.checked=='false'){
          checkAll=false;
        }
        return (
          <a className="shopcar-product-wrap" href={"/action/shop/product.html?id="+item.id}>
            <div className="shopcar-product">
              <ul className="mod-list">
                <li className="mod-list-item">
                  <div className="product-info mod-list-info">
                      <div className="checkbox-group product-check">
                        <input type="checkbox" name="checkbox-product" value={item.id+','+item.checked}
                          checked={item.checked}
                          onChange={_this.handleRadioChange.bind(_this)}
                          />
                        <span className="indicator" style={{position: 'initial', paddingTop: '7px'}}></span>
                      </div>
                    <div className="product-image">
                      <img src={item.img} alt="" />
                    </div>
                    <h3 className="product-title">{item.cn_name}</h3>
                    <div className="product-ds">{item.en_name}</div>
                    <div className="product-meta">
                      <span className="product-type">类型：{item.volume}ml</span>
                      <b className="product-sale">{item.sale_price}元</b>
                    </div>
                    <div className="number-box">
                      <form onsubmit="return false;">
                        <button className="btn-decrease btn"
                          type="button"
                          disabled={item.product_number<=1?'disabled':''}
                          value={item.id}
                          onClick={_this.handleDecrease.bind(_this)}>-</button>
                        <span className="input-num productNum btn"
                          value={item.product_number}
                          ref={"input_num"+item.id}>
                        {item.product_number}
                        </span>
                        <button className="btn-increase btn"
                          type="submit"
                          disabled={item.product_number>=item.quantity?'disabled':''}
                          value={item.id}
                          onClick={_this.handleIncrease.bind(_this)}>+</button>
                      </form>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="deleteBtn" value={item.id} onClick={_this.handleDelete.bind(_this)}>删除</div>
          </a>
        );
      });
      return(
        <div className="shopcar-content shopcar">
          {cartListJsx}
          <div className="mod-footbar">
            <div className="submit-bar mod-flex com-align-middle">
              <div className="pay mod-flex-item">
                <div className="checkbox-group product-allCheck"
                  onClick={this.handleRadioCheckAllChange.bind(this)}>
                  <input type="checkbox"
                        name="checkbox-product"
                        value={checkAll}
                        checked={checkAll}
                        ref="checkAllRef"
                        />
                      <span className="indicator" style={{position: 'initial', padding: '7px 0 0 7px'}}></span>
                </div>
                <span className="pay-text">
                  共计：<b className="pay-price">{cartList.data.money?cartList.data.money:'0元'}</b>
                  <small className="pay-note">不含运费</small>
                </span>
              </div>
              <div className="operate mod-flex-item">
                <button className="btn btn-primary btn-large"
                  disabled={cartList.data.number==0?'disabled':''}
                  id="submit" type="submit"
                  onClick={this.handleSubmit.bind(this)}>
                  {cartList.data.number>0?('结算('+cartList.data.number+')'):'结算'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }else{
      return (
        <div style={{position:'fixed', top:'50%', left:'50%', margin: '-104px 0 0 -126px'}}><img src={noCartListImage} width="252" alt="" /></div>
      );
    }
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
