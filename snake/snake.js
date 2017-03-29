var emojiSnake = (function () {
	document.oncontextmenu = function () { return false; };

	var config = {
		body: document.body,

		browserWidth: function() { 
			var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
			return w >= 800 ? w : 800;
		},
		browserHeight: function() { 
			var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			return h >= 600 ? h : 600;
		},

		snake: [],
		snakeTop: 0,
		snakeLeft: 0,
		score: 0,

		peace: null,

		timeToCatch: 5000,
		intervalTimeToCatch: null,

		snakeFollow: null,
		checkCatch: null
	};

	var events = {
		playButtonClick: function () {
			document.getElementsByTagName("html")[0].className = "";

			this.className = this.className.replace("play", "");
		    this.onclick = null;
			this.innerHTML = "";

			config.snake[0].style.display = "none";

			var ball = functions.createBall(config.browserHeight() / 2 - 50, config.browserWidth() / 2 - 50);
			ball.style.background = this.style.background;
			ball.style.top = this.style.top;
			ball.style.left = this.style.left;
			config.snake.push(ball);

			functions.createBall();

			config.snakeFollow = setInterval(intervals.snakeFollow, 100);
			functions.checkCatch = setInterval(intervals.checkCatch, 100);
			functions.executeTimeToCatch(config.timeToCatch);

			//Score
			config.score = 0;
			var score = document.createElement("div");
			score.id = "score";
			score.className = "score";
			score.innerHTML = "SCORE: 0000";
			config.body.appendChild(score);

			//Timer
			functions.startTimer();
		},
		snakeMovement: function (e) {
			config.snake[0].style.top = (e.clientY - 50) + "px";
			config.snake[0].style.left = (e.clientX - 50) + "px";

			if (config.snake.length > 1) {
				config.snakeTop = config.snake[1].offsetTop + 50;
				config.snakeLeft = config.snake[1].offsetLeft + 50;
			}
		}
	};

	var intervals = {
		snakeFollow: function () {
			for (var i = config.snake.length - 1; i >= 1; i--) {
				config.snake[i].style.top = config.snake[i - 1].style.top;
				config.snake[i].style.left = config.snake[i - 1].style.left;
			}
		},
		checkCatch: function () {
			var y = +config.peace.style.top.replace(/[^\d]+/, ""), 
				x = +config.peace.style.left.replace(/[^\d]+/, "");

			if (config.peace.className.indexOf("explode") == -1 && 
				(config.snakeTop >= y && config.snakeTop <= y + 100) && 
				(config.snakeLeft >= x && config.snakeLeft <= x + 100)) {
				config.peace.className = config.peace.className.replace("pulse", "");
				config.snake.push(config.peace);
				config.score += 10;
				document.getElementById("score").innerHTML = "SCORE: " + ("0000" + config.score).substr(config.score.toString().length);
				functions.createBall();
				functions.startTimer();
				functions.executeTimeToCatch(config.timeToCatch > 2000 ? config.timeToCatch - 100 : config.timeToCatch);
			}
		}
	};

	var init = function () {
		//Background color
		setInterval((function rc() {
			config.body.style.background = functions.randomColor(0.2);
			return rc;
		})(), 1500);

		//Reset Scene
		config.body.innerHTML = "";
	    document.getElementsByTagName("html")[0].className = "initGame";
	    config.snake = [];
		functions.stopGame();

		//Button to Play
		var playButton = functions.createBall(config.browserHeight() / 2 - 50, config.browserWidth() / 2 - 50);
		playButton.className += " play";
		playButton.innerHTML = "PLAY!";

		config.snake.push(playButton);
		document.onmousemove = events.snakeMovement;

		playButton.onclick = events.playButtonClick;
	};

	var functions = {
		stopGame: function () {
			document.onmousemove = null;
			clearInterval(config.snakeFollow);
			clearInterval(config.checkCatch);
			clearTimeout(config.intervalTimeToCatch);
		},

		startTimer: function () {
			var timer = document.getElementById("timer");
			if (!timer) {
				timer = document.createElement("div");
				timer.id = "timer";
				timer.className = "timer";
				config.body.appendChild(timer);
				timer = document.getElementById("timer");
			}
			timer.style.background = functions.randomColor();
			timer.style.transition = "width 0s linear";
			timer.style.width = "100%";
			setTimeout(function () {
				var time = ((config.timeToCatch - 100) / 1000);
				timer.style.transition = "width " + time + "s linear, background " + time + "s linear";
				timer.style.width = "0%";
				timer.style.background = "#f00";
			}, 100);
		},

		explode: function (e) {
			var img = document.createElement("img");
			img.className = "explosion";
			img.style.top = e.style.top;
			img.style.left = e.style.left;
			config.body.appendChild(img);
			img.src = "explosion.gif?d=" + new Date().getTime();
			e.className = e.className.replace("pulse", "");
			e.className += " explode";

			setTimeout(function () {
				config.body.removeChild(e);
				config.body.removeChild(img);
			}, 800);
		},

		executeTimeToCatch: function (timeToCatch) {
			clearTimeout(config.intervalTimeToCatch);
			config.intervalTimeToCatch = setTimeout(function () {
			    functions.stopGame();
				functions.explode(config.peace);

				setTimeout(function () {
				    var explodeSnakeTimer = 500, explodeSnake = (function e() {
				        functions.explode(config.snake[config.snake.length - 1]);
				        config.snake.pop();

				        if (config.snake.length > 1) {
				            setTimeout(e, explodeSnakeTimer);
				            if (explodeSnakeTimer > 100)
				                explodeSnakeTimer -= explodeSnakeTimer / 8;
				            return;
				        }

				        setTimeout(init, 1000);
				    })();
				}, 1200);
			}, timeToCatch);
			config.timeToCatch = timeToCatch;
		},

		createBall: function (top, left) {
			var div = document.createElement("div");
			div.className = "ball";
			div.style.zIndex = 9999 - config.snake.length;
			div.style.background = functions.randomColor();
			div.style.top = (top || functions.random(0, config.browserHeight() - 100)) + "px";
			div.style.left = (left || functions.random(0, config.browserWidth() - 100)) + "px";

			if (!top && !left) {
				div.className += " pulse";
				config.peace = div;
			}

			config.body.appendChild(div);
			return div;
		},

		random: function (min, max) {
			return Math.floor(Math.random() * (max || min)) + (max ? min : 0);
		},

		randomColor: function (alpha) {
		    var randomColor = [];
		    for (var i = 0; i < 3; i++)
		        randomColor.push(functions.random(1, 255));
			randomColor.push(alpha || 1);
		    return "rgba(" + randomColor.join(", ") + ")";
		}
	};

	return {
		init: init
	};
})();
