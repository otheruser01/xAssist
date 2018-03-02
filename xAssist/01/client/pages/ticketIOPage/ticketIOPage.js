/**
* アップデート
*/
ticketIOPage =function(){
    this.url="";
    this.html=null;
    this.index=null;
    this.init();
    //ファイルクラス
    this.fileC=new fileClass();
}
inherits(ticketIOPage, pageParent);

ticketIOPage.prototype.init=function(){
    this.url="client/pages/ticketIOPage/ticketIOPage";
    this.html=null;
    this.index=null;
}

/**
 * イベント一覧
 */
ticketIOPage.prototype.event=function(){
    var self=this;
    //画面ロード時
    self.showInit();
	//ファイルアップロード時(同ファイルをアップロードした時に取り込むように、clickで前ファイル情報を消す)
    $(this.html).find("#importFile").on("click",function(e){
    	document.getElementById("importFile").value="";
    });
	$(this.html).find("#importFile").on("change",function(e){
		var files=document.getElementById("importFile").files;
		self.fileC.setFileObj(files).then(function(res){});
	});

    //アップロード実行
	$(this.html).find("#import").on("click",function(e){
	    var ajax =new ajaxClass();
	    ajax.setUniData("redmineAuth");
	    ajax.setUser(self.index.ls.get("user"));
	   var msgKey=self.index.addFooterMsg("");
	   var projectNm= $(self.html).find(".selectProjectBox option:selected").text();
	    ajax.sendProgress("redmineImport",
	    		{"type":$('input[name=importType]:checked').val(),"import":self.fileC.getTsv2JsonSelf(),"project":$(self.html).find(".selectProjectBox").val()},
	    		function(cb){
	    			//途中経過
	    			self.index.progressFooterMsg(msgKey,projectNm+"のアップロード中",cb.data,cb.progress.cur,cb.progress.max);
	    		}
	    		).then(function(ret){
	    			self.index.updateFooterMsg(msgKey,projectNm+"のアップロード処理完了しました。");
	        if(ret.res==0){

	        }
	    });
	});


}


/**
 * 画面ロード時
 */
ticketIOPage.prototype.showInit=function(){
    var self=this;
    //プロジェクト取得
    var ajax =new ajaxClass();
    ajax.setUniData("redmineAuth");
    ajax.setUser(self.index.ls.get("user"));
    ajax.send("redmineGetProject","test").then(function(ret){
        if(ret.res==0){
        	var rm=new redmineClass();
        	rm.setProject(ret["data"]);
            var parts =new htmlPartsClass(self.html);
            //parts.setProjectSelectBox(".customSelectBox",rm.getProjectChildren());
            parts.setSelectBox(".selectProjectBox",parts.convChildren(rm.getProjectChildren()));
        }
    });
}

GLOBAL_PAGE_ARRAY["ticketIOPage"]=new ticketIOPage();
