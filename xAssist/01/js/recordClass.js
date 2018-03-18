/**
* レコードクラス
*/
var recordClass =function(){
	this.rec =null;
	this.audio_context=new AudioContext;
	this.body=null;
	this.fd = new FormData();
	this.url="server/azureSpeaker.php";
}
/**
 * 初期化
 */
recordClass.prototype.init=function(window,body){
		var self=this;
		self.body=body;
    try {
    		window.AudioContext = window.AudioContext || window.webkitAudioContext;
    		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    		window.URL = window.URL || window.webkitURL;
    		self.audio_context = new AudioContext;
	    } catch (e) {}
	    navigator.getUserMedia({audio: true}, function(stream){
	    	var input = self.audio_context.createMediaStreamSource(stream);
	    	self.rec = new Recorder(input);
	    }, function(e) {},self);
}
/**
 *レコード開始
 */
recordClass.prototype.start=function(){

	this.rec && this.rec.record();
}
/**
 * レコード終了
 */
recordClass.prototype.end=function(){
	var self=this;
	self.rec && self.rec.stop();
	self.createDownloadLink();
    self.rec.clear();
}

/**
 *サーバへ移動
 */
recordClass.prototype.createDownloadLink=function(){
	var self=this;
	self.rec && self.rec.exportWAV(function(blob) {
		var url = URL.createObjectURL(blob);
	    var au = $(self.body).find("#audio")[0];
	    au.controls = true;
	    au.src = url;
		self.fd.append('fname', 'test.wav');
		self.fd.append('data', blob);
		$.ajax({
		    type: 'POST',
		    url: self.url,
		    data: self.fd,
		    processData: false,
		    contentType: false
		}).done(function(data) {
		       console.log(data);
		});
    });
}

recordClass.prototype.appendFormData=function(key,value){
	this.fd.append(key,value);
}

