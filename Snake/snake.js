var emojiSnake = (function () {
	var config = {
		body: document.body,
		browserWidth: function() { return Math.max(document.documentElement.clientWidth, window.innerWidth || 0) },
		browserHeight: function() { return Math.max(document.documentElement.clientHeight, window.innerHeight || 0) },
		snake: [],
		snakeTop: 0,
		snakeLeft: 0,
		peace: null,
		timeToCatch: 5000,
		intervalTimeToCatch: null,
		snakeFollow: null,
		checkCatch: null
	};

	var functions = {
		init: function () {
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

			playButton.onclick = function () {
			    document.getElementsByTagName("html")[0].className = "";

			    playButton.onclick = null;
				config.snake.push(playButton);
				config.snake[0].style.display = "none";

				var ball = functions.createBall(config.browserHeight() / 2 - 50, config.browserWidth() / 2 - 50);
				ball.style.background = playButton.style.background;
				config.snake.push(ball);

				functions.createBall();

				document.onmousemove = function (e) {
					config.snake[0].style.top = (e.clientY - 50) + "px";
					config.snake[0].style.left = (e.clientX - 50) + "px";

					config.snakeTop = config.snake[1].offsetTop + 50;
					config.snakeLeft = config.snake[1].offsetLeft + 50;
				};

				config.snakeFollow = setInterval(function () {
					for (var i = config.snake.length - 1; i >= 1; i--) {
						config.snake[i].style.top = config.snake[i - 1].style.top;
						config.snake[i].style.left = config.snake[i - 1].style.left;
					}
				}, 100);

				functions.checkCatch = setInterval(function () {
					var y = +config.peace.style.top.replace(/[^\d]+/, ""), 
						x = +config.peace.style.left.replace(/[^\d]+/, "");

					if (config.peace.className.indexOf("explode") == -1 && 
						(config.snakeTop >= y && config.snakeTop <= y + 90) && 
						(config.snakeLeft >= x && config.snakeLeft <= x + 90)) {
						config.peace.className = config.peace.className.replace("pulse", "");
						config.snake.push(config.peace);
						functions.createBall();
						functions.executeTimeToCatch(config.timeToCatch > 2000 ? config.timeToCatch - 100 : config.timeToCatch);
					}
				}, 100);

				functions.executeTimeToCatch(config.timeToCatch);
			};
		},

		stopGame: function () {
			document.onmousemove = null;
			clearInterval(config.snakeFollow);
			clearInterval(config.checkCatch);
			clearTimeout(config.intervalTimeToCatch);
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
				    alert("Game Over");
				    var explodeSnakeTimer = 500, explodeSnake = (function e() {
				        functions.explode(config.snake[config.snake.length - 1]);
				        config.snake.pop();

				        if (config.snake.length > 1) {
				            setTimeout(e, explodeSnakeTimer);
				            if (explodeSnakeTimer > 100)
				                explodeSnakeTimer -= 50;
				            return;
				        }

				        setTimeout(functions.init, 1000);
				    })();
				}, 800);
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
		init: functions.init
	};
})();
