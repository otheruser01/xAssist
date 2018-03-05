<?php

$mode="add";
$post=$_POST;
$file=$_FILES;
set_time_limit(0);
require_once dirname(__FILE__)."/azureConn.php";

$azure=new AzureConn(AZURE_SPEAKER_RECOGNITION_URL,AZURE_SPEAKER_RECOGNITION_KEY);

switch($mode){
	case "search"://音声から話者認識
		searchSpeaker($azure,$post,$file);
	break;
	case "insert"://話者プロフィールを新規作成
		insertProfile($azure,$post,$file);
	break;
	case "add":	//話者の音声を追加
		addSpeaker($azure,$post,$file);
	break;
	case "list"://プロフィール一覧を取得
		listSpeaker($azure,$post,$file);
	break;
}

function searchSpeaker($azure,$post,$file){
}

function insertProfile($azure,$post,$file){
	//プロフィール作成
	$insertProfile=$azure->post("identificationProfiles","",array("locale"=>"en-US"));
	//object(stdClass)#2 (1) { ["identificationProfileId"]=> string(36) "3646ae62-3eab-4ed2-ac45-42272554c806" }
}

function addSpeaker($azure,$post,$file){
	//multipart/form-data application/octet-stream
	var_dump($file);
	$profile="";
	$toUrl="../../sound/".$profile.".wav";
	move_uploaded_file($file["data"]["tmp_name"],$toUrl);

	$handle=fopen($toUrl,"rb");

	$contents=fread($handle, filesize($toUrl));

	$file_handle = fopen($toUrl,"rb");
	while (!feof($file_handle)) {
		$line = fgets($file_handle);
		echo $line;
	}
	var_dump($line);

	//var_dump($contents);
	//$azure->setContentType("application/octet-stream");

	//var_dump($azure->post("identificationProfiles",$profile."/enroll",$line));
	fclose($file_handle);
}

function listSpeaker($azure,$post,$file){
}
/**
 *
 */
?>
