window.onload = function () {
	var pictureList = document.querySelector(".picture-list");
	var gameZone = document.querySelector(".game-zone")
	var images = document.getElementsByClassName("images");
	var doImage = document.getElementById("doImage");
	var btn = document.getElementById("btn");
	// 兼容IE
	var getTarget = function (event) {
		return event.target || event.srcElement;
	}
	var getEvent = function (e) {
		return e || window.event;
	}
	function addEventHandler (ele, type, handler) {
		if (ele.addEventListener) {
			ele.addEventListener(type, handler);
		} else if (ele.attachEvent) {
			ele.attachEvent("on"+type, handler);
		} else {
			ele["on"+type] = handler;
		}
	}
	function removeEventHandler (ele, type, handler) {
		if (ele.removeEventListener) {
			ele.removeEventListener(type, handler);
		} else if (ele.dettachEvent) {
			ele.dettachEvent("on"+type, handler);
		} else {
			ele["on"+type] = null;
		}
	}
	// 随机排序 
	function randomSort (num) {
		var arr1 = [];
		for (var i=0; i<num; i++) {
			arr1[i] = i+1;
		}
		var arr2 = [];
		for (var j=0; j<num; j++) {
			arr2.push(arr1.splice(Math.random()*arr1.length, 1));
		}
		return arr2;
	}
	// arr:随机数列 index: 选择的游戏图片序号
	function geneRandomPicsList (arr, index) {
		var ul = document.createElement("ul");
		for (var i=0; i<arr.length; i++) {
			var li = document.createElement("li");
			li.className = "list";
			li.innerHTML = "<img src=\"./src/pic" + index + "/pic" + index+ "_" + arr[i] + ".png\" class=\"img-block\"/>";
			ul.appendChild(li);
		}
		return ul;
	}
	// 获取当前选择图片序号
	function getIndex () {
		for(var i=0 ;i<images.length; i++) {
			if (images[i].className.indexOf("on-image") > 0) {
				return i+1;
			}
		}
	}

	// 选择游戏图片事件
	addEventHandler (pictureList, "click", function (e) {
		var target = getTarget(e);
		if (target.tagName === "IMG" && target.className.indexOf("on-image") < 0) {
			for(var i=0; i<images.length; i++) {
				images[i].className = "images";
			}
			target.className += " on-image";
			if (document.getElementById("doImage")) {
				document.getElementById("doImage").setAttribute("src", target.getAttribute("src"));
			} else {
				var img = document.createElement("img");
				img.setAttribute("src", target.getAttribute("src"));
				img.id = "doImage";
				gameZone.innerHTML = "";
				gameZone.appendChild(img);
			}
			
		}
	});

	 
	// 获取坐标
	function getPosition (object) {
		var left = 0, top=0;
		while (object) {
			left += object.offsetLeft;
			top += object.offsetTop;
			object = object.offsetParent;
		}
		return {x: left, y: top};
	}
	// 照片交换动画
	function move (ele, startX, startY, endX, endY) {
		var gapX = endX - startX;
		var gapY = endY - startY;
		var flagX = false, flagY = false;
		var timeX = setInterval(function() {
			if (gapX>0) {
				gapX--;
				if (!ele.style.left) {ele.style.left = "0px"};
				tempa = parseInt(ele.style.left.replace(/px/, "")) + 1;
				ele.style.left = tempa + "px";
			} else if(gapX<0) {
				gapX++;
				if (!ele.style.left) {ele.style.left = "0px"};
				tempa = parseInt(ele.style.left.replace(/px/, "")) - 1;
				ele.style.left = tempa + "px";
			} else {
				if (!ele.style.left) {ele.style.left = "0px"};
				clearInterval(timeX);
 			}
		} ,1);
		var timeY = setInterval(function() {
			if (gapY>0) {
				gapY--;
				if (!ele.style.top) {ele.style.top = "0px"};
				temp = parseInt(ele.style.top.replace(/px/, "")) + 1;
				ele.style.top = temp + "px";
			} else if(gapY<0) {
				gapY++;
				if (!ele.style.top) {ele.style.top = "0px"};
				temp = parseInt(ele.style.top.replace(/px/, "")) - 1;
				ele.style.top = temp + "px";
			} else {
				if (!ele.style.top) {ele.style.top = "0px"};
				clearInterval(timeY);
			}
		} ,1);
	}

	// 初始化图片
	function initial (ele) {
		ele.style.opacity = "";
		ele.style.left = "";
		ele.style.top = "";
		ele.style.zIndex = "";
	}
	// 判断是否拼图成功
	function isSuccess(index) {
		var images = document.getElementsByClassName("img-block");
		for (var i=1; i<=images.length; i++) {
			if (images[i-1].src.indexOf("pic"+index+"/pic"+index+"_"+i) < 0) {
				console.log(i-1);
				return false;
			}
		}
		return true;
	}
	// 判断是否超界 
	function isInGamezone (relaPosX, relaPosY) {
		if (relaPosX>=70 && relaPosY>=40 && relaPosX<=640 && relaPosY<=370 ) {
			return true;
		} else {
			return false;
		}

	}
	
	// 游戏区容器的坐标
	
	btn.onclick = function () {
		// 第index张游戏图片
		var index = getIndex();
		var randArr = randomSort(25);
		var ul = geneRandomPicsList(randArr, index);
	
		gameZone.innerHTML = "";
		gameZone.appendChild(ul);
		// 阻止拖拽图片在新窗口打开
		for(i in document.images) document.images[i].ondragstart = function() {return false}; 

		var handleMousedown = function (e) {
			// while (getTarget(e).tagName !== "IMG");
			console.log("mousedown");
			var srcEle = getTarget(e);
			// 鼠标与容器的间隙
			var offsetX = e.offsetX;
			var offsetY = e.offsetY;
			var position = getPosition(srcEle);
			var temp = 0;
			var mouX = e.pageX;
			var mouY = e.pageY;
			var gameZonePos = getPosition(gameZone);
			var relaPosX = mouX - offsetX - gameZonePos.x + 71;
			var relaPosY = mouY - offsetY - gameZonePos.y + 41;
			// 判断是否触发mousemove的bug
			var moveFlag = false;
			// 
			var li = [];
			var image = [];
			srcEle.style.zIndex = 3;
			// 获取每一项
			for (var i=0; i<randArr.length; i++) {
				li[i] = document.getElementsByClassName("list")[i];
				image[i] = document.getElementsByClassName("img-block")[i];
			}
			// mousmove
			var dx = 0;
			var dy = 0;
			var handleMousemove = function(eve) {
				// if (isInGamezone(eve, gameZonePos)) {
				console.log("mousemove");
				var target = getTarget(eve);
				var mouseX = eve.pageX;
				var mouseY = eve.pageY;
				if (isInGamezone(relaPosX, relaPosY)) {
					dx = mouseX - position.x - offsetX;
					dy = mouseY - position.y - offsetY;
					relaPosX = mouseX - offsetX - gameZonePos.x + 71;
					relaPosY = mouseY - offsetY - gameZonePos.y + 41;
					var num = (Math.ceil(relaPosY/82)-1)*5 + Math.floor(relaPosX/142);
					moveFlag = true;
					console.log(num);
				} else {
					console.log("not in zoo");
					for(var i=0; i<image.length; i++) {
						if (image[i] === srcEle) {
							console.log(i);
							var num = i;
						}
					}
				}
				srcEle.style.cursor = "move";
				eve.preventDefault();
				srcEle.style.left = dx + "px";
				srcEle.style.top = dy + "px";
				if (temp !== num) {
					li[temp].style.opacity = 1;
					li[temp].style.border = "";
					li[num].style.opacity = 0.6;
					li[num].style.border = "1px solid red";
					temp = num;
				}
				// }
			}
			addEventHandler(ul, "mousemove", handleMousemove);
			// mouse up
			var handleMouseup = function (eve) {
				console.log("mouseup");
				// 防止交换动画时触发mousedown 和 mousemove
				removeEventHandler(ul, "mousedown", handleMousedown);
				removeEventHandler(ul, "mousemove", handleMousemove);
				console.log("remove mousemove");
				if (moveFlag == true) {
					srcEle.style.cursor = "";
					var posX  = temp%5*142 + 71;
					var posY  = Math.floor(temp/5)*82 + 41;
					move(srcEle ,relaPosX, relaPosY, posX , posY);
					var forwardPosX = position.x-gameZonePos.x + 71;
					var forwardPosy = position.y-gameZonePos.y + 41;
					move(image[temp], posX, posY, forwardPosX, forwardPosy);
					var t = setInterval(function() {
						var flag1 = (srcEle.style.left === (posX-(position.x-gameZonePos.x)-71) + "px");
						var flag2 = (srcEle.style.top  === (posY-(position.y-gameZonePos.y) - 41) + "px");
						var flag3 = (image[temp].style.left === (forwardPosX-posX) + "px");
						var flag4 = (image[temp].style.top  === (forwardPosy-posY) + "px");
						if (flag1 && flag2 && flag3 && flag4) {
							var img = image[temp];
							var src = srcEle;
							var liSrc = srcEle.parentNode;
							// 把样式初始化(left top opactiy border ...)
							initial(src);
							initial(img);
							if (img !== src) {
								srcEle.parentNode.removeChild(srcEle);
								li[temp].removeChild(image[temp]);
								li[temp].appendChild(src);
							}
							liSrc.appendChild(image[temp]);
							li[temp].style.opacity = "";
							li[temp].style.border = "";
							clearInterval(t);
							if (isSuccess(index)) {
								alert("you win");
							} else {
								// removeEventHandler(ul, "mouseup", handleMouseup);
								// 交换动画完成后恢复mousedown事件
								addEventHandler(ul, "mousedown", handleMousedown);
							}

						}
					}, 100);
					// 防止交换动画过程中click触发mouseup
					removeEventHandler(ul, "mouseup", handleMouseup);
				} else {
					// 解决chrome 触发mousedown 后一定会触发mouseover的bug
					removeEventHandler(ul, "mousemove", handleMousemove);
					addEventHandler(ul, "mousedown", handleMousedown);
				}
			}
			addEventHandler(ul, "mouseup", handleMouseup);	
		}
		addEventHandler(ul, "mousedown", handleMousedown);
	
	}
}