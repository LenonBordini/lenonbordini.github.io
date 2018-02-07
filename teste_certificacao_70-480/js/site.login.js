window.login = (function () {
    var submit = function (form) {
        var pw = form.password.value;
        if (!form.username.value.trim() || !pw) {
            site.warning("Inform the username and password");
            return;
        }

        if (form.username.value.toLowerCase() != "admin" || pw != "Admin123@") {
            site.error("Username and/or password invalids");
            return;
        }

        location.href = "home.html";
    };

    var submitNew = function (form) {
        var pw = form.password.value;
        if (pw.indexOf(" ") >= 0) {
            site.warning("Password cannot contain white spaces");
            return;
        }
        if (pw.length < 7 || pw.length > 20) {
            site.warning("Password must be 8 to 20 characters");
            return;
        }
        if (passwordLevel(form.password) <= 1){
            site.warning("Password cannot be low. Use characters uppercase, lowercase, number and even special characters");
            return;
        }
    };

    var cardNewUser = function() {
        site.toogleCards('login', 'newUser', 400, function() {
            $("[name='new_username']").focus();
        });
    };

    var cardLogin = function() {
        site.toogleCards('newUser', 'login', 400, function() {
            $("[name='username']").focus();
        });
    };

    var passwordLevel = function(pw, input) {
        pw = pw.value;
        var pwLevel = 0;

        if (pw.length) {
            if (/[a-z]+/.test(pw))
                pwLevel++;
            if (/[A-Z]+/.test(pw))
                pwLevel++;
            if (/[\d]+/.test(pw))
                pwLevel++;
            if (/[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]+/.test(pw))
                pwLevel++;
        }

        if (input) {
            input = $("[name='" + input + "']");
            input.className = "password-level l" + pwLevel;
            input.innerHTML = pwLevel == 1 ? "Low" : pwLevel == 2 ? "Medium" : pwLevel == 3 ? "Strong" : pwLevel == 4 ? "Very strong" : "";
        }
        return pwLevel;
    };

    return {
        submit: submit,
        submitNew: submitNew,
        cardNewUser: cardNewUser,
        cardLogin: cardLogin,
        passwordLevel: passwordLevel
    };
})();
