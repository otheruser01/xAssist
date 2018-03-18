var GLOBAL_URL="<?php echo $_SERVER["SERVER_ADDR"];?>";
var GLOBAL_PAGE_ARRAY=new Array();


/**
 * ソースインポート関数
 * @param type
 * @param url
 */
function importSrc(type,url){
	url+="?var=<?php /*echo microtime(true)/**/?>";
	switch(type){
	case "css":
		document.write('<link rel="stylesheet" type="text/css" href="'+url+'">');
	break;
	case "less":
		document.write('<link rel="stylesheet/less" type="text/css" href="'+url+'">');
	break;
	case "js":
		document.write('<script type="text/javascript" src="'+url+'"></script>');
	break;
	}
}

/**
*css,lessインポート
**/
importSrc("css","css/font-awesome-4.7.0/css/font-awesome.min.css");
importSrc("css","css/main.css");

/**
*jsライブラリインポート
**/
importSrc("js","js/common/lib/jquery-3.2.1.min.js");
importSrc("js","js/common/lib/recorder.js");
importSrc("js","js/recordClass.js");

