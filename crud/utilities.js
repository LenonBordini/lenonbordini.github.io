var utilities = (function () {
	var detail = function (condition, message, field) {
		var divDetail = document.querySelector(".detail");
		if (!divDetail) {
			divDetail = document.createElement("div");
			divDetail.className = "detail hide";
			var body = document.querySelector("body");
			body.insertBefore(divDetail, body.firstChild);
		}

		if (!condition && divDetail.className.indexOf("hide") < 0) {
			divDetail.className += " hide";
			setTimeout(function () {
				if (divDetail.className.indexOf("hide") >= 0)
					divDetail.style.display = "none";
			}, 300);
		}

		if (condition) {
		 	divDetail.innerHTML = message;
 			divDetail.style.display = "block";
	 		setTimeout(function () {
	 			divDetail.className = divDetail.className.replace(/[ ]?hide[ ]?/, "");
 			}, 100);

		 	divDetail.onclick = undefined;
		 	if (field)
		 		divDetail.onclick = function () { 
		 			var input = document.querySelector("#" + field);
		 			input.focus();

		 			var transition = input.style.transition,
		 				boxShadow = input.style.boxShadow,
		 				border = input.style.border;

		 			input.style.transition = "box-shadow 0.3s, border 0.3s";
		 			input.style.boxShadow = "0 0 3px red";
	 				input.style.border = "1px solid red";

 					setTimeout(function () {
			 			if (transition) 
			 				input.style.transition = transition;
			 			input.style.boxShadow = boxShadow;
			 			input.style.border = border;
 					}, 1000);

		 			detail(false); 
		 		};
		}

		return condition;
	};

	var transition = function (opacity, selectorSection, time, callback) {
		if (typeof(time) == "function") {
			callback = time;
			time = 500;
		}

		time = time || 500;

		var section = document.querySelector(selectorSection);
		section.style.transition = "opacity " + (time / 1000) + "s";
		if (opacity) {
			section.style.opacity = 0;
			section.style.display = "block";	
		}
		setTimeout(function () {
			section.style.opacity = opacity;
		}, 100);

		setTimeout(function () {
			if (!opacity)
				section.style.display = "none";

			if (typeof(callback) == "function")
				callback();
		}, time);
	};

	var show = function (selectorSection, time, callback) {
		transition(1, selectorSection, time, callback);
	};

	var hide = function (selectorSection, time, callback) {
		transition(0, selectorSection, time, callback);
	};

	return {
		detail: detail,
		show: show,
		hide: hide
	};
})();
