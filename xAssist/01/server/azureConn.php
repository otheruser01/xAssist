<?php
/**
 * AzureとのAPI連携用
 */
require_once dirname(__FILE__)."/config.php";


class azureConn{
	private $url;
	private $apiKey;
	private $contentType;

	public function __construct($url,$key){
		$this->setInit($url,$key);
	}

	public function setInit($url,$apiKey){
		$this->url=$url;
		$this->apiKey=$apiKey;
		$this->contentType="application/json";
	}
	public function setContentType($contentType){
		$this->contentType=$contentType;
	}

	/**
	 * @param unknown $faceId
	 *  AzureとPOSTで通信
	 *  $action：アプリの機能
	 *  $data：配列データ
	 *  戻り値：配列
	 */
	public function post($action,$urlOption,$data){
		$url=$this->url."/".$action;
		if($urlOption!=""){
			$url.=$urlOption;
		}
		$headers=array(
				"Content-Type:".$this->contentType,
				"Ocp-Apim-Subscription-Key:".$this->apiKey);
		$curl=curl_init($url);
		echo $url;
		curl_setopt($curl,CURLOPT_POST, TRUE);
		curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, FALSE);  //
		curl_setopt($curl,CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($curl,CURLOPT_COOKIEJAR,      'cookie');
		curl_setopt($curl,CURLOPT_COOKIEFILE,     'tmp');
		curl_setopt($curl,CURLOPT_HTTPHEADER, $headers);
		curl_setopt($curl,CURLOPT_FOLLOWLOCATION, TRUE);
		curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($data));
		return json_decode(curl_exec($curl));
	}

	public function get($action,$urlOption){
		$url=$this->url."/".$action;
		if($urlOption!=""){
			$url.=$urlOption;
		}
		$headers=array(
				"Content-Type:".$this->contentType,
				"Ocp-Apim-Subscription-Key:".$this->apiKey);
		$curl=curl_init($url);
		curl_setopt($curl,CURLOPT_POST, TRUE);
		curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, FALSE);  //
		curl_setopt($curl,CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($curl,CURLOPT_HTTPHEADER, $headers);
		return json_decode(curl_exec($curl));
	}

	public function getUrl($url){
		$headers=array(
				"Content-Type:".$this->contentType,
				"Ocp-Apim-Subscription-Key:".$this->apiKey);
		$curl=curl_init($url);
		echo $url;
		curl_setopt($curl,CURLOPT_CUSTOMREQUEST, 'GET');
		curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, FALSE);  //
		curl_setopt($curl,CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($curl,CURLOPT_HTTPHEADER, $headers);
		$response = curl_exec($curl);
		$result = json_decode($response, true);
		return $result;
	}


	public function binaryPost($action,$urlOption,$data){
		$url=$this->url."/".$action;
		if($urlOption!=""){
			$url.=$urlOption;
		}
		$headers=array(
				"Content-Type:".$this->contentType,
				"Ocp-Apim-Subscription-Key:".$this->apiKey);
		$curl=curl_init($url);
		echo $url;
		curl_setopt($curl,CURLOPT_POST, TRUE);
		curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, FALSE);  //
		curl_setopt($curl,CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($curl,CURLOPT_COOKIEJAR,      'cookie');
		curl_setopt($curl,CURLOPT_COOKIEFILE,     'tmp');
		curl_setopt($curl,CURLOPT_HTTPHEADER, $headers);
		curl_setopt($curl,CURLOPT_FOLLOWLOCATION, TRUE);
		curl_setopt($curl, CURLOPT_POSTFIELDS,$data);
		return json_decode(curl_exec($curl));
	}

	public function binaryPostAccepted($action,$urlOption,$data){
		$url=$this->url."/".$action;
		if($urlOption!=""){
			$url.=$urlOption;
		}
		$headers=array(
				"Content-Type:".$this->contentType,
				"Ocp-Apim-Subscription-Key:".$this->apiKey);
		$curl=curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl,CURLOPT_HTTPHEADER, $headers);
		curl_setopt($curl, CURLOPT_POSTFIELDS,$data);
		curl_setopt($curl, CURLOPT_HEADER, true);
		curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
		$html =  curl_exec($curl);
		$arr=explode("\n",$html);
		curl_close($curl);
		$http=str_replace("Operation-Location: ","",$arr[7]);
		return trim($http);
	}



	/**
	 * @param unknown $faceId
	 *  AzureとPOSTで通信
	 *  $action：アプリの機能
	 *  $data：配列データ
	 *  戻り値：配列
	 */
	public function put($action,$urlOption,$body){
		$url=$this->url."/".$action;
		if($urlOption!=""){
			$url.="/".$urlOption;
		}
		$headers=array(
				"Content-Type:".$this->contentType,
				"Ocp-Apim-Subscription-Key:".$this->apiKey);
		$curl=curl_init($url);
		curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, FALSE);
		curl_setopt($curl,CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($curl,CURLOPT_HTTPHEADER, $headers);
		curl_setopt($curl,CURLOPT_CUSTOMREQUEST , "PUT");
		curl_setopt($curl,CURLOPT_POSTFIELDS,json_encode($body));
		return  json_decode(curl_exec($curl));
	}

	/**
	 * 削除
	 *
	 */
	public function delete($action,$deleteKey){
		$url=$this->url."/".$action."/".$deleteKey;
		$headers=array(
				"Content-Type:".$this->contentType,
				"Ocp-Apim-Subscription-Key:".$this->apiKey);
		$param=array(
				"name"=>$this->groupID,
				"userData"=>"sunrex_face_api_group_".$this->groupID
		);
		$curl=curl_init($url);
		curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, FALSE);
		curl_setopt($curl,CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($curl,CURLOPT_HTTPHEADER, $headers);
		curl_setopt($curl,CURLOPT_CUSTOMREQUEST , "DELETE");
		return  json_decode(curl_exec($curl));
	}
}
?>
