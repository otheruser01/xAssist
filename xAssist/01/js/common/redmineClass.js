/*
 *redmine制御用クラス
 *
 */
redmineClass =function(){
	this.projects=null;
};


/****************************************************
 *プロジェクト
 */
redmineClass.prototype.setProject=function(projects){
	this.projects=projects;
};
/**
 * プロジェクトを取得
 * 引数
 * key(キーとなる値)
 */
redmineClass.prototype.getProject=function(key){
	var self=this;
	var rtn=null;
	for(one in self.projects){
		rtn[one["key"]]=one;
	}
	console.log(rtn);
	return rtn;
};
/**
 * プロジェクトを親子構造で取得
 */
redmineClass.prototype.getProjectChildren=function(){
	console.log("親子構造");
	var self=this;
	var rtn=new Array();
	//全て格納
	rtn=JSON.parse(JSON.stringify(self.projects));
	for(key in rtn){
		var one =rtn[key];
		//親がある場合、
		if(one["parent"]!=null){
			if(rtn[one["parent"]["id"]]["children"]==null){
				rtn[one["parent"]["id"]]["children"]=new Array();
			}
			rtn[one["parent"]["id"]]["children"][key]=one;
		}
	}
	//子プロジェクトを最上位配列から削除
	for(key in rtn){
		var one =rtn[key];
		if(one["parent"]!=null){
			delete rtn[key];
		}
	}
	return rtn;
};
