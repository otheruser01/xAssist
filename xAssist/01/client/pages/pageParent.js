/**
* ページの親クラス
*/
var pageParent =function(url){
    this.url=url;
    this.html=null;
    this.index=null;
}

pageParent.prototype.open=function(index){
    this.init();
    this.index=index;
    var self=this;
    var d = new $.Deferred;
    loadHtml(self.url+".html").then(function(html){
        d.resolve($(html));
        self.html=$(html);
    })
    return d.promise();
}
