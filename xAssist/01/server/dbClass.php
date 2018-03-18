<?php
/**
 *ユーザー情報
 *
 *list
 *|-id:cnt
 *
 *detail
 *|-0:id,name,detail...
 */
class userDB{
	private $arr;

	public function __construct(){
		$this->arr=array();
		$this->arr["list"]=array();
		$this->arr["detail"]=array();
	}

	public function add($id,$name,$detail){
		$one=array();
		$one["id"]=$id;
		$one["name"]=$name;
		$one["detail"]=$detail;
		array_push($this->arr["detail"],$one);
		$cnt=count($this->arr["detail"]);
		$this->arr["list"][$id]=$cnt;
	}

	public function get(){
		$ret=array();
		$ret["list"]=$this->arr;
		$ret["detail"]=$this->detail;
		return $ret;
	}
}
?>
