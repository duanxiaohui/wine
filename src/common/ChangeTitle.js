/**
 * 修改页面标题
 */
import $ from 'webpack-zepto';
let iframeImage = require('../images/iframe-use.png');
export default {
	changeTitle:function(title){
    var $body = $('body');
    document.title = title;
    var $iframe = $("<iframe src="+iframeImage+" style='display:none;'></iframe>");
    $iframe.on('load',function() {
      setTimeout(function() {
        $iframe.off('load').remove();
      }, 0);
    }).appendTo($body);
	}
};
