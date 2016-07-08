import React from 'react';
import ReactDom from 'react-dom';
import { hashHistory } from 'react-router';
import moment from 'moment';
import global from  './global';
import dataService from  './dataService';
//import PCLogin from '../pc/components/login/Index';

class Util {

  /**
   * 转换时间24小时制，eg:20:30
   * @param {Date}
   * @return {String}
   */
  static formatTime(time){
    return moment(time).format('H:mm');
  }

/**
 * 解析时间，按东八区解析
 * @str {String|Number}
 * @return {Date}
 */
  static parseDate(str){
    if(!str){
      return new Date();
    }
    if(typeof str == 'number'){
      return new Date(str);
    }
    //东八区时间
    if(typeof str == 'string' && str.indexOf('+08') < 0){
      str = str + '+08:00';
    }
    return new Date(str);
  }

  /**
   * 将对象的属性转换为日期
   * @param {Object} 要转换的对象
   * @param {Array[String]} 属性数组
   * @return {Object}
   */
  static convertProp2Date(obj,props){
    props.forEach(function(item){
      obj[item] = Util.parseDate(obj[item]);
    })
    return obj;
  }

  /**
   * 获取URL参数
   * @return {Object} {key:value}
   */
  static getURLParams() {
    function parseParams(str) {
      var rs = {};
      var i = str.indexOf('?')
      if (i >= 0) {
        str = str.substr(i + 1);
        var params = str.split('&');
        params.forEach(function (s) {
          var p = s.split('=');
          if (p.length >= 2) {
            rs[p[0]] = p[1];
          }
        });
      }
      return rs;
    }

    return Object.assign({}, parseParams(location.search), parseParams(location.hash));
  }
  /**
   * 设置URL参数
   * @param {Object} {key:value}
   * @return {String}
   */
  static toURLParams(param) {
    var rs = []
    for(var key in param){
      rs.push(key + '=' + encodeURIComponent(param[key]));
    }
    return rs.join('&');
  }

  }

export default Util;
