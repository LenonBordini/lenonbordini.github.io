var Snake = (function($) {
    var body, field, interval, currentDir, newDir, snake, fieldSize, eated;

    var init = function() {
        body = $("body").empty();
        field = $("<table/>", { "class": "map" }).append($("<tbody/>"));
        currentDir = newDir = "R";
        snake = [];
        fieldSize = { maxRow: 15, maxCol: 15 };

        for (var l = 1; l <= fieldSize.maxRow; l++)
            field.append($("<tr/>").append(new Array(fieldSize.maxCol + 1).join("<td></td>")));
        body.append(field);

        var firstLine = field.find("tr:nth-child(1)");
        snake.push(
            firstLine.find("td:nth-child(1)").addClass("snake snake-tail"),
            firstLine.find("td:nth-child(2)").addClass("snake"),
            firstLine.find("td:nth-child(3)").addClass("snake snake-head")
        );
        
        $(window).trigger("resize");
        createFood();
        movement(300);
    }

    function createFood() {
        var fieldFood = field.find("td:not(.snake)");
        $(fieldFood[Math.floor((Math.random() * fieldFood.length))]).addClass("food");
    }

    function movement(speed) {
        clearInterval(interval);
        interval = setInterval(function() {
            var index = { 
                x: snake[snake.length - 1].parent().index() + 1, 
                y: snake[snake.length - 1].index() + 1 
            };

            switch (currentDir = newDir) {
                case "R":
                    index.y++;
                    if (index.y > fieldSize.maxCol) index.y = 1;
                    break;
                case "L":
                    index.y--;
                    if (index.y == 0) index.y = fieldSize.maxCol;
                    break;
                case "U":
                    index.x--;
                    if (index.x == 0) index.x = fieldSize.maxRow;
                    break;
                case "D":
                    index.x++;
                    if (index.x > fieldSize.maxRow) index.x = 1;
                    break;
            }

            if (snake[snake.length - 1].hasClass("food")) {
                snake[snake.length - 1].removeClass("food");
            } else {
                field.find(".snake-tail").removeClass("snake snake-tail");
                snake = snake.splice(1);
                snake[0].addClass("snake-tail");
                eated = false;
            }

            field.find(".snake-head").removeClass("snake-head");
            snake.push(field.find("tr:nth-child(" + index.x + ") td:nth-child(" + index.y + ")"));
            if (snake[snake.length - 1].hasClass("snake")) 
                clearInterval(interval);

            snake[snake.length - 1].addClass("snake snake-head");
            if (snake[snake.length - 1].hasClass("food")) {
                movement(speed > 100 ? speed - 10 : speed);
                createFood();
            }
        }, speed);
    }

    $(document).on("keydown", function(e) {
        switch (e.which) {
            case 68: // D|R
            case 39: if (currentDir != "L") newDir = "R"; break;
            case 65: // A|L
            case 37: if (currentDir != "R") newDir = "L"; break;
            case 87: // W|U
            case 38: if (currentDir != "D") newDir = "U"; break;
            case 83: // S|D
            case 40: if (currentDir != "U") newDir = "D"; break;
        }
    });

    $(window).resize(function() {
        var w = $(window).width() / fieldSize.maxCol,
            h = $(window).height() / fieldSize.maxRow,
            size = (w < h ? w : h) * (fieldSize.maxCol < fieldSize.maxRow ? fieldSize.maxCol : fieldSize.maxRow) + "px";

        field.css({ width: size, height: size });
    });

    return {
        init: init
    };
})(jQuery);
