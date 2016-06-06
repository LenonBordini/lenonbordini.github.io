$(function () {
    var randomColor = function () {
        var randomColor = [];
        for (var i = 0; i < 3; i++)
            randomColor.push(Math.floor(Math.random() * 255) + 1);
        return "rgb(" + randomColor.join(", ") + ")";
    };

    $("body").css("background", randomColor());

    var gameEngine = (function () {
        var _lines = 10,
            _columns = 10,
            _mines,
            _intervalWin,
            _key = [];

        var Field = function (line, column, sizeField) {
            return $("<button/>", {
                "class": "field",
                "style": "width: " + sizeField + "; height: " + sizeField
            }).data({
                "line": line,
                "column": column,
                "mine": false
            });
        };
        var getField = function (line, column) {
            var field;
            $(".field").each(function () {
                if ($(this).data("line") == line && $(this).data("column") == column) {
                    field = $(this);
                    return;
                }
            });
            return field;
        };
        var generateMines = function (percentageMines) {
            _mines = _lines * _columns / 100 * (percentageMines || 20);

            var random = function (max) { return Math.floor(Math.random() * max); };

            while (_mines > 0) {
                var field = getField(random(_lines), random(_columns));

                if (field.data("mine")) continue;

                field.data("mine", true);
                _mines--;
            }
        };
        var allMinesFound = function () {
            var mines = $(".field").filter(function () {
                return $(this).data("mine");
            });
            var minesFound = mines.filter(function () {
                return $(this).hasClass("mineFound");
            });
            return mines.length == minesFound.length;
        };
        var allFieldsClean = function () {
            var fieldsClean = $(".field").filter(function () {
                return !$(this).data("mine");
            });
            var fieldsCleanFound = fieldsClean.filter(function () {
                return $(this).hasClass("disabled");
            });
            return fieldsClean.length == fieldsCleanFound.length;
        };
        var backToStart = function (message) {
            if (message) alert(message);
            $(".field").prop("disabled", true);
            $(".playScreen").removeClass("closed");
        };

        var prepareField = function (length, percentageMines) {
            clearInterval(_intervalWin);
            $(".mineCamp").removeClass("rotate").empty();
            $(".field").removeClass("rotate-h");

            _lines = length;
            _columns = length;

            for (var l = 0; l < _lines; l++) {
                var line = $("<div/>"),
                    sizeField = (100 / (_lines > _columns ? _lines : _columns)) + "%";

                for (var c = 0; c < _columns; c++)
                    line.append(new Field(l, c, sizeField));

                $(".mineCamp").append(line);
            }

            $(window).trigger("resize");
            generateMines(percentageMines);

            $(".playScreen").addClass("closed");
        };
        var fieldsSiblings = function (f) {
            var siblings = [];
            for (var l = f.data("line") - 1; l <= f.data("line") + 1; l++)
                for (var c = f.data("column") - 1; c <= f.data("column") + 1; c++)
                    if (l != f.data("line") || c != f.data("column"))
                        siblings.push(getField(l, c));
            return siblings;
        };
        var minesArround= function (field) {
            var siblings = fieldsSiblings(field);
            var mines = siblings.filter(function (f) { return $(f).data("mine"); }).length;
            if (mines) return mines;

            siblings.forEach(function (s) {
                if (!$(s).is(":disabled"))
                    $(s).trigger("mousedown");
            });
        };
        var winnerPlayer = function () {
            if (allMinesFound() && allFieldsClean()) {
                backToStart("You WIN!");
                $(".mineCamp").addClass("rotate");
                $(".field").addClass("rotate-h");
                _intervalWin = setInterval(function () {
                    $("body").css("background", randomColor());

                    $(".field.mineFound").each(function () {
                        $(this).css("background", "linear-gradient(" + randomColor() + ", " + randomColor() + ")");
                    });
                }, 200);
            }
        };
        var gameOver = function () {
            var colorBody = $("body").css("background");
            $("body").css("background", "#ff0000");
            setTimeout(function () {
                $("body").css("background", colorBody);
            }, 700);
            backToStart();
        };
        var fieldHelp = function (f, key) {
            $("*[class*='sibling'").removeClass("sibling1 sibling2 sibling3 sibling4 sibling5 sibling6 sibling7 sibling8");
            if (key)
                gameEngine.fieldSiblings(f).forEach(function (item, i) {
                    $(item).addClass("sibling" + (i + 1));
                });
        };
        var password = function (key) {
            _key.push(key);

            if (_key.join(".").indexOf("104.97.99.107") >= 0) {
                _key = [];
                alert("Hack ON");
                $(".field").each(function () {
                    if ($(this).data("mine"))
                        $(this).addClass("mineFound");
                });
            } else if (_key.length > 10) _key.splice(0, 5);
        };

        return {
            prepareField: prepareField,
            minesArround: minesArround,
            fieldSiblings: fieldsSiblings,
            winnerPlayer: winnerPlayer,
            gameOver: gameOver,
            fieldHelp: fieldHelp,
            password: password
        };
    })();

    $(document).on('contextmenu', function () { return false; });

    $("#formPlayGame").submit(function () {
        gameEngine.prepareField($("#length").val());
        return false;
    });

    $(window).resize(function () {
        var body = document.getElementsByTagName('body')[0],
            height = body.clientHeight,
            width = body.clientWidth,
            size = (height > width ? width : height) + "px";
        $(".mineCamp").css({ "width": size });
    });

    $(document).on("mousedown", ".field:not(.mineFound, .disabled)", function (e) {
        if (e.button != 0 && !e.isTrigger)
            return;

        $(this).addClass("disabled").removeClass("doubts");

        if ($(this).data("mine")) {
            $(this).addClass("mine");
            gameEngine.gameOver();
            return;
        }

        var minesArround = gameEngine.minesArround($(this));
        if (minesArround) $(this).addClass("has" + minesArround);

        gameEngine.winnerPlayer();
    });
    $(document).on("contextmenu", ".field:not(.disabled)", function () {
        var field = $(this);
        switch (true) {
            case field.hasClass("mineFound"):
                field.removeClass("mineFound").addClass("doubts");
                break;
            case field.hasClass("doubts"):
                field.removeClass("doubts").removeClass("mineFound doubts");
                break;
            default:
                field.addClass("mineFound");
                break;
        }

        gameEngine.winnerPlayer();
    });
    $(document).on("mousemove", ".field", function (e) {
        gameEngine.fieldHelp($(this), e.ctrlKey);
    });
    $(document).on("keydown keyup", function (e) {
        gameEngine.fieldHelp($(".field:hover"), e.ctrlKey);
    }).on("keypress", function (e) {
        gameEngine.password(e.which);

        switch (e.which) {
            case 99: $("body").css("background", randomColor()); return;
            case 114: $("#formPlayGame").trigger("submit"); return;
            case 109: $('.playScreen').toggleClass('closed'); return;
            default: return;
        }
    });
});
