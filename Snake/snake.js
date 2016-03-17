(function () {
	var config = {
		browserWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
		browserHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
		ballSize: 100,
		velocity: 100,
		snake: [],
		peace: null
	};

	var random = function (min, max) {
		return Math.floor(Math.random() * (max || min)) + (max ? min : 0);
	};

	var randomColor = function (alpha) {
	    var randomColor = [];
	    for (var i = 0; i < 3; i++)
	        randomColor.push(random(1, 255));
		randomColor.push(alpha || 1);
	    return "rgba(" + randomColor.join(", ") + ")";
	};

	var createBall = (function create() {
		var div = document.createElement("div");
		var ballsLength = config.snake.length;
		div.id = ballsLength + 1;
		div.style.zIndex = 9999 - ballsLength;
		div.style.background = randomColor();
		div.style.width = div.style.height = config.ballSize + "px";
		div.style.top = random(0, config.browserHeight - config.ballSize) + "px";
		div.style.left = random(0, config.browserWidth - config.ballSize) + "px";

		document.getElementsByTagName("body")[0].appendChild(div);

		if (config.snake.length < 2) {
			config.snake.push(div);
			config.snake[0].style.display = "none";
			create();
		} else {
			div.className = "pulse";
			config.peace = div;
		}

		return create;
	})();

	String.prototype.getNumber = function () { return this.replace(/[^\d]+/, ""); };

	document.onmousemove = function (e) {
		config.snake[0].style.top = (e.clientY - 50) + "px";
		config.snake[0].style.left = (e.clientX - 50) + "px";

		var top = config.snake[1].offsetTop + (config.ballSize / 2), 
			left = config.snake[1].offsetLeft + (config.ballSize / 2);

		var y = +config.peace.style.top.getNumber(),
			x = +config.peace.style.left.getNumber(),
			peace = config.ballSize / 6;

		if ((top >= y + peace && top <= y + config.ballSize - peace) && 
			(left >= x + peace && left <= x + config.ballSize - peace)) {
			config.peace.className = config.peace.className.replace(/[pulse]/, "");
			config.snake.push(config.peace);
			createBall();
		}
	};

	setInterval(function () {
		for (var i = config.snake.length - 1; i >= 1; i--) {
			config.snake[i].style.top = config.snake[i - 1].style.top;
			config.snake[i].style.left = config.snake[i - 1].style.left;
		}
	}, config.velocity);

	setInterval((function rc() {
		document.getElementsByTagName("body")[0].style.background = randomColor(0.2);
		return rc;
	})(), 1500);
})();
