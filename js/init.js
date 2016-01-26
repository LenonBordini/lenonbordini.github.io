(function($){
    $(function(){
        $('.button-collapse').sideNav();
        $('.parallax').parallax();

        $("#githubAccount").keyup(function () {
            if (timeout)
                clearTimeout(timeout);

            var timeout = setTimeout(function () {
                $("#repos").comboBox({
                    url: "https://api.github.com/users/" + $("#githubAccount").val() + "/repos",
                    value: "id",
                    text: "{name} ({description})",
                    onError: function (xhr) {
                        $("#repos").html(new Option(JSON.parse(xhr.responseText).message, ""));
                    }
                });
            }, 1000);
        });

        $("#loadClients").click(function () {
            $("#clients").comboBox({
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
    });
})(jQuery);
