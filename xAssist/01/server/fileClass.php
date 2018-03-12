<?php
/**
 *
 */
class fireClass{
	private $path;

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
}
?>
