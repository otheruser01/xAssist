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
		<link rel="stylesheet" type="text/css" href="css/main.css">
		<script src="js/common/lib/jquery-3.2.1.min.js"></script>
		<script src="js/common/lib/recorder.js"></script>
		<script>
		var name="";
        $(function(){
			$("#record").click(function(){
				startRecording();
				});
			$("#export").click(function(){
				name=$("#name").val();
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
				$()
		      au.controls = true;
		      au.src = url;

				var fd = new FormData();
				fd.append('fname', 'test.wav');
				fd.append('data', blob);
				fd.append('mode', "search");
				fd.append('name', name);
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

			<div class="loadDiv">
				<div class="load1"></div>
				<div class="load2"></div>
				<div class="load3"></div>
				<div class="load4"></div>
		</div>
		<h2>登録者</h2>
			<table class="table">
				<thead>
					<tr>
						<th>ユーザー名</th>
						<th>AzureID</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>a</td>
						<td>b</td>
					</tr>
					<tr>
						<td>c</td>
						<td>d</td>
					</tr>
				</tbody>
				<tfoot>
				</tfoot>
			</table>
		<h2>1.声を登録</h2>
			<ol>
				<li>ユーザ名を入力して録音ボタンを押す。</li>
				<li>録音は30秒以上の音声を登録すること</li>
			</ol>
			<br>
			ユーザー名:<input type="text" id="userName"/>
			<button id="record">録音</button>
		<h2>2.声の主を認識</h2>
			なんか喋ってください。<br>
		<button id="export">認識開始</button>
		<div></div>
	</body>
</html>