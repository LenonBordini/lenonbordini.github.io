$(function() {
	$('.button-collapse').sideNav();

	$("#download").click(function () {
		window.open("js/jquery.comboBox.js");
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
});