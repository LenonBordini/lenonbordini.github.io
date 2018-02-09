window.site = (function () {
    var $ = function(selector, list) {
        var elements = document.querySelectorAll(selector);
        return elements.length > 1 || list ? elements : elements[0];
    };

    var toogleCards = function (card1, card2, time, callback) {
        card1 = $("#" + card1);
        card2 = $("#" + card2);
        time = time || 400;
        var transition = (time / 1000) + "s all linear";

        if (card1.toggle || card2.toggle)
            return;

        card1.toggle = card2.toggle = true;

        card2.style.display = "none";
        card2.style.transform = "rotateY(270deg)";

        card1.style.transition = transition;
        card1.style.transform = "rotateY(90deg)";

        setTimeout(function () {
            card1.style.display = "none";
            card2.style.display = "block";
            card2.style.transition = transition;
            setTimeout(function () {
                card2.style.transform = "rotateY(360deg)";
                setTimeout(function () {
                    card1.style.transition = card1.style.transform = card2.style.transition = card2.style.transform = "";
                    card1.toggle = card2.toggle = false;
                    if (typeof callback === "function")
                        callback();
                }, time);
            }, 50);
        }, time);
    };

    var toggleClass = function(element, $class) {
        var e = $(element),
            allClass = e.className.split(" ");
        if (allClass.filter(function(c) { return c == $class; }).length)
            allClass = allClass.filter(function(c) { return c != $class; })
        else
            allClass.push($class);
        e.className = allClass.filter(function(c) { return c; }).join(" ");
    };

    var toast = function() {
        var option = arguments[0];
        if (typeof arguments[0] !== "object")
            options = {};
        if (typeof arguments[0] === "string")
            options.message = arguments[0];
        if (typeof arguments[1] === "string")
            options.type = arguments[1].toLowerCase();
        if (typeof options.timer !== "number")
            options.timer = 3;

        function div($class) {
            var div = document.createElement("div");
            div.className = $class;
            return div;
        }

        var toastWrap = $("body div.toast-wrap");
        if (!toastWrap) {
            toastWrap = div("toast-wrap");
            $("body").prepend(toastWrap);
        }

        var toast = div("toast " + (options.type ? options.type : "default")),
            toastIcon = div("toast-icon"),
            toastMessage = div("toast-message"),
            toastClose = div("toast-close"),
            toastTimer = div("toast-timer");
      
        toastIcon.innerHTML = '<i class="material-icons">' + (
            options.type == "error" ? "error_outline" :
            options.type == "success" ? "check_circle" :
            options.type == "warning" ? "warning" : "info_outline") + '</i>';

        toastMessage.innerHTML = options.message;
        toastClose.innerHTML = "X";
        
        toast.appendChild(toastIcon);
        toast.appendChild(toastMessage);
        toast.appendChild(toastClose);
        toast.appendChild(toastTimer);

        toastTimer.style.transition = options.timer + "s width linear";
        var timeoutTimer = setTimeout(function() { toastTimer.style.width = 0; }, 10);

        function remove() {
            toast.style.opacity = 0;
            setTimeout(function() { toast.remove(); }, 500);
        }

        var timeoutRemove = setTimeout(remove, options.timer * 1000);
        toast.addEventListener("click", function() {
            clearTimeout(timeoutRemove);
            remove();
        });
        toast.addEventListener("mouseenter", function() {
            clearTimeout(timeoutTimer);
            clearTimeout(timeoutRemove);
            toastTimer.style.width = (toast.childNodes[3].offsetWidth * 100 / toast.offsetWidth) + "%";
        });
        toast.addEventListener("mouseleave", function() {
            var timer = +(toast.childNodes[3].offsetWidth * options.timer / toast.offsetWidth).toFixed(2);
            toastTimer.style.transition = timer + "s width linear";
            timeoutTimer = setTimeout(function() { toastTimer.style.width = 0; }, 10);
            timeoutRemove = setTimeout(remove, timer * 1000);
        });

        toastWrap.prepend(toast);
    };

    var modal = function(element, callback) {
        var modalWrap = document.createElement("div");
        modalWrap.className = "modal-wrap";

        var modal = document.createElement("div");
        modal.className = "modal";

        var modalClose = document.createElement("div");
        modalClose.className = "modal-close";
        modalClose.innerHTML = '<i class="material-icons">close</i>';

        var modalContent = document.createElement("div");
        modalContent.className = "modal-content";
        modalContent.innerHTML = $("#" + element).innerHTML;
        $("#" + element).innerHTML = "";
        modalContent.addEventListener("click", function(e) {
            e.stopPropagation();
        });

        modal.appendChild(modalClose);
        modal.appendChild(modalContent);
        modalWrap.appendChild(modal);

        $("body").prepend(modalWrap);
        setTimeout(function() { modalWrap.style.opacity = 1; }, 10);

        modalWrap.addEventListener("click", function() {
            modalWrap.style.opacity = 0;
            setTimeout(function() { 
                if (typeof callback === "function")
                    callback();
                $("#" + element).innerHTML = modalContent.innerHTML;
                modalWrap.remove();
            }, 300);
        });
    };
    var closeModal = function() {
        $(".modal-wrap").click();
    };

    var create = function(element, properties) {
        var e = document.createElement(element);
        for (var prop in properties) {
            if (prop == "style") {
                for (var style in properties.style)
                    e.style[style] = properties.style[style];
                continue;
            }

            e[prop] = properties[prop];
        }
        return e;
    };

    var ajax = function(options) {
        if (options.method == "GET" && options.data && Object.keys(options.data).length) {
            options.url += "?";
            var params = [];
            for (var prop in options.data)
                params.push(prop + "=" + options.data[prop]);
            options.url += params.join("&");
        }

        if (options.button) {
            if (options.button.disabled)
                return;
                
            options.button.disabled = true;
        }

        var xhttp = new XMLHttpRequest();
        xhttp.open(options.method, "https://watchlater.azurewebsites.net/api/" + options.url, true);

        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    if (typeof options.success === "function")
                        options.success(xhttp.responseText);
                } else {
                    if (typeof options.error === "function")
                        options.error(xhttp.responseText);
                    try {
                        var errors = JSON.parse(xhttp.responseText);
                        if (errors && errors.length)
                            for (var i = 0; i < errors.length; i++)
                                site.error(errors[i]);
                    } catch(e) { }
                }
                if (typeof options.complete === "function")
                    options.complete(xhttp.responseText);
                
                if (options.button)
                    setTimeout(function() { options.button.disabled = false; }, 100);
            }
        };

        xhttp.send((options.method == "POST" || options.method == "PUT") && options.data ? JSON.stringify(options.data) : undefined);
    };

    var removeClass = function(element, $class) {
        element.className = (element.className || "").split(" ").filter(function(c) { return c && c != $class; }).join(" ");
    };

    var addClass = function(element, $class) {
        var classes = (element.className || "").split(" ");
        if (classes.every(function(c) { return c != $class; }))
            classes.push($class);
        element.className = classes.join(" ").trim();
    };

    return {
        $: $,
        toogleCards: toogleCards,
        toggleClass: toggleClass,
        toast: toast,
        modal: modal,
        closeModal: closeModal,
        create: create,
        ajax: ajax,
        removeClass: removeClass,
        addClass: addClass,

        error: function(message) { toast(message, "error"); },
        warning: function(message) { toast(message, "warning"); },
        success: function(message) { toast(message, "success"); },
        info: function(message) { toast(message, "info"); }
    };
})();

window.$ = site.$;
