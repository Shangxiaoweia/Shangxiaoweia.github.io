function PinTuGame(id){
	var that = this;
	this.oBtn = document.getElementById(id);
	this.oTable = document.createElement('table');
	this.oTbody = document.createElement('tbody');
	this.aTd = null;
	this.aTdMsg = [];		//用于存储每个图片的信息
	this.num = 0;			//用于判断拼图是否完成
	this.oTable.cellSpacing = '0';
	
	this.createElem();		//初始化游戏界面
	this.oBtn.onclick = function(){
		for(var i = 0; i<that.aTd.length; i++){
			that.aTd[i].style.opacity = 1;	
		}
		this.innerHTML = '重新开始';
		that.aTd[that.aTd.length-1].style.opacity = 0;
		
		var iAlpha = 100;
		var sp = -10;
		var timer = setInterval(function(){
			iAlpha += sp;
			that.oTbody.style.opacity = iAlpha / 100;
	
			if(iAlpha <=0) { sp = -sp; that.randomElem();}
			if(iAlpha > 100) {clearInterval(timer) };
      	},15);	
		that.beginGame();	
	}
}
 
PinTuGame.prototype = {		//初始化游戏界面
	createElem: function(){
		for(var i =0; i<11; i++){
			var oTr = document.createElement('tr');
			for(var j =0; j<15; j++){
				var oTd = document.createElement('td');
				this.num ++;
				var tdMsg = {
					seq: this.num,
					bgPosition: -100*j+'px '+ -100*i+'px' 	
				};	
				this.aTdMsg.push(tdMsg);
				oTr.appendChild(oTd);
			}
			this.oTbody.appendChild(oTr);	
		}	
		this.oTable.appendChild(this.oTbody);
		document.body.appendChild(this.oTable);	
		
		this.aTd = this.oTbody.getElementsByTagName('td');
		for(var i = 0; i<this.aTd.length; i++){
			this.aTd[i].json = this.aTdMsg[i];
			this.aTd[i].style.backgroundPosition = this.aTd[i].json.bgPosition;
		}
	},
	randomElem: function(){    	//随机排序图片
		this.aTdMsg.sort(function (){
			return Math.random()-0.5;     
		});
		for(var i=0;i<this.aTd.length;i++){
			this.aTd[i].json = this.aTdMsg[i];
			this.aTd[i].style.backgroundPosition = this.aTd[i].json.bgPosition;
		}
	},
	beginGame: function(){		//开始游戏
		var that = this;
		var rows = this.oTbody.rows;
		for(var i =0; i<11; i++){
			for(var j =0; j<15; j++){
				rows[i].cells[j].Y = i;
				rows[i].cells[j].X = j;
				
				rows[i].cells[j].onclick = function(){
					var arr = [       //获取该图片的上右下左，四个方向的坐标
						[this.Y-1, this.X],
						[this.Y, this.X+1],
						[this.Y+1, this.X],
						[this.Y, this.X-1]	
					];	
					for(var i = 0; i<arr.length; i++){
						if( arr[i][0]<0 || arr[i][1]<0 || arr[i][0]>10 || arr[i][1]>14)continue;
						if( rows[arr[i][0]].cells[ arr[i][1] ].style.opacity == '0' ){
							
							rows[arr[i][0]].cells[ arr[i][1] ].style.opacity = 1;
							this.style.opacity=0;
	
							//与隐藏的td交换json对象
							var thisJson = this.json;
							this.json = rows[arr[i][0]].cells[ arr[i][1]].json;  
							rows[arr[i][0]].cells[arr[i][1]].json = thisJson;		
	
							//与隐藏的td交换bakcground-position
							this.style.backgroundPosition=this.json.bgPosition;
							rows[arr[i][0]].cells[arr[i][1]].style.backgroundPosition=rows[arr[i][0]].cells[arr[i][1]].json.bgPosition;	
						}
					}
					that.checkWin();
				};	
			}	
		}
	},
	checkWin: function(){		//检测游戏是否完成
		var aJson = [];
		for(var i = 0; i<this.aTd.length; i++){
			aJson.push(this.aTd[i].json.seq);
		}	
		for(var i = 0; i<aJson.length-1; i++){
			if(aJson[i]>aJson[i+1])return;	
		}
		for(var i = 0; i<this.aTd.length; i++){
			this.aTd[i].style.opacity = 1;	
		}
		alert('恭喜，胜利啦！');
		location.reload();  
	}	
}
