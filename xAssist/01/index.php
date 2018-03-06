<?php
$title="01.Speaker Recognition APIテスト";?>
<html>
	<head>
		<title><?php echo $title;?></title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
		<meta name="viewport" content="width=device-width,initial-scale=1.0, user-scalable=no">
		<meta http-equiv=”Pragma” content=”no-cache”>
		<meta http-equiv=”Cache-Control” content=”no-cache”>
		<script src="js/common/lib/jquery-3.2.1.min.js"></script>
		<script src="js/common/lib/recorder.js"></script>
		<script>
        $(function(){
			$("#record").click(function(){
				startRecording();
				});
			$("#export").click(function(){
				stopRecording();
				});
	    });
		  var audio_context;
		  var recorder;


  	  		function startUserMedia(stream) {
		    var input = audio_context.createMediaStreamSource(stream);
		    recorder = new Recorder(input);
		  }

		  function startRecording() {
		    recorder && recorder.record();
		  }

		  function stopRecording() {
		    recorder && recorder.stop();
		    createDownloadLink();
		    recorder.clear();
		  }

		  function createDownloadLink() {
		    recorder && recorder.exportWAV(function(blob) {
		      var url = URL.createObjectURL(blob);
		      var au = document.getElementById('audio');

		      au.controls = true;
		      au.src = url;

				var fd = new FormData();
				fd.append('fname', 'test.wav');
				fd.append('data', blob);
				$.ajax({
				    type: 'POST',
				    url: 'server/azureSpeaker.php',
				    data: fd,
				    processData: false,
				    contentType: false
				}).done(function(data) {
				       console.log(data);
				});
		    });
		  }
		  window.onload = function init() {
			    try {
			      window.AudioContext = window.AudioContext || window.webkitAudioContext;
			      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
			      window.URL = window.URL || window.webkitURL;
			      audio_context = new AudioContext;
			    } catch (e) {
			      alert('No web audio support in this browser!');
			    }

			    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
			      __log('No live audio input: ' + e);
			    });
			  }
	</script>
	</head>
	<body>
		<h1><?php echo $title;?></h1>
		音声を録音してSpeakerRecogntionに保存。
		<button id="record">録音</button>
		<button id="export">出力</button>
		<audio id="audio" controls></audio>
	</body>
</html>