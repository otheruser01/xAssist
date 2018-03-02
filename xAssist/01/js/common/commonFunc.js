/**
* htmlロード
*/
function loadHtml(url){
	var d = new $.Deferred;
	ajaxAbortArg=$.ajax({
          type: 'GET',
          url: url,
          dataType: 'html',
          async: false
          })
      	.done(function(resp){
        	d.resolve($(resp));
        });
	return d.promise();
}

/**
* javascriptクラス継承関数
**/
var inherits = function(childCtor, parentCtor) {
  Object.setPrototypeOf(childCtor.prototype, parentCtor.prototype);
};

/**
 * 文字列を配列に変換
 * @param str
 * @returns {Array}
 */
function str2Array(str) {
    var array = [],i,il=str.length;
    for(i=0;i<il;i++) array.push(str.charCodeAt(i));
    return array;
}