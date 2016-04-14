var baseFunc = {
	addHander: function (obj, type, handler) {
		return obj.addEventListener ? obj.addEventListener(type, handler) : obj.attachEvent("on"+type, handler);
	}
	removeHander: function (obj, type, handler) {
		return obj.removeEventListener ? obj.removeEventListener(type, handler) : obj.detachEvent("on"+type, handler);		
	}
	getRandomNum: function (min, max) {
		return Math.random()*(max-min) + min;
	}
	getRandomColor: function () {
		var num = getRandomNum(0, 0xffffff).toString(16);
		return "#" + num;
	}
}

var Firework = function () {

};
Firework.prototype = {
	initialize: function (options) {
		this.fireworkLeft = options.fireworkLeft;
		this.fireworkTop = options.fireworkTop;
	},
	manul: function (event) {
		var event = event || window.event;
		this.fireworkLeft = event.clientX;
		this.fireworkTop = event.clientY;
		this.create(this.fireworkLeft, this.fireworkTop);
	},
	auto: function () {
		setInterVal(function () {
			this.fireworkTop = getRandomNum(100, document.documentElement.clientHeight-100);
			this.fireworkLeft = getRandomNum(100, document.documentElement.clientWidth-100)
			this.create(this.fireworkLeft, this.fireworkTop);
		}, 1000);
	},
	// 烟花上升动画
	create: function (paramX, paramY) {
		var upFW = document.createElement("div");
		// 烟花爆炸位置
		var top = document.documentElement.clientHeight;
		with(upFW.style) {
			positon = "absolute";
			left = paramX + "px";
			width = "4px";
			height = "45px";
			borderRadius = "2px";
			backgroundColor = getRandomColor();
		}
		document.body.appendChild(upFW);
		var upTimer = setInterval(function () {
			if (upFW.style.top === paramY + "px") {
				document.body.removeChild(upFW);
				clearInterval(upTimer);
			} else {
				top -= 10;
				upFW.style.top = top + "px";
			}
		}, 20);
	},
	// 烟花爆竹动画
	boomFW: function (paramX, paramY) {
		var len;
		var fwChips = [];
		navigator.userAgent.indexof("MSIE")>0 ? len=getRandomNum(20, 30) : len=getRandomNum(40, 50);
		for (var i=0; i<len; i++) {
			var chip = document.createElement("div");
			var speedX = getRandomNum(-20, 20);
			var speedY = getRandomNum(-20, 20);
			with (chip.style) {
				width = "4px";
				height = "4px";
				borderRadius = "2px";
				backgroundColor = getRandomColor();
			}
			chip.offsetLeft = paramX + speedX();
			chip.offsetTop = paramY + speedY();
			fwChips.push(chip);
		}
		var timer = setInterval(function () {
			
		}, 20)
}
window.onload = function () {

}