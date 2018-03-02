
/**
 * ajaxクラス
 */
ajaxClass=function(){
	this.serverPath="server/control";
	//前と同じ処理に飛ばす場合は、前回処理を停止する為中断を行う
	this.preMethod="";
	this.jqxhr=null;
	this.uniData="";
	this.userRedmineUrl="";
	this.userApi="";
	this.timerArr=Array();
}

/*
*処理の一意情報をセット
*/
ajaxClass.prototype.setUniData=function(method){
	var now  = new Date();
	this.uniData=now+"_"+method;
	return this.uniData;
}

ajaxClass.prototype.setAuthData=function(url,apikey){
	this.userRedmineUrl=url;
	this.userApi=apikey;
}

ajaxClass.prototype.setUser=function(user){
	this.userRedmineUrl=user["userRedmineUrl"];
	this.userApi=user["api_key"];
}

/**
 * 送信
 * arg
 * 	method:this.serverPath下のphpファイル名
 * 	json:json形式の文字列
 *
 * 戻りのデータ構造
 * 	{
 * 	res:(0:正常,1:規定エラー,2:認証エラー,3:Exceptionエラー、4接続不能エラー),
 *  err:(エラーがあった場合はエラーメッセージ),
 *  uniData
 * 	data:{各データ}
 * 		}
 * }
 */
ajaxClass.prototype.send=function(method,data){
	var d = new $.Deferred;
	var url =this.serverPath+"/"+method+".php";
	var meta={"uniData":this.uniData,"userRedmineUrl":this.userRedmineUrl,"userApi":this.userApi};
	var data={"meta":meta,"data":data};
	console.log(data);
	//前と同じ処理を行う場合、前処理を中断
	if(this.preMethod==method){
		this.jqxhr.abort();
	}
	this.preMethod=method;
	//*JSON設定*/
	this.jqxhr=$.ajax({
		async: true,
		url: url,
		type: 'POST',
		data: data,
		dataType :'json'
	})
	//接続成功
	.done(function(resp){
		console.log(resp);
		d.resolve(resp);
	})
	//接続失敗
	.fail(function(resp){
		var ret="接続に失敗";
		d.resolve(ret);
	});
	return d.promise();
}
/**
 * 途中経過を返す
 *
 */
ajaxClass.prototype.sendProgress=function(method,data,callBack){
	var d = new $.Deferred;
	var self=this;
	var url =this.serverPath+"/"+method+".php";
	var meta={"uniData":this.uniData,"userRedmineUrl":this.userRedmineUrl,"userApi":this.userApi};
	var data={"meta":meta,"data":data};


	var unique=+new Date();
	$.ajax({
		type: 'POST',
		data: data,
		dataType :'json',
        url:url,
        //途中経過
        xhrFields: {
            onloadstart: function(){
                var xhr = this;
                self.timerArr[unique]= setInterval(function(){
                	var json=JSON.parse(self.Lastprogress(xhr.responseText));
                	//処理終了
                	if(json.progress==undefined){
                        clearInterval(self.timerArr[unique]);
                        d.resolve(json);
                	}else{
                	//途中経過
                    	callBack(json);
                	}
                }, 100);
            }
        },
        success: function(ret) {
            console.log('finished!');
            // すぐにクリアしてしまうと最終的なレスポンスに対する処理ができないので
            // タイマーと同じ間隔を空けてクリアする必要がある
            clearInterval(self.timerArr[unique]);
            delete self.timerArr[unique];
            var json=null;
            if(ret!=null){
            	json=ret;
            }else if(xhr!=null){
            	json=JSON.parse(self.Lastprogress(xhr.responseText));
            }
            d.resolve(json);
        }
    });
	return d.promise();
}

/**
 *最終行を返す
 *
 */
ajaxClass.prototype.Lastprogress=function(str){
	if(str==""){
		return "";
	}
	var arr=str.split(/\r\n|\r|\n/);
	return arr[arr.length-2];
}

