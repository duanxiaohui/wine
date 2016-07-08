
import { hashHistory } from 'react-router'
import util from './util';

var global = {
    setValidateCode: function (validateCode) {
        this.initParam.validateCode = validateCode;
    },
    hasLogin: function() {
        return this.initParam.validateCode ? true: false;
    },
    setInitParam: function() {
        var p = util.getURLParams();
        this.initParam.deptId =  p.deptId || this.initParam.deptId;
        this.initParam.firstProjId =  p.firstProjId || this.initParam.firstProjId;
        this.initParam.validateType =  p.validateType || this.initParam.validateType;
        this.initParam.validateCode =  p.validateCode || this.initParam.validateCode;
        if(!p.validateCode && this.initParam.validateCode){
            //将validateCode 写入URL，避免跳转回来重新登录
            var pathName = location.hash.replace('#','');
            pathName = pathName.substr(0, pathName.indexOf('?'));
            var query = $.extend({ validateCode: this.initParam.validateCode }, util.getURLParams());
            var url = pathName + '?' + util.toURLParams(query);
            hashHistory.replace(url);
        }
    },
    initParam: {
        deptId:'',
        firstProjId: '',
        validateType: '',
        validateCode: ''
    }
}

export default global;
