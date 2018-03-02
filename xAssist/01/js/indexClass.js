/**
* メイン画面の処理
*/
indexClass=function(body){
    this.body=body;
    this.header=$(body).find("header");
    this.nav=$(body).find("nav");
    this.mainPage=$(body).find("#mainPageFrame");
    this.footer=$(body).find("footer");
    this.address=$(body).find("address");
    this.pages=GLOBAL_PAGE_ARRAY;
    this.nowOpenPage=null;
    this.ls=new storageClass();
    this.footerMsgs=null;
}
//ナビ内のメニューを設定
indexClass.prototype.setNavMenu=function(){

}

/**
*イベントを追加
**/
indexClass.prototype.event=function(){
    var self=this;
    //個人設定がされていたらredmineアドレスを追記
    this.changeRedmineUrl();

    //初期URLハッシュを見てページ切り替え
    var urlHash = location.hash;
    if(urlHash){
        urlHash=urlHash.replace("#","")
        if(self.pages[urlHash]){
            self.newPage(urlHash);
        }
    }
    //ナビゲーションの操作
    this.navEvent();
    //ページ切替ボタンを押したときの処理
    $(this.body).find("*[name=openPage]").click(function(e){
        self.newPage($(this).attr("page"));
    });
}

/**
*ページ切替処理
**/
indexClass.prototype.newPage=function(pageName){
    var self=this;
    this.closeNav();
    //もしも個人設定がされていない場合は強制的に個人設定画面
    if(!this.ls.is("user")){
        pageName="userConfigPage";
    }
    self.nowOpenPage=self.pages[pageName];
    self.nowOpenPage.open(this).then(function(html){
        $(self.mainPage).find("*").remove();
        $(self.mainPage).append($(html));
        history.pushState(null,null,location.pathname+"#"+pageName);
        //ページ内のイベントをoff
        $(self.mainPage).find("*").off();
        //新しいイベントをセット
        self.nowOpenPage.event();
    });
}

/*
 * ナビ操作
 */
indexClass.prototype.navEvent=function(){
    var self=this;
    $(self.nav).on('mouseenter', function() {
        $(self.nav).addClass("navOpen");
    });

    $(self.nav).on('mouseleave', function() {
        $(self.nav).removeClass("navOpen");
    });
}
/**
 * ナビを閉じる
 */
indexClass.prototype.closeNav=function(){
    $(this.nav).removeClass("navOpen");
}
/**
 * redmineのurlを変更
 */
indexClass.prototype.changeRedmineUrl=function(){
    if(this.ls.is("user")){
        var user=this.ls.get("user");
        $(this.header).find("#sharelingUser").text("連携中："+user["lastname"]+user["firstname"]);
        $(this.address).find(".redmineUrl").attr("href",user["userRedmineUrl"]);
        $(this.address).find(".redmineUrl").text(user["userRedmineUrl"]);
    }else{
    	$(this.header).find("#sharelingUser").text("未連携：");
        $(this.address).find(".redmineUrl").attr("href","");
        $(this.address).find(".redmineUrl").text("参照元URL");
    }
}


/**
 * フッターセット
 */
indexClass.prototype.clearFooterMsg=function(){
	$(this.footer).empty();
}

indexClass.prototype.addFooterMsg=function(msgHtml){
	var key=+new Date();
	key="uniMsgKey_"+key;
	var oneMsg='<div id="'+key+'">'+msgHtml+'</div>';
	$(this.footer).prepend(oneMsg);
	return key;
}
indexClass.prototype.updateFooterMsg=function(key,msgHtml){
	var div=$(this.footer).find("#"+key);
	$(div).html(msgHtml);
}
//途中経過用フッターメッセージ
indexClass.prototype.progressFooterMsg=function(key,msgHtml,msg,cur,max){
	var par=(cur/max)*100;
	var div=$(this.footer).find("#"+key);
	var countStr=max+"件中"+cur+"件　"+Math.floor(par)+"% ["+msg+"]";
	$(div).html(msgHtml+" "+countStr);
}

indexClass.prototype.deleteFooterMsg=function(key){
	$(this.footer).find("#"+key).remove();
}




