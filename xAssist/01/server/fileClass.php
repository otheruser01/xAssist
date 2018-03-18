<?php
/**
 *
 */
class fileClass{
	private $path;
	private $arr;

	public function __construct($path){
		$this->setInit($path);
	}

	public function setInit($path){
		$this->path=$path;
	}

	public function read(){
		$fp=fopen($this->path, 'r');
		$contents = fread($fp, filesize($this->path));
		fclose($fp);
		return $contents;
	}

	public function write($string) {
		$fp=fopen($this->path, 'w');
		fwrite($fp,$string);
		fclose($fp);
	}

	/**
	 *配列読み込み
	 * @return unknown
	 */
	public function readArr(){
		$fp=fopen($this->path, 'r');
		$contents = fread($fp, filesize($this->path));
		fclose($fp);
		$ret=array();
		if($contents!=null){
			$ret=json_decode($contents,true);
		}
		return $ret;
	}

	/**
	 *配列書き込み
	 * @param unknown $arr
	 */
	public function writeArr($arr) {
		$arrStr=json_encode ($arr);
		$fp=fopen($this->path, 'w');
		fwrite($fp,$arrStr);
		fclose($fp);
	}
}
?>
