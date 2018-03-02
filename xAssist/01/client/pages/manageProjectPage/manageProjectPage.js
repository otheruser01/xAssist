/**
* アップデート
*/
manageProjectPage =function(){
    this.url="";
    this.html=null;
    this.index=null;
    this.init();
    //ファイルクラス
    this.fileC=new fileClass();
}
inherits(manageProjectPage, pageParent);

manageProjectPage.prototype.init=function(){
    this.url="client/pages/manageProjectPage/manageProjectPage";
    this.html=null;
    this.index=null;
}

/**
 * イベント一覧
 */
manageProjectPage.prototype.event=function(){
    var self=this;
    //画面ロード時
    self.showInit();

    //新しいプロジェクトボタン
	$(this.html).find("#showNewProject").on("click",function(e){
		 $(self.html).find("#newProject").toggle();
		 if($(self.html).find("#newProject").css('display') == 'block'){
			 $(this).find("span").html("閉じる");
		 }else{
			 $(this).find("span").html("新しいプロジェクト");
		 }
	});

    //プロジェクト作成実行
	$(this.html).find("#create").on("click",function(e){
	    var ajax =new ajaxClass();
	    ajax.setUniData("redmineAuth");
	    ajax.setUser(self.index.ls.get("user"));
	    var newProjectName=$(self.html).find("#name").val();
	    var msgKey=self.index.addFooterMsg("プロジェクト["+newProjectName+"]作成中");
	    //初期設定チケットの取得
	    var newProjectTickets=new Array();
	    $( "input[name=newProjectTicket]:checked" ).each(function(index){
	    	newProjectTickets
	    		var tracker=$(this).closest("tr").find("th").text();
	    		var ticketName=$(this).next("label").text();
	    		var oneTicket=new Array(tracker,ticketName);
	    		newProjectTickets.push(oneTicket);
	    });
	    ajax.sendProgress("redmineManageProject",
    		{
    		"type":"new",
    		"name":$(self.html).find("#name").val(),
    		"identifier":$(self.html).find("#identifier").val(),
    		"parentID":$(self.html).find("#parentID").val(),
    		"newProjectTickets":newProjectTickets
    		},
    		function(cb){
    			//途中経過
    			self.index.progressFooterMsg(msgKey,"プロジェクト["+newProjectName+"]作成中",cb.data,cb.progress.cur,cb.progress.max);
    		}
    		).then(function(ret){
    			if(ret.res==0){
    				self.index.updateFooterMsg(msgKey,"プロジェクト["+newProjectName+"]作成完了しました。");
    				self.setProjectSelectBox();
    				$(self.html).find("#name").val("");
    				$(self.html).find("#identifier").val("");
    				$("input[name=newProjectTicket]:checked" ).prop('checked', false);
    				$(self.html).find("#newProject").hide();
    				$(self.html).find("#showNewProject").find("span").html("新しいプロジェクト");
    			}else{
    				self.index.updateFooterMsg(msgKey,ret.data);
    			}
    		});
		});
}

/**
 * 画面ロード時
 */
manageProjectPage.prototype.showInit=function(){
    var self=this;
    $(self.html).find("#newProject").hide();
    newProject
    //プロジェクト取得
    this.setProjectSelectBox();
}

/**
 * プロジェクトセレクトボックス設定
 */
manageProjectPage.prototype.setProjectSelectBox=function(){
    var self=this;
    var ajax =new ajaxClass();
    ajax.setUniData("redmineAuth");
    ajax.setUser(self.index.ls.get("user"));
    ajax.send("redmineGetProject","test").then(function(ret){
        if(ret.res==0){
        	var rm=new redmineClass();
        	rm.setProject(ret["data"]);
            var parts =new htmlPartsClass(self.html);
            parts.setSelectBox("#parentID",parts.convChildren(rm.getProjectChildren()));
            parts.addPreOption("#parentID","","なし");
            parts.changeOption("#parentID","");
            self.setProjectList();
        }
    });
}

manageProjectPage.prototype.setProjectList=function(){
    var self=this;
    var ajax =new ajaxClass();
    ajax.setUniData("redmineAuth");
    ajax.setUser(self.index.ls.get("user"));
    ajax.sendProgress("redmineManageProject",
		{"type":"getProjects"},
		function(cb){
			console.log(cb);
		}
		).then(function(ret){
			if(ret.res==0){
				$("#ProjectList").find("*").remove();
				console.log("リスト");
				console.log(ret.data);
				for(key in ret.data){
					var one=ret.data[key];
					var oneTable=$(self.html).find("#ProjectListTemp table").clone(true);
					$(oneTable).find(".projectMainTitle").text(one["name"]);
					$(oneTable).find(".projectIdentifier").val(one["identifier"]);
					$("#ProjectList").append($(oneTable));
					$("#ProjectList").append("<br>");
				}
				self.projectEvent($("#ProjectList"));
			}else{
			}
    });
}

manageProjectPage.prototype.projectEvent=function(projectList){
	$(projectList).find("*").off();
	var self=this;
	$(projectList).find(".deleteProjectBtn").on("click",function(e){
	    var ajax =new ajaxClass();
	    ajax.setUniData("redmineAuth");
	    ajax.setUser(self.index.ls.get("user"));
		var projectName= $(this).closest("td").find(".projectTitle").val();
		var projectIdentifier= $(this).closest("td").find(".projectIdentifier").val();
		return;

	    var msgKey=self.index.addFooterMsg("プロジェクト["+projectName+"]削除中");
	    ajax.sendProgress("redmineManageProject",
    		{
    		"type":"delete",
    		"deleteID":projectIdentifier,
    		},
    		function(cb){
    			//途中経過
    			//self.index.progressFooterMsg(msgKey,"プロジェクト["+projectName+"]削除中",cb.data,cb.progress.cur,cb.progress.max);
    		}
    		).then(function(ret){
    			if(ret.res==0){
    				self.index.updateFooterMsg(msgKey,"プロジェクト["+projectName+"]削除完了しました。");
    				self.setProjectSelectBox();
    			}else{
    				self.index.updateFooterMsg(msgKey,ret.data);
    			}
	    });
	});
}


GLOBAL_PAGE_ARRAY["manageProjectPage"]=new manageProjectPage();
