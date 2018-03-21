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
		<script src="import.php"></script>
		<script>
			var name="";
			var rec=new recordClass();
		$(function(){
			rec.init(window,$("body"));


			//ユーザー登録
			$("#record").click(function(){
				rec.start();
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

		<h1><?php echo $title;?></h1>
		テスト
			<span class="loadDiv">
				<div></div><div></div>
				<div></div><div></div>
			</span>

		<h2>登録者</h2>
			<button id="update">更新</button>
			<table class="table">
				<thead>
					<tr>
						<th>ユーザー名</th>
						<th>AzureID</th>
					</tr>
				</thead>
				<tbody id="list">
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
		<h2>1.声を登録
		</h2>
			<ol>
				<li>ユーザ名を入力して録音ボタンを押す。</li>
				<li>録音は30秒以上の音声を登録すること</li>
			</ol>
			<br>
			ユーザー名:<input type="text" id="userName"/>
			<button id="record">録音</button>
			<button id="export">録音終了</button>
		<h2>2.声の主を認識</h2>
			なんか喋ってください。<br>
		<div></div>
			<button id="idenRecord">録音</button>
			<button id="idenExport">録音終了</button>
		<audio id="audio"></audio>
	</body>
</html>