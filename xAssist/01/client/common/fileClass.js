/*
 * ファイル制御
 *
 */
fileClass =function(){
	this.fileStr="";//取得ファイルの文字列
};


/**
 * (コールバック)
 * ファイル情報を取得し、文字列で返す。
 * return str;
 */
fileClass.prototype.setFileObj=function(fileList){
	this.fileStr="";
	var self=this;
	var d = new $.Deferred;
	var str="";
	var len=fileList.length;
	for(var i=0; i<fileList.length; i++){
		var reader = new FileReader();
		reader.readAsBinaryString(fileList[i], "UTF-8");
		reader.onload = function(evt){
			//UTF8
			/**/
			if(Encoding.detect(evt)==="UTF-8"){
				var result = evt.target.result;
				var sjisArray = str2Array(result);
				var result = Encoding.codeToString(sjisArray);
				str+=result;
			}else{
				/**/
				//SJIS
				var result = evt.target.result;
				var sjisArray = str2Array(result);
				var uniArray = Encoding.convert(sjisArray, 'UNICODE', 'SJIS');
				var result = Encoding.codeToString(uniArray);
				str+=result;
				/**/
			}

			if(len==i){
				self.fileStr=str;
				console.log(str);
				d.resolve(str);

			}
		}
	}
	return d.promise();
};

/**
 * TSV形式のファイルをjsonに分解
 */
fileClass.prototype.getTsv2JsonSelf=function(){
	return this.getTsv2Json(this.fileStr);
}
fileClass.prototype.getTsv2Json=function(str){
	var rtn="";
	var lineArray=str.split(/\r\n|\r|\n/);
	rtn+="[";
	for(oneLine in lineArray){
		if(lineArray[oneLine]==""){
			continue;
		}
		rtn+="[";
		var oneLineArray=lineArray[oneLine].split(String.fromCharCode(9));
		for(one in oneLineArray){
			rtn+='"'+oneLineArray[one]+'"'+",";
		}
		rtn=rtn.slice(0,-1);
		rtn+="],";
	}
	rtn=rtn.slice(0,-1);
	rtn+="]";
	return rtn;
}
