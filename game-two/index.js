var baseFunc = {
	addHander: function (obj, type, handler) {
		obj.addEventListener ? obj.addEventListener(type, handler) : obj.attachEvent("on"+type, handler);
	},
	removeHander: function (obj, type, handler) {
		obj.removeEventListener ? obj.removeEventListener(type, handler) : obj.detachEvent("on"+type, handler);		
	},
	stopProppagation: function (event) {
		event.stopProppagation ? event.stopProppagation() : event.cancelBubble = true;
	},
	getRandomNum: function (min, max) {
		return parseInt(Math.random()*(max-min) + min);
	},
	getRandomColor: function () {
		var num = this.getRandomNum(0, 0xffffff).toString(16);
		return "#" + num;
	}
}

var Firework = function () {
	// this.initialize();
};
Firework.prototype = {
	initialize: function () {
		this.fireworkLeft = 0;
		this.fireworkTop = 0;
	},
	manul: function (event) {
		var event = event || window.event;
		this.fireworkLeft = event.clientX;
		this.fireworkTop = event.clientY;
		this.create(this.fireworkLeft, this.fireworkTop);
	},
	auto: function () {
		var that = this;
		var autoTimer = setInterval(function () {
			this.fireworkTop = baseFunc.getRandomNum(100, document.documentElement.clientHeight-100);
			this.fireworkLeft = baseFunc.getRandomNum(100, document.documentElement.clientWidth-100);
			that.create(this.fireworkLeft, this.fireworkTop);	
		}, 1500);
		return autoTimer;
	},
	// 烟花上升动画
	create: function (paramX, paramY) {
		var upFW = document.createElement("div");
		var boomFW = this.boomFW;
		// 烟花爆炸位置
		var clientHeight = window.innerHeight;
		with(upFW.style) {
			position = "absolute";
			left = paramX + "px";
			top = clientHeight + "px";
			width = "4px";
			height = "30px";
			borderRadius = "2px";
			backgroundColor = baseFunc.getRandomColor();
		}
		document.body.appendChild(upFW);
		var upTimer = setInterval(function () {
			if (clientHeight < paramY) {
				document.body.removeChild(upFW);
				boomFW(paramX, paramY);
				clearInterval(upTimer);
			} else {
				clientHeight -= 10;
				upFW.style.top = clientHeight + "px";
			}
		}, 10);
	},
	// 烟花爆炸动画
	boomFW: function (paramX, paramY) {
		var len;
		var fwChips = [], speedX = [], speedY = [];
		navigator.userAgent.indexOf("MSIE")>0 ? len=baseFunc.getRandomNum(20, 30) : len=baseFunc.getRandomNum(40, 50);
		for (var i=0; i<len; i++) {
			var chip = document.createElement("div");
			speedX.push(baseFunc.getRandomNum(-20, 20));
			speedY.push(baseFunc.getRandomNum(-20, 20));
			with (chip.style) {
				position = "absolute";
				width = "4px";
				height = "4px";
				left = paramX + speedX[i] + "px";
				top = paramY  + speedY[i] + "px";
				borderRadius = "2px";
				backgroundColor = baseFunc.getRandomColor();
			}
			document.body.appendChild(chip);
			fwChips[i] = chip;
		}
		var moveTimer = setInterval(function () {
			for (var j=0; j<fwChips.length; j++) {
				fwChips[j].style.left = fwChips[j].offsetLeft + speedX[j] + "px";
				fwChips[j].style.top = fwChips[j].offsetTop + speedY[j] + "px";
				// 加速下降或者减速上升
				speedY[j]++;
				(fwChips[j].offsetLeft < 0 || fwChips[j].offsetLeft > window.innerWidth ||
				fwChips[j].offsetTop < 0 || fwChips[j].offsetTop > window.innerHeight) && document.body.removeChild(fwChips[j]);
			}
		}, 30);
	}
}
window.onload = function() {
	var manulBtn = document.getElementById("manulFW");
	var autoBtn = document.getElementById("autoFW");
	var stopBtn = document.getElementById("stopFW");
	var body = document.querySelector("body");
	var firework = new Firework();
	var manulFlag = true, autoFlag = true;
	var autoTimer;
	body.style.height = window.innerHeight + "px";
	body.style.width = window.innerWidth + "px";
	var manulHandler = function (event) {
							firework.manul(event);
						};
	manulBtn.onclick = function (e) {
		baseFunc.stopProppagation(e);
		clearInterval(autoTimer);
		autoFlag = true;
		if (manulFlag) {
			manulFlag = false;
			baseFunc.addHander(body, "click", manulHandler);
		} 
	};
	autoBtn.onclick = function (e) {
		baseFunc.stopProppagation(e);
		manulFlag = true;
		if (autoFlag) {
			autoTimer = firework.auto();
			autoFlag = false;
		}
		baseFunc.removeHander(body, "click", manulHandler);
	}
	stopBtn.onclick = function (e) {
		baseFunc.stopProppagation(e);
		manulFlag = true;
		autoFlag = true;
		clearInterval(autoTimer);
		baseFunc.removeHander(body, "click", manulHandler);
	}
}