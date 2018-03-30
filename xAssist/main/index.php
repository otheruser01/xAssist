<?php
$title="コールセンター";?>
<html>
	<head>
		<title><?php echo $title;?></title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
		<meta name="viewport" content="width=device-width,initial-scale=1.0, user-scalable=no">
		<meta http-equiv=”Pragma” content=”no-cache”>
		<meta http-equiv=”Cache-Control” content=”no-cache”>
		<script src="import.php"></script>
		<script>
			var name="";
			var rec=new recordClass();
			var speech= new speechClass();
			var chatBlock=new Array();
			var newChatBlock=$('<div id="newChatBlock"></div>');
		//音声入力の途中結果を書き出す。
		speech.actRecoding(function(result){
			$(newChatBlock).text(result);
			$("#chat").append(newChatBlock);
		});

		//音声入力結果の最終結果を書き出す
			speech.actActiveOk(function(result){
				nowChat=result;
				$("#chat").append('<div class="chatBlock">'+nowChat+'</div>');
				$("#newChatBlock").remove();
				speech.sttRec();
			});
		$(function(){
			rec.init(window,$("body"));
			//対応開始
			$("#callStart").click(function(){
				speech.sttRec();
				rec.start(
					function(myRec){
						var analyser = myRec.audio_context.createAnalyser();
						var timeDomain = new Float32Array(analyser.frequencyBinCount);
						myRec.audio_context.createMediaStreamSource(myRec.stream).connect(analyser);
						function animation(){
							analyser.getFloatTimeDomainData(timeDomain);
							var avg=0;
							for(var i=0; i<timeDomain.length; i++){
								avg+=Math.abs(timeDomain[i]);
							}
							avg=((avg/timeDomain.length)*1000)+10;
							if(avg>100){
								avg=100;
							}
							$(".wave").width(avg+"%");
							$(".wave").css({"top":-avg+"%"});
							requestAnimationFrame(animation);
						};
						animation();
				}
			);
			});

			//対応終了
			$("#callEnd").click(function(){

			});

			$("#export").click(function(){
				rec.appendFormData("mode", "insAndAdd");
				rec.end();
				updateList();
			});

			//ユーザー検索
			$("#idenRecord").click(function(){
				rec.start();
			});
			$("#idenExport").click(function(){
				rec.appendFormData("mode", "search");
				rec.end();
			});


			$("#userName").change(function(){
				rec.appendFormData("name",$(this).val());
			});

			//ユーザーリスト更新
			$("#update").click(function(){
				updateList();
			});
			//リスト表示
			function updateList(){
				$("#list *").remove();
				var fd = new FormData();
				fd.append("mode","list");
				$.ajax({
				    type: 'POST',
				    url: "server/azureSpeaker.php",
				    data: fd,
				    processData: false,
				    contentType: false
				}).done(function(data) {
					var str="";
					var arr=JSON.parse(data);
					for(var key in arr){
						str+="<tr><td>"+arr[key]["name"]+"</td><td>"+key;
						str+='<input class="apiKeys" type="hidden" value="'+key+'"/>';
						str+="</td></tr>";
					}
					$("#list").append(str);
			       console.log(data);
				});
			}
			updateList();
	    });
	</script>
	</head>
	<body>
	<header>
		<?php echo $title;?>
	</header>
	<nav>
		<div id="callTop">
			<button id="callStart">対応開始</button>
			<div id="audioBlock"><div class="wave"></div></div>
			<button id="callEnd">対応完了</button>
		</div><br>
		<div id="chat">
		</div>
	</nav>
	<article>


	</article>

		<audio id="audio"></audio>
	</body>
</html>