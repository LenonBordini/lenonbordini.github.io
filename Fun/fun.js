var randomColor = function (alpha) {
    var randomColor = [];
    for (var i = 0; i < 3; i++)
        randomColor.push(Math.floor(Math.random() * 255) + 1);
	randomColor.push(alpha || 1);
    return "rgba(" + randomColor.join(", ") + ")";
};

var divs = [], createDiv = (function c() {
	var div = document.createElement("div");
	div.style.background = randomColor();
	if (divs.length) {
		div.style.top = divs[divs.length - 1].style.top;
		div.style.left = divs[divs.length - 1].style.left;
	}

	divs.push(div);
	document.getElementsByTagName("body")[0].appendChild(div);

	for (var i = 0; i < divs.length; i++)
		divs[i].style.zIndex = (i * -1) + divs.length;

	return c;
})();

document.onmousemove = function (e) {
	divs[0].style.top = (e.clientY - 50) + "px";
	divs[0].style.left = (e.clientX - 50) + "px";
};
document.onclick = function () {
	createDiv();
};

var i = divs.length - 1;
setInterval(function () {
	if (divs.length == 1)
		return;

	if (i == 0)
		i = divs.length - 1;

	divs[i].style.top = divs[i - 1].style.top;
	divs[i].style.left = divs[i - 1].style.left;

	i--;
}, 1);

setInterval(function () {
	document.getElementsByTagName("body")[0].style.background = randomColor(0.5);
}, 500);
