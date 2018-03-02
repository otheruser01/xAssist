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
importSrc("css","client/css/font-awesome-4.7.0/css/font-awesome.min.css");
importSrc("css","client/css/icon.css");
importSrc("less","client/css/global.less");
importSrc("less","client/css/parts.less");
importSrc("less","client/css/section.less");
importSrc("js","client/common/lib/less.js");
/**
*jsライブラリインポート
**/
importSrc("js","client/common/lib/jquery-3.2.1.min.js");
importSrc("js","client/common/lib/encoding.js");
importSrc("js","client/common/commonClass.js");
/**
*commonインポート
**/
importSrc("js","client/common/commonFunc.js");

/**
*jsクラスインポート
**/
importSrc("js","client/common/storageClass.js");
importSrc("js","client/common/ajaxClass.js");
importSrc("js","client/common/fileClass.js");
importSrc("js","client/common/redmineClass.js");
importSrc("js","client/common/htmlPartsClass.js");
/**
*jsページインポート
**/

importSrc("js","client/pages/pageParent.js");
importSrc("js","client/pages/testPage/testPage.js");
importSrc("js","client/pages/userConfigPage/userConfigPage.js");
importSrc("js","client/pages/ticketIOPage/ticketIOPage.js");
importSrc("js","client/pages/manageProjectPage/manageProjectPage.js");
importSrc("js","client/pages/manageTicketPage/manageTicketPage.js");
importSrc("js","client/pages/manageTimeEntriesPage/manageTimeEntriesPage.js");
//メインページ
importSrc("js","client/indexClass.js");
