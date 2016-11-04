var crud = (function () {
	//delete localStorage.grid; Teste WebHook
	if (!localStorage.grid)
		localStorage.grid = JSON.stringify([
		{ id: 1, nome: "João", idade: 20, endereco: "Rua 1", telefone: "(16) 3712-1000", email: "joao@email.com" },
		{ id: 2, nome: "Bruno", idade: 21, endereco: "Rua 2", telefone: "(16) 3712-2000", email: "bruno@email.com" },
		{ id: 3, nome: "Rafael", idade: 23, endereco: "Rua 3", telefone: "(16) 3712-3000", email: "rafael@email.com" },
		{ id: 4, nome: "Vinicius", idade: 24, endereco: "Rua 4", telefone: "(16) 3712-4000", email: "vinicius@email.com" },
		{ id: 5, nome: "Lenon", idade: 20, endereco: "Rua 5", telefone: "(16) 3712-5000", email: "lenon@email.com" },
		{ id: 6, nome: "Ricardo", idade: 54, endereco: "Rua 6", telefone: "(16) 3712-6000", email: "ricardo@email.com" },
		{ id: 7, nome: "Pires", idade: 36, endereco: "Rua 7", telefone: "(16) 3712-7000", email: "pires@email.com" },
		{ id: 8, nome: "Wagner", idade: 26, endereco: "Rua 8", telefone: "(16) 3712-8000", email: "wagner@email.com" },
		{ id: 9, nome: "Gustavo", idade: 42, endereco: "Rua 9", telefone: "(16) 3712-9000", email: "gustavo@email.com" },
		{ id: 10, nome: "Guilherme", idade: 18, endereco: "Rua 10", telefone: "(16) 3712-1001", email: "guilherme@email.com" }
	]);

	var updateGrid = function() {
		var grid = JSON.parse(localStorage.grid),
			tbody = document.querySelector("#grid tbody");

		if (!grid.length) {
			tbody.innerHTML = '<tr><td colspan="6" style="text-align: center">Nenhum registro cadastrado...</td></tr>';
			return;				
		}

		tbody.innerHTML = "";
		for (var i = 0; i < grid.length; i++)
			tbody.innerHTML += 
				'<tr data-id="' + grid[i].id + '" onclick="crud.openForm(' + grid[i].id + ')">' + 
					'<td>' + grid[i].nome + '</td>' +
					'<td style="text-align: center">' + grid[i].idade + '</td>' +
					'<td>' + grid[i].endereco + '</td>' +
					'<td>' + grid[i].telefone + '</td>' +
					'<td>' + grid[i].email + '</td>' +
					'<td>' + 
						'<button type="button" class="editar" onclick="crud.openForm(' + grid[i].id + ')"></button>' +
						'<button type="button" class="excluir" onclick="crud.deleteItem(' + grid[i].id + ')"></button>' +
					'</td>' +
				'</tr>';
	};

	var openForm = function (id) {
		if (!id) {
			utilities.hide("#divGrid", function () { utilities.show("#divDados"); });
			return;
		}

		var itemGrid = JSON.parse(localStorage.grid).filter(function (item) { return item.id == id; })[0];
		document.querySelector("#id").value = itemGrid.id;
		document.querySelector("#nome").value = itemGrid.nome;
		document.querySelector("#idade").value = itemGrid.idade;
		document.querySelector("#endereco").value = itemGrid.endereco;
		document.querySelector("#telefone").value = itemGrid.telefone;
		document.querySelector("#email").value = itemGrid.email;
		utilities.hide("#divGrid", function () { utilities.show("#divDados"); });
	};

	var closeForm = function () {
		utilities.detail(false);
		utilities.hide("#divDados", function () { 
			utilities.show("#divGrid"); 

			var inputs = document.querySelectorAll("#fieldsetForm input");
			for (var i = 0; i < inputs.length; i++)
				inputs[i].value = "";
		});
	};

	var updateItem = function () {
		var grid = JSON.parse(localStorage.grid),
			item = {
				id: document.querySelector("#id").value,
				nome: document.querySelector("#nome").value.trim().replace(/[ ]+/, " "),
				idade: document.querySelector("#idade").value.trim().replace(/[ ]+/, " "),
				endereco: document.querySelector("#endereco").value.trim().replace(/[ ]+/, " "),
				telefone: document.querySelector("#telefone").value.trim().replace(/[ ]+/, " "),
				email: document.querySelector("#email").value.trim().replace(/[ ]+/, " ")
			};

		//Validações
		var detail = utilities.detail;
		if (detail(!item.nome, "Nome é obrigatório", "nome") || detail(!/^[a-zA-Z ]{3,70}$/.test(item.nome), "Nome deve conter apenas letras e deve conter de 3 a 70 caracteres", "nome"))
			return false;
		if (detail(!item.idade, "Idade é obrigatório", "idade") || detail(!/^[\d]{1,2}$/.test(item.idade), "Idade deve ser um número entre 1 e 99", "idade"))
			return false;
		if (detail(!item.endereco, "Endereço é obrigatório", "endereco"))
			return false;
		if (detail(!/^\([\d]{2}\) ?[\d]{4,5}-[\d]{4}$/.test(item.telefone), "Telefone deve ter o formato \"(00) 00000-0000\"", "telefone"))
			return false;
		if (detail(!item.email, "E-Mail é obrigatório", "email") || detail(!/^[\w\d_\-\.]+@[\w\d_\-]+(\.[\w]{2,4}){1,3}$/.test(item.email), "E-Mail inválido. Verifique!", "email"))
			return false;

		if (!item.id) { //Cadastro
			item.id = grid.length ? grid[grid.length - 1].id + 1 : 1;
			grid.push(item);
		} else { //Edição
			var index = grid.indexOf(grid.filter(function (itemGrid) { return itemGrid.id == item.id; })[0]);
			grid[index] = item;
		}

		localStorage.grid = JSON.stringify(grid);
		updateGrid();
		closeForm();
		return false;
	};

	var deleteItem = function (id) {
		if (!confirm("Deseja realmente deletar este item?"))
			return;

		var grid = JSON.parse(localStorage.grid);
		grid = grid.filter(function (item) { return item.id != id; });
		localStorage.grid = JSON.stringify(grid);
		updateGrid();
	};

	return {
		updateGrid: updateGrid,
		openForm: openForm,
		closeForm: closeForm,
		updateItem: updateItem,
		deleteItem: deleteItem
	};
})();
