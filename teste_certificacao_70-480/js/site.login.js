window.login = (function () {
    var init = function() {
        if (sessionStorage.idUser)
            location.href = "home.html";
    };

    var submit = function (form) {
        var pw = form.password.value;
        if (!form.username.value.trim() || !pw) {
            site.warning("Inform the username and password");
            return;
        }

        site.ajax({
            method: "POST", 
            url: "login",
            data: {
                username: form.username.value,
                password: pw
            },
            success: function(data) {
                sessionStorage.idUser = JSON.parse(data);
                location.href = "home.html";
            }
        });
    };

    var submitNew = function (form) {
        if (form.new_username.value.length < 7 || form.new_username.value.length > 20) {
            site.warning("Username must be 8 to 20 characters");
            return;
        }

        var pw = form.new_password.value;
        if (pw.indexOf(" ") >= 0) {
            site.warning("Password cannot contain white spaces");
            return;
        }
        if (pw.length < 7 || pw.length > 20) {
            site.warning("Password must be 8 to 20 characters");
            return;
        }
        if (passwordLevel(form.new_password) <= 1) {
            site.warning("Password cannot be low. Use characters uppercase, lowercase, number and even special characters");
            return;
        }
        if (pw != form.new_password_confirm.value) {
            site.warning("Password is diferent from Confirm Password");
            return;
        }

        site.ajax({
            method: "POST", 
            url: "user",
            data: {
                username: form.new_username.value,
                password: pw
            },
            success: function(data) {
                site.success("New user created successfully");
                cardLogin(function() {
                    $("[name='username']").value = form.new_username.value;
                    $("[name='password']").value = "";
                    $("[name='password']").focus();
                });
            }
        });
    };

    var cardNewUser = function() {
        site.toogleCards('login', 'newUser', 400, function() {
            $("[name='new_username']").focus();
        });
    };

    var cardLogin = function(callback) {
        site.toogleCards('newUser', 'login', 400, function() {
            $("[name='username']").focus();
            if (typeof callback === "function")
                callback();
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
        init: init,
        submit: submit,
        submitNew: submitNew,
        cardNewUser: cardNewUser,
        cardLogin: cardLogin,
        passwordLevel: passwordLevel
    };
})();
