/*
 *HTMLパーツ制御
 *
 */
htmlPartsClass =function(body){
	this.obj=$(body);
};


/************************************************/
/**セレクトボックス******************************/
/************************************************/
/**
 *セレクトボックス追加
 *初期値をセット(引数、ローカル、一番上の順)
 */
htmlPartsClass.prototype.setSelectBox=function(selecter,list,argSelected){
	//初期値をセット(引数、ローカル、一番上の順)
	var selected=argSelected||"";
	if(selected==""){
		if(localStorage.getItem('htmlPartsClass_setSelectBox'+selecter)!=null){
			selected=localStorage.getItem('htmlPartsClass_setSelectBox'+selecter);
		}
	}
	if(list==null){
		list=["",""];
	}
	var selectBox=$(this.obj).find(selecter);
	$(selectBox).find("*").remove();
	for(key in list){
		var option=$("<option>");
		$(option).val(key);
		$(option).text(list[key]);
		$(selectBox).append($(option));
	}
	$(selectBox).val(selected);
	var ret= $(selectBox).val();
	$(selectBox).on("change",function(){
		if($(this).val()!=""){
			localStorage.setItem('htmlPartsClass_setSelectBox'+selecter,$(this).val());
		}
	});
	return ret;
};

/**
 *対象にoptionのみ追加
 */
htmlPartsClass.prototype.setOptions=function(selecter,list,argSelected){
	var selectBox=$(this.obj).find(selecter);
	for(key in list){
		var option=$("<option>");
		$(option).val(key);
		$(option).text(list[key]);
		$(selectBox).append($(option));
	}
};
/**
 * オプションを追加
 */
htmlPartsClass.prototype.addOption=function(selecter,key,val){
	var selectBox=$(this.obj).find(selecter);
	var option=$("<option>");
	$(option).val(key);
	$(option).text(val);
	$(selectBox).append($(option));
}

htmlPartsClass.prototype.addPreOption=function(selecter,key,val){
	var selectBox=$(this.obj).find(selecter);
	var option=$("<option>");
	$(option).val(key);
	$(option).text(val);
	$(selectBox).prepend($(option));
}
htmlPartsClass.prototype.changeOption=function(selecter,key){
	var selectBox=$(this.obj).find(selecter);
	$(selectBox).val(key);
}
/************************************************/




/************************************************/
/**カスタムセレクトボックス******************************/
/************************************************/

/**
 *親構造を取得
 */
htmlPartsClass.prototype.convChildren=function(argList){
	var rtn={};
	var appendListFunc=function(list,depth){
		for(key in list){
			//すでに閉じているプロジェクトはスルー
			if(list[key]["status"]!=1){
				continue;
			}
			rtn[list[key]["identifier"]]=depth+list[key]["name"];
			//自身にサブプロジェクトがあったら
			if(list[key]["children"]!=null){
				appendListFunc(list[key]["children"],depth+"　");
			}
		}
	}
	appendListFunc(argList,"");
	return rtn;
}
