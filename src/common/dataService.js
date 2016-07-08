/**
 * 所有访问数据的接口调用该服务
 */
 import $ from 'webpack-zepto';
	var service = {
		getJSON:function(url,data,success,error,headers){
			this.getData(url, data, "POST", "json", success, error,headers);
		},
    getJSONByGet:function(url,data,success,error,headers){
			this.getData(url, data, "GET", "json", success, error,headers);
		},
		getHTML:function(url,data,success,error,headers){
			this.getData(url, data, "POST", "html", success, error,headers);
		},
		getData: function (url, data, method, dataType, success, error ,headers) {
      headers = headers||{};

			var options = {
				url: url,
				method: method,
				data: data,
				dataType: dataType
			};
			//$.extend(options, theOptions);
			if(typeof data == 'string'){
				options.contentType  = 'application/json';
			}
			$.ajax({
				url: url,
				type: method,
				data: data,
        headers:headers,
				dataType: dataType,
				success: success,
				error: error
			});
		},
		submit: function (url,data,success,error) {
			this.getData(url, data, 'POST', 'json', success, error);
		},
		formSubmit: function (url,data,success,error) {
			this.getData(url, data, 'POST', 'html', success, error,{iframe:true} );
		}
	};

	export default service;
