(function($){
  $(function(){

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

      var timeout;
      $("#githubAccount").keyup(function () {
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(function () {
              $("#repos").comboBox({
                  url: "https://api.github.com/users/" + $("#githubAccount").val() + "/repos",
                  value: "id",
                  text: "{name} ({description})"
              });
          }, 1000);
      });
  });
})(jQuery);