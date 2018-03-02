/**
* ユーザー情報設定画面
*/
userConfigPage =function(){
    this.url="";
    this.html=null;
    this.index=null;
    this.init();
}
inherits(userConfigPage, pageParent);

/*
*htmlを表示
*/
userConfigPage.prototype.init=function(){
    this.url="client/pages/userConfigPage/userConfigPage";
    this.html=null;
    this.index=null;
}

userConfigPage.prototype.event=function(){
    var self=this;
    //すでに個人設定がされている場合、画面にセット
    self.setStatus();
    //連携ボタンがクリックされたとき
    $(self.html).find("#link").on("click",function(e){
        var data={
            "userRedmineUrl":$(self.html).find("#userRedmineUrl").val()
            ,"userApi":$(self.html).find("#api_key").val()
        };
        var ajax =new ajaxClass();
        ajax.setUniData("redmineAuth");
        ajax.send("redmineAuth",data).then(function(ret){
            if(ret.res==0){
                self.index.ls.set("user",ret.data["user"]);
                self.setStatus();
            }else{
                self.index.ls.delete("user");
                self.setStatus();
            }
        })
    })
}
userConfigPage.prototype.setStatus=function(){
    var self=this;
    if(self.index.ls.is("user")){
        var user=self.index.ls.get("user");
        $(self.html).find("#userStatus").text("連携ができています");
        $(self.html).find("#api_key").val(user["api_key"]);
        $(self.html).find("#userRedmineUrl").val(user["userRedmineUrl"]);
        $(self.html).find("#firstname").text(user["lastname"]+user["firstname"]);
        $(self.html).find("#login").text(user["login"]);
    }else{
        $(self.html).find("#userStatus").text("連携ができていません");
        $(self.html).find("#firstname").text("");
        $(self.html).find("#login").text("");
    }
    self.index.changeRedmineUrl();
}


GLOBAL_PAGE_ARRAY["userConfigPage"]=new userConfigPage();
