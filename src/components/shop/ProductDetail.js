require('styles/detail.less');
require('styles/swiper.min.css');
import React from 'react';
import $ from 'webpack-zepto';
import Swiper from 'swiper';
import dataService from '../../common/dataService';
import app from '../../lib/app';
//import Swiper from '../../lib/swiper.min';

//let yeomanImage = require('../images/yeoman.png');
var id = app.query('id');
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailExtraData: {},
      detailData: {
      	"productImage": [],
      	"package": [],
      	"provider": {"id": "","name": "","en_name": "","info": null,"country": "","ctime": 0,"uptime": 0,"status": false},
      	"state": "ok",
      	"itemInfo": {
      		"id": "",
      		"sku": "",
      		"brand_id": "",
      		"en_name": "",
      		"cn_name": "",
      		"sale_price": "",
      		"price": "",
      		"provider_id": "",
      		"quantity": "",
      		"package_id": "",
      		"year": "",
      		"volume": "",
      		"country": "",
      		"origin": "",
      		"type_cn": "",
      		"taste": "",
      		"color": "",
      		"smells": "",
      		"alcohol": "",
      		"sell_type": "",
      		"notify": "",
      		"cat1": "",
      		"cat2": "",
      		"cat3": "",
      		"cat1_id": "",
      		"cat2_id": "",
      		"cat3_id": "",
      		"grade_id": "",
      		"product_id": "",
      		"limit_number": "",
      		"limit_start_time": "",
      		"ctime": "",
      		"grade": ""
      	},
      	"loveNum": "",
      	"isCollected": "",
      	"hasArrivalNotice": "",
      	"canBuyNum": ""
      }
    }
  }

  getDetail(){
    var [_this, url, param] = [this, '/product/detail.do', {id: id}];
    dataService.getJSON(url, param,
      function (data) {
        _this.setState({detailData: data});
        _this.initSwiper();
      },
      function (err, xhr) {
      }
    );
    var [url1, param1] = ['/product/detailExtraInfo.do', {id: id}];
    dataService.getJSON(url1, param1,
      function (data) {
        _this.setState({detailExtraData: data});
      },
      function (err, xhr) {
      }
    );
  }
  initSwiper(){
    new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        lazyLoading : true,
        paginationBulletRender: function (index, className) {
            return '<span class="' + className + '"></span>';
        },
        loop: true,
        speed: 500,
        spaceBetween: 5
    });
  }
  //购买按钮
  getBtn(){
    var itemInfo = this.state.detailData.itemInfo, btn = {btn1:'',btn2:''};
    if(itemInfo.quantity > 0 && itemInfo.sell_type == 2){
      btn.btn2 = (
        <div className="mod-flex-item" style={{margin: '0 5px'}}>
          <button className="btn btn-primary btn-large bridge" id="buy" type="button">
            立即购买
          </button>
        </div>
      )
    }
    if(itemInfo.quantity > 0 && itemInfo.sell_type == 0){
      if(app.coco){
        btn.btn1 = (
          <div className="mod-flex-item">
            <button className="btn btn-default btn-large bridge" id="addToCart" type="button">
              加入购物车
            </button>
          </div>
        )
      }
      btn.btn2 = (
        <div className="mod-flex-item" style={{margin: '0 5px'}}>
          <button className="btn btn-primary btn-large bridge" id="buy" type="button">
            立即购买
          </button>
        </div>
      )
    }

    if(itemInfo.quantity > 0 && itemInfo.sell_type == 1){
      btn.btn1 = (
        <div className="mod-flex-item">
          <button className="btn btn-text btn-large" type="button" disabled>
            3个月后发货
          </button>
        </div>
        )
      btn.btn2 = (
        <div className="mod-flex-item">
          <button className="btn btn-primary btn-large bridge" id="buy" data-buyType="pre" type="button">
            立即预约
          </button>
        </div>
      )
    }

    if(itemInfo.quantity <= 0 && itemInfo.sell_type == 1){
      btn.btn1 = (
        <div className="mod-flex-item">
          <button className="btn btn-text btn-large" type="button" disabled>
            3个月后发货
          </button>
        </div>
      )
      btn.btn2 = (
        <div className="mod-flex-item">
          <button className="btn btn-primary btn-large" type="button" disabled>
            已无名额
          </button>
        </div>
      )
    }

    if(itemInfo.quantity <= 0 && itemInfo.sell_type == 0 && itemInfo.notify == true){
      btn.btn1 = (
        <div className="mod-flex-item">
          <button className="btn btn-text btn-large" type="button" disabled>
            本商品已售完
          </button>
        </div>
      )
      btn.btn2 = (
        <div className="mod-flex-item">
          this.state.detailData.hasArrivalNotice ?
            (<button className="btn btn-primary btn-large hasArrivalNotice" id="notice" type="button">已添加到货通知</button>)
              : (<button className="btn btn-primary btn-large" id="notice" type="button">到货通知</button>)
        </div>
      )
    }

    if(itemInfo.notify == false){
      btn.btn1 = (
        <div className="mod-flex-item">
          <button className="btn btn-text btn-large btn-right" type="button" disabled>
            本商品已售罄
          </button>
        </div>
      )
    }
    return btn;
  }
  componentDidMount(){
    this.getDetail();
  }
  render() {
    var imgList = '', agencyMarks = '', marks = '', extra = '',
        youMayLike = '', packageJsx = '', canBuyNumMin = '',
        productImage = this.state.detailData.productImage,
        itemInfo = this.state.detailData.itemInfo,
        provider = this.state.detailData.provider,
        detailExtraData = this.state.detailExtraData,
        packageObj = this.state.detailData.package,
        canBuyNum = this.state.detailData.canBuyNum;
    //轮播图
    if(productImage && productImage.length > 0){
      imgList = productImage.map((item) =>
        (
          <li className="list-item swiper-slide swiper-slide-active" style={{'transitionProperty': 'transform', 'minHeight': '250px', 'transitionTimingFunction': 'cubicBezier(0, 0, 0.25, 1)', 'transitionDuration': '300ms', 'transform': 'translate3d(0px, 0px, 0px)'}}>
            <a href="javascript:;">
              <img className="swiper-lazy" style={{'transition': 'all 0ms ease', 'transform': 'translate3d(0px, 0px, 0px)'}} data-src={item.img} />
              <div className="swiper-lazy-preloader"></div>
            </a>
          </li>
        )
      );
    }
    //类别选择
    if(packageObj&&packageObj.length){
      packageJsx = (
        <dl className="selection-dlist type-group">
          <dt>类别选择</dt>
          <dd>
            <div className="tag-box" id="unionProducts">
              <label className={"tag-option "+packageObj.id==itemInfo.id?'active':''}
                  data-info={packageObj}
                  data-price={packageObj.sale_price}>{packageObj.package_caption||packageObj.volume}</label>
            </div>
          </dd>
      </dl>
      )
    }else{
      packageJsx = (
        <dl className="selection-dlist type-group">
          <dt>类别选择</dt>
          <dd>
              <div className="tag-box" id="unionProducts">
                  <label className="tag-option active" data-info={JSON.stringify({
                      "id":itemInfo.id,
                      "volume":itemInfo.volume,
                      "package_caption":itemInfo.package_caption,
                      "quantity":itemInfo.quantity,
                      "price":itemInfo.price,
                      "sale_price":itemInfo.sale_price
                  })} data-price={itemInfo.sale_price}>{itemInfo.package_caption || itemInfo.volume}</label>
              </div>
          </dd>
      </dl>
      )
    }

    if(!$.isEmptyObject(detailExtraData)){
      //机构评分
      if(detailExtraData.agencyMarks&&detailExtraData.agencyMarks.length > 0){
        var tempAgencyMarks = detailExtraData.agencyMarks.map((item) =>
          (
            <div className="institution-item">
              <i className="icon-agencyMarks icon-mark"><img src={item.icon} alt=""/></i>
              <span className={"score-value "+(item.type==2?"black":"")}>{item.en_abbreviation} 评分：{item.mark}</span>
            </div>
          )
        );
        agencyMarks = (
          <div className="product-column institution-score">
            <div className="column-head">
              <h3 className="column-title"><b>机构评分</b></h3>
              <p className="column-ds">Rating agencies</p>
            </div>
            <div className="column-body">
              {tempAgencyMarks}
            </div>
          </div>
        );
      }
      //达人评价
      if(detailExtraData.marks&&detailExtraData.marks.length > 0){
        var tempMarks = detailExtraData.marks.map((item) =>
          (
            <div className="expert-item">
              <div className="expert-info">
                <img src={item.face} alt="" className="expert-avatar" />
                <h4 className="expert-name">{item.user_name}</h4>
                <div className="expert-position">{item.user_desc}</div>
                <div className="expert-value"><i className="icon icon-goblet"></i>评分：{item.mark}分</div>
              </div>
              <cite className="expert-estimation">{item.info}</cite>
            </div>
          )
        );
        marks = (
          <div className="product-column expert-score">
            <div className="column-head">
              <h3 className="column-title"><b>达人评价</b></h3>
              <p className="column-ds">Score of people</p>
            </div>
            <div className="column-body">
              {tempMarks}
            </div>
          </div>
        );
      }
      // 故事，如何饮酒，配餐建议
      extra = detailExtraData.extra.map(function(item){
        var extraTemp = item.info.replace(/\[img\]/gi, '<div class="mod-image"><img src="')
         .replace(/\[\/img\]/gi, '" alt=""></div>')
         .replace(/\[text\]/gi, '<div class="mod-text">')
         .replace(/\[\/text\]/gi, '</div>');
        return (
        <div className={"product-column "+item.module_name}>
           <div className="column-head">
               <h3 className="column-title"><b>{item.title}</b></h3>
               <p className="column-ds">{item.sub_title}</p>
           </div>
           <div className="column-body" dangerouslySetInnerHTML={{__html: extraTemp}}>
           </div>
       </div>);
      });

      //你可能喜欢
      youMayLike = detailExtraData.youMayLike.map(function(item){
        return (
          <li className="mod-list-item">
            <div className="product-image">
              <a data-href={"/dist/index.html#/productDetail?id="+item.id} className="mod-list-info product-info">
                {item.sell_type==1?(<label className="tag-preorder">预</label>)
                  :item.sell_type==2?(<label className="tag-purchase">限</label>):''}
                <img src={item.img}
                   onerror="this.src=\'images/temp/l1.jpg\';this.onerror=null" alt="" />
              </a>
            </div>
            <a data-href={"/dist/index.html#/productDetail?id="+item.id} className="mod-list-info product-info">
              <h3 className="product-title">{item.cn_name}</h3>
              <p className="product-ds">{item.en_name}</p>
              <div className="product-meta">
                <b className="product-sale">￥{item.sale_price}</b>
                {item.price?(<span className="product-price">￥{item.price}</span>):''}
                {item.quantity&&item.quantity<=3?(<label className="tag-primary">库存紧张</label>):''}
              </div>
            </a>
          </li>
        );
      });
    }


    return (
      <div className="productDetail">
      <div className="mod-page" id="tmpl_content">
      	<div className="mod-content detail mod-footbar-show">
          <section className="mod-slider swiper-container">
            <ul className="mod-slider-list swiper-wrapper">
              {imgList}
            </ul>
            <div className="mod-slider-index swiper-pagination"></div>
          </section>
      		<section className="mod-column product">
      			<div className="product-content">
      				<h1 className="product-title">{itemInfo.cn_name}</h1>
      				<p className="product-ds">{itemInfo.en_name}</p>
      				<div className="product-meta">
      					<b className="product-sale">￥{itemInfo.sale_price}</b>
                {itemInfo.price?(<span className="product-price">￥{itemInfo.price}</span>):''}
                {itemInfo.quantity&&itemInfo.quantity<=3?(<label className="tag-primary">库存紧张</label>):''}
                <label className="tag-favrite-sm">{this.state.detailData.loveNum}</label>
      				</div>
              <div className="product-meta">
      					<label className="tag-border">不支持退换货</label>
                {itemInfo.sell_type==2?(<label className="tag-border">限购</label>):''}
      				</div>
      			</div>
      			<ul className="product-option">
              <li><b>酒庄：</b>{provider.name}（{provider.en_name}）</li>
              {itemInfo.grade?(<li><b>级别：</b>{itemInfo.grade}</li>):''}
              <li><b>国家：</b>{itemInfo.country}</li>
      				<li><b>产地：</b>{itemInfo.origin}</li>
              <li><b>葡萄品种：</b>{itemInfo.cat1} {itemInfo.cat2} {itemInfo.cat3}</li>
              <li><b>颜色：</b>{itemInfo.color}</li>
              <li><b>香气：</b>{itemInfo.smells}</li>
              <li><b>口感：</b>{itemInfo.taste}</li>
              <li><b>年份：</b>{itemInfo.year}</li>
              <li><b>容量：</b>{itemInfo.volume}ml</li>
              <li><b>类型：</b>{itemInfo.type_cn}</li>
      				{itemInfo.alcohol?(<li><b>酒精度：</b>{itemInfo.alcohol}</li>):''}
      			</ul>
      			<div className="other">
              {agencyMarks}
              {marks}
              {extra}

      				<div className="product-column reminder">
      					<div className="column-head">
      						<h3 className="column-title"><b>温馨提示</b></h3>
      						<p className="column-ds">kindly reminder</p>
      					</div>
      					<div className="column-body">
      						<ul className="mod-list">
      							<li className="mod-list-item">不支持退款</li>
      							<li className="mod-list-item">如需开具发票，请在订单确认时填写清楚</li>
      							<li className="mod-list-item">统一顺丰快递配送，如有特殊需求请在备注中填写</li>
      						</ul>
      					</div>
      				</div>
              <div className="product-column recommend guessyoulike">
      					<div className="column-head">
      						<h3 className="column-title"><b>猜你喜欢</b></h3>
      						<p className="column-ds">Guess you like</p>
      					</div>
      					<div className="column-body">
      						<ul className="mod-list">
      							{youMayLike}
      						</ul>
      					</div>
      				</div>
            </div>
            <div className="product-column selection" id="productUnion" data-id={itemInfo.id}>
              <div className="column-body">
                <div className="selection-head mod-flex com-align-middle">
                  <div className="product-meta">
                    <b className="product-sale" id="package_price">￥{itemInfo.sale_price}</b>{itemInfo.quantity1}{itemInfo.limit_number}
                  </div>
                </div>
                <div className="selection-group">
                  {packageJsx}
                  <dl className="selection-dlist number-group">
                    <dt>购买数量</dt>
                    <dd style={{marginRight: '15px'}}>
                      <div className="number-box">
                        <form onsubmit="return false;">
                          <button className="btn-decrease btn" type="button">-</button>
                          <input type="number"
                              className="input-num productNum btn"
                              readonly
                              defaultValue={itemInfo.sell_type==2?(canBuyNum==0?0:1):1}
                              min={itemInfo.sell_type==2?(canBuyNum==0?0:1):1}
                              max={itemInfo.sell_type==2?canBuyNum:itemInfo.quantity}/>
                          <button className="btn-increase btn" data-callback="incr" type="submit">+</button>
                        </form>
                      </div>
                    </dd>
                  </dl>
                </div>
                <div className="selection-bar">
                  <button className="btn btn-common btn-large" id="cancel" type="button">取消</button>
                  <button className="btn btn-primary btn-large" id="go" type="button">确定</button>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="mod-footbar">
            <div className="action-bar mod-flex com-align-middle">
                <div className="cart mod-flex-item" style={{display: app.coco ? '' : 'none'}} id="gotocart">
                    <i className="icon-cart bridge"></i>
                    <i className="icon-bottle"></i>
                    <label className="tag-status"></label>
                </div>
                {this.getBtn().btn1}
                {this.getBtn().btn2}
            </div>
        </div>
      </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
