/**
* ローカルストレージクラス
*/
storageClass =function(){
    this.ls=localStorage;
    this.name="customMine_";
}
storageClass.prototype.set=function(key,val){
    this.ls.setItem(this.name+key,JSON.stringify(val));
}
storageClass.prototype.get=function(key){
    var ret=this.ls.getItem(this.name+key);
    return JSON.parse(ret);
}
storageClass.prototype.is=function(key){
    if(this.ls.getItem(this.name+key)==null){
        return false;
    }
    return true;
}
storageClass.prototype.delete=function(key){
    return this.ls.removeItem(this.name+key);
}
storageClass.prototype.clear=function(key){
    return this.ls.clear();
}
