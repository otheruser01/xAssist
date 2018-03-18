<?php
$post=$_POST;
$file=$_FILES;
set_time_limit(0);
require_once dirname(__FILE__)."/azureConn.php";
require_once dirname(__FILE__)."/fileClass.php";

$azure=new AzureConn(AZURE_SPEAKER_RECOGNITION_URL,AZURE_SPEAKER_RECOGNITION_KEY);
$ret="";
switch($post["mode"]){
	case "search"://音声から話者認識
		searchSpeaker($azure,$post,$file);
	break;
	case "insert"://話者プロフィールを新規作成
		insertProfile($azure,$post,$file);
	break;
	case "add":	//話者の音声を追加
		addSpeaker($azure,$post,$file);
	break;
	case "insAndAdd":	//話者の音声を追加
		insertAndAddSpeaker($azure,$post,$file);
		break;
	case "list"://プロフィール一覧を取得
		listSpeaker($post,$file);
	break;
}


/**
 * 音声を検索
 * return ユーザー名を返す
 */
function searchSpeaker($azure,$post,$file){
	$fc=new fileClass("./files/users.txt");
	$usrDB=$fc->readArr();
	$cnt=0;
	$profiles="";
	foreach($usrDB as $key =>$val){
		$profiles.=$key;
		if($cnt>=9){
			break;
		}
		$cnt++;
		$profiles.=",";
	}
	$profiles=substr($profiles, 0, -1);
	$handle = fopen($file["data"]["tmp_name"], "rb");
	$contents = fread($handle, filesize($file["data"]["tmp_name"]));
	$azure->setContentType("application/octet-stream");
	$url=$azure->binaryPostAccepted("identify","?identificationProfileIds=".$profiles."&shortAudio=true",$contents);
	sleep(3);
	$azure->setContentType("application/json");
	$result=$azure->getUrl($url);
	fclose($contents);
	echo json_encode($usrDB[$result["processingResult"]["identifiedProfileId"]]);
}

/**
 * プロフィール作成
 */
function insertProfile($azure,$post,$file){
	$insertProfile=$azure->post("identificationProfiles","",array("locale"=>"en-US"));
}

/**
 * プロフィールに音声を登録
 * @param unknown $azure
 * @param unknown $post
 * @param unknown $file
 */
function addSpeaker($azure,$post,$file){
	$toUrl="".$profile.".wav";
	move_uploaded_file($file["data"]["tmp_name"],$toUrl);
	$handle = fopen($toUrl, "rb");
	$contents = fread($handle, filesize($toUrl));
	$azure->setContentType("application/octet-stream");
	var_dump($azure->binaryPost("identificationProfiles","/".$profile."/enroll?shortAudio=true",$contents));
	fclose($contents);
}

/**
 * プロフィール登録と音声登録同時
 */
function insertAndAddSpeaker($azure,$post,$file){
	$ret="";
	$profile=$insertProfile=$azure->post("identificationProfiles","",array("locale"=>"en-US"));
	if($profile->identificationProfileId!=null){
		/**/
		$fc=new fileClass("./files/users.txt");
		$usrDB=$fc->readArr();
		$profileID=$profile->identificationProfileId;
		$usrDB[$profileID]=array("name"=>$post["name"]);
		$fc->writeArr($usrDB);
		$handle = fopen($file["data"]["tmp_name"], "rb");
		$contents = fread($handle, filesize($file["data"]["tmp_name"]));

		$azure->setContentType("application/octet-stream");
		$ret=$azure->binaryPost("identificationProfiles","/".$profileID."/enroll?shortAudio=true",$contents);
		fclose($contents);
	}
	echo json_encode($ret);
}

function listSpeaker($post,$file){
	$fc=new fileClass("./files/users.txt");
	$usrDB=$fc->readArr();
	echo json_encode($usrDB);
}
?>
