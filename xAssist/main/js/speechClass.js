
/**
 * 音声入出力クラス
 */
speechClass=function(){
	//音声認識フラグ
	this.recFlg=false;
	this.rec=null;
	//各即時関数
	this.recStart=null;
	this.recNomatch=null;
	this.recError=null;
	this.recStop=null;
	this.recEnd=null;
	this.recResult=null;
	this.recoding=null;
	this.activeOk=null;

	this.speakFlg=false;
	//okGoogleみたいな合言葉によって音声認識を開始する
	this.activeSpeechFlg=false;
	this.activeMsg="";
}

/**
 *音声認識の各状態によるメソッドをセット
 */
speechClass.prototype.actRecStart=function(act){
	this.recStart=act;
}
speechClass.prototype.actRecNomatch=function(act){
	this.recNomatch=act;
}
speechClass.prototype.actRecError=function(act){
	this.recError=act;
}
speechClass.prototype.actRecStop=function(act){
	this.recStop=act;
}
speechClass.prototype.actRecEnd=function(act){
	this.recEnd=act;
}
speechClass.prototype.actRecResult=function(act){
	this.recResult=act;
}
speechClass.prototype.actRecoding=function(act){
	this.recoding=act;
}
speechClass.prototype.actActiveOk=function(act){
	this.activeOk=act;
}


//==================================================================================================
//合成音声発話
//2017.08.02 iwagami
//==================================================================================================
speechClass.prototype.recOnOff=function(){
	if (this.recFlg == false) {
		this.sttRec();
	} else {
		this.stopRec();
	}
}

/**
 *　音声認識スタート
 */
speechClass.prototype.sttRec=function(){
	this.recFlg=true;
	var self=this;
	window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
	this.rec = new webkitSpeechRecognition();
	this.rec.lang = 'ja';
	this.rec.interimResults = true;
	this.rec.continuous = true;
	//認識不可
	this.rec.onnomatch = function() {if(self.recNomatch!=null){self.recNomatch();}};
	//認識エラー
	this.rec.onerror = function() {if(self.recError!=null){self.recError();}};
	//音声停止
	this.rec.onsoundend = function() {if(self.recStop!=null){self.recStop();}};
	//認識完了
	this.rec.onend = function() {if(self.recEnd!=null){self.recEnd();}};
	//認識結果
	this.rec.onresult = function(e){
        for (var i = e.resultIndex; i < e.results.length; ++i) {
        	//認識中の状態をセット
    		if(self.recoding!=null){
    			self.recoding(e.results[e.resultIndex][0].transcript);
    		}
    		//最終結果
            if (e.results[i].isFinal) {
            	var str = e.results[i][0].transcript;
					self.activeSpeechFlg=true;
					if(self.activeOk!=null){
						self.activeOk(str);
					}
            }
        }
	};
	this.rec.start();
}


//音声認識停止
speechClass.prototype.stopRec=function(){
	this.recFlg=false;
	this.rec.stop();
}

//
speechClass.prototype.setActiveMsg=function(msg){
	this.activeMsg=msg;
}

speechClass.prototype.getActiveMsg=function(){
	return this.activeMsg;
}

speechClass.prototype.checkActiveSpeechFlg=function(flg){
	var flg =  flg || null;
	if(flg==null){
		return this.activeSpeechFlg;
	}
	this.activeSpeechFlg=flg;
	return this.activeSpeechFlg;
}


//==================================================================================================
//合成音声発話
//2017.08.02 iwagami
//==================================================================================================
speechClass.prototype.speakOnOff=function(){
	if (this.speakFlg == false) {
		if (!'SpeechSynthesisUtterance' in window) {
			setmsglog("発話機能には未対応の環境です");
			return;
		}else{
			this.speakFlg = true;
		}
	} else {
		this.speakFlg = false;
	}
}
/**
 *合成音声発話
 */
speechClass.prototype.speack=function(msg,rate,pitch,volume){
	var d = new $.Deferred;
	var self=this;
	if (this.speakFlg == false || msg == ""){
		return;
	}
	var synthes = new SpeechSynthesisUtterance(msg);
	synthes.lang = "ja-JP"		// 言語
	//synthes.voiceURI = 'native';
	synthes.rate =(rate!=null)?rate:1.2;	// 速度: 0.1～10.0
	synthes.pitch =(pitch!=null)?pitch:1;	// 音程: 0.0～2.0
	synthes.volume =(volume!=null)?volume:10;// 音量: 0.0～10
	// 発話実行
	speechSynthesis.speak(synthes);
	synthes.onstart = function(e) {
		//発話中は、音声認識をストップする。
		if (self.recFlg){
			self.stopRec();
		}
	};
	synthes.onend = function(e){
		d.resolve();
		//発話完了後は、音声認識を再スタートする。
		if (self.recFlg) {
			self.sttRec();
		}
	};
	return d.promise();
}
