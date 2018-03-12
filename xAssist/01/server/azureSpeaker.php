<?php

$mode="add";
$post=$_POST;
$file=$_FILES;
set_time_limit(0);
require_once dirname(__FILE__)."/azureConn.php";
require_once dirname(__FILE__)."/fileClass.php";

$file=new fireClass("./files/test.txt");
$file->write("aieuo");
echo $file->read();

return;

$azure=new AzureConn(AZURE_SPEAKER_RECOGNITION_URL,AZURE_SPEAKER_RECOGNITION_KEY);
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
		listSpeaker($azure,$post,$file);
	break;
}

function searchSpeaker($azure,$post,$file){
	$profiles="849a852a-09a6-477c-8a36-e1fd26ef07d6,dea1ff4e-64f9-4a59-93f0-c58a48a9b4c4";
	$toUrl="./files/search.wav";
	move_uploaded_file($file["data"]["tmp_name"],$toUrl);
	$handle = fopen($toUrl, "rb");
	$contents = fread($handle, filesize($toUrl));
	$azure->setContentType("application/octet-stream");
	$url=$azure->binaryPostAccepted("identify","?identificationProfileIds=".$profiles."&shortAudio=true",$contents);
	sleep(3);
	$azure->setContentType("application/json");
	var_dump($azure->getUrl($url));
	fclose($contents);
}

function insertProfile($azure,$post,$file){
	//プロフィール作成
	$insertProfile=$azure->post("identificationProfiles","",array("locale"=>"en-US"));
}

function addSpeaker($azure,$post,$file){
	//multipart/form-data application/octet-stream
	/**/
	$profile="dea1ff4e-64f9-4a59-93f0-c58a48a9b4c4";
	$toUrl="".$profile.".wav";
	move_uploaded_file($file["data"]["tmp_name"],$toUrl);
	$handle = fopen($toUrl, "rb");
	$contents = fread($handle, filesize($toUrl));
	$azure->setContentType("application/octet-stream");
	var_dump($azure->binaryPost("identificationProfiles","/".$profile."/enroll?shortAudio=true",$contents));
	fclose($contents);
}
//プロフィール登録と音声登録同時
function insertAndAddSpeaker($azure,$post,$file){
	$profile=$insertProfile=$azure->post("identificationProfiles","",array("locale"=>"en-US"));
	if($profile->identificationProfileId!=null){
		$profileID=$profile->identificationProfileId;
		$toUrl="".$profileID."_".$post["name"].".wav";
		move_uploaded_file($file["data"]["tmp_name"],$toUrl);
		$handle = fopen($toUrl, "rb");
		$contents = fread($handle, filesize($toUrl));
		$azure->setContentType("application/octet-stream");
		var_dump($azure->binaryPost("identificationProfiles","/".$profileID."/enroll?shortAudio=true",$contents));
		fclose($contents);
	}
}

function listSpeaker($azure,$post,$file){
	var_dump($azure->get("identificationProfiles","/849a852a-09a6-477c-8a36-e1fd26ef07d6/train"));
}
/**
 *
 */
?>
