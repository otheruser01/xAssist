/**
* テストページ
*/
var testPage =function(){
    this.url="";
    this.html=null;
    this.index=null;
    this.init();

}
inherits(testPage, pageParent);


testPage.prototype.init=function(){
    this.url="client/pages/testPage/testPage";
    this.html=null;
    this.index=null;
}

testPage.prototype.event=function(){
    var self=this;
    self.ajaxTest();
    $(self.html).find("*[name=test]").on('click', function() {});
    $(self.html).find("*[name=openPage]").on('click', function() {
        self.index.newPage($(this).attr("page"));
    });
}

testPage.prototype.ajaxTest=function(){
    var ajax =new ajaxClass();
    ajax.setUniData("redmineAuth");
    ajax.sendProgress("redmineResponsiveTest",
    			"test",
    			function(callBack){console.log(callBack);})
    .then(function(ret){
    			console.log(ret);
    		}
    );
}


GLOBAL_PAGE_ARRAY["testPage"]=new testPage();
