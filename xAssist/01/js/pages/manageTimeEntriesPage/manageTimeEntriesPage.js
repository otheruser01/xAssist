/**
* 作業時間更新
*/
manageTimeEntriesPage =function(){
    this.url="";
    this.timeEntriesArray=null;
    this.html=null;
    this.index=null;
    this.init();
    //ファイルクラス
    this.fileC=new fileClass();
}
inherits(manageTimeEntriesPage, pageParent);

manageTimeEntriesPage.prototype.init=function(){
    this.url="client/pages/manageTimeEntriesPage/manageTimeEntriesPage";
    this.html=null;
    this.index=null;
}

/**
 * イベント一覧
 */
manageTimeEntriesPage.prototype.event=function(){
    var self=this;
    //画面ロード時
    this.setProjectList();
    //日報に登録
	$(this.html).find("#export").on("click",function(e){
		   var ajax =new ajaxClass();
		    ajax.setUniData("redmineAuth");
		    ajax.setUser(self.index.ls.get("user"));
		    ajax.send("redmineManageTimeEntries",
				{"type":"kintoneIns","list":JSON.stringify(self.timeEntriesArray),"logid":$(self.html).find("#logid").val(),"pass":$(self.html).find("#pass").val()},
				function(cb){
					console.log(cb);
				}
				).then(function(ret){
				if(ret.res==0){
					console.log(ret);
				}else{}
		    });
	});
}

/**
 * 画面ロード時
 */
manageTimeEntriesPage.prototype.showInit=function(){
    var self=this;
    this.setProjectSelectBox();
}

/*
 * 作業合計を表示
 */
manageTimeEntriesPage.prototype.setProjectList=function(){
    var self=this;
    var ajax =new ajaxClass();
    ajax.setUniData("redmineAuth");
    ajax.setUser(self.index.ls.get("user"));
    ajax.send("redmineManageTimeEntries",
		{"type":"gets","id":self.index.ls.get("user").id,"spent_on":self.nowDateFormat()},
		function(cb){
			console.log(cb);
		}
		).then(function(ret){
			if(ret.res==0){
				$("#list").find("*").remove();
				console.log(ret.data);
				for(key in ret.data){
					var one=ret.data[key];
					var oneTable=$(self.html).find(".listTemp").clone(true);
					$(oneTable).find(".project_name").text(one["project_name"]);
					$(oneTable).find(".tracker_name").text(one["tracker_name"]);
					$(oneTable).find(".subject").text(one["subject"]);
					$(oneTable).find(".hours").text(one["hours"]);
					$(oneTable).find(".done_ratio").text(one["done_ratio"]);
					$("#list").append($(oneTable));
				}
				self.timeEntriesArray=ret.data;
			}else{
			}
    });
}

/**
 *現在日付をハイフン付きで返す
 *
 */
manageTimeEntriesPage.prototype.nowDateFormat=function(){
	var hiduke=new Date();
	//年・月・日・曜日を取得する
	var year = hiduke.getFullYear();

	 var month= ("00" + (hiduke.getMonth()+1)).slice(-2);
	  var day = ("00" + hiduke.getDate()).slice(-2);
	return year+"-"+month+"-"+day;
}

GLOBAL_PAGE_ARRAY["manageTimeEntriesPage"]=new manageTimeEntriesPage();
