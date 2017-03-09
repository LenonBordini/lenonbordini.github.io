$(function() {
	$('.button-collapse').sideNav();
	$('select').material_select();

	//START DEVBOX - COMBOBOX
	$("#download").click(function () {
		window.open("js/jquery.devBox.comboBox.js");
	});

	$("#loadClients").click(function () {
		$("#comboExample1").comboBox({
			itens: [
				{ id: 1, name: "John", age: 20 },
				{ id: 2, name: "Steve", age: 25 },
				{ id: 3, name: "Bill", age: 19 },
				{ id: 4, name: "Brandon", age: 31 },
				{ id: 5, name: "Ryan", age: 27 }
			],
			value: "id",
			text: "{id} - {name} ({age})"
		});
	});

	var timeout;
	$("#githubAccount").keyup(function () {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(function () {
			$("#comboExample2").comboBox({
				url: "https://api.github.com/users/" + $("#githubAccount").val() + "/repos",
				value: "id",
				text: "{name} ({description})",
				defaultText: false
			});
		}, 1000);
	});

	$("#githubAccountEvent").keyup(function () {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(function () {
			$("#comboExample3").comboBox({
				url: "https://api.github.com/users/" + $("#githubAccountEvent").val() + "/repos",
				value: "id",
				text: "name",
				defaultText: "Select your repository!",
				onStart: function () { 
					$("#githubAccountInfo").val("Starting..."); 
				},
				onLoad: function (data) { 
					alert("Combo Loaded!");	
					console.log("Only repositories with bugs...");
					console.log(data);
				},
				onComplete: function () { 
					$("#githubAccountInfo").val("Finished!");
					setTimeout(function () {
						$("#githubAccountInfo").val("");
					}, 1000);
				},
				onError: function (xhr) { 
					alert("Some shit happened!"); 
					console.log(xhr.responseText);
				}
			});
		}, 1000);
	});
	//END DEVBOX - COMBOBOX

	//START DEVBOX - MESSAGE
	$("#downloadMessage").click(function () {
		window.open("devBoxMessage.rar");
	});

	$("#showMe1").click(function() {
		$("#handle1 > span").empty();
		$("#handle1").showMessage({
			//condition: (true: the message appears) | (false: the message hide) | (default true)
			message: "What the fucking are you doing man?",
			type: "error" // success|warning|info
			//delay: time for the message disappear (in milisseconds)
		});
	});
	$("#showMe2").click(function() {
		$("#handle2 > span").empty();
		$("#handle2").successMessage(new Date().getSeconds() % 2 == 0, "I appear only if the second is par");
	});
	$("#showMe3").click(function() {
		$("#handle3 > span").empty();
		$("#handle3").warningMessage("I'll find you, and I'll kill you!", 2000);
	});
	$("#tryYourSelf").click(function() {
		$("#handleTryYourSelf > span").empty();
		var type = +$("#type").val(),
			condition = $("#condition").is(":checked"),
			message = $("#message").val() || "Write something motherfu*$%!",
			delay = +$("#delay").val() || 0;

		switch (type) {
			case 0: $("#handleTryYourSelf").successMessage(condition, message, delay); break;
			case 1: $("#handleTryYourSelf").errorMessage(condition, message, delay); break;
			case 2: $("#handleTryYourSelf").warningMessage(condition, message, delay); break;
			case 3: $("#handleTryYourSelf").infoMessage(condition, message, delay); break;
			default: $("#handleTryYourSelf").errorMessage("You fucked with the code, bitch!"); break;
		}
	});
	//END DEVBOX - MESSAGE
});