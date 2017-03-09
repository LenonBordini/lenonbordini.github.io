(function ($) {
    $(function () {
        var types = ["success", "error", "warning", "info"];

        var message = (function () {
            var remove = function (messageContainer) {
                if (!messageContainer || !messageContainer.length)
                    return;

                messageContainer.data("options").id = null;
                messageContainer.slideUp(200, function () { messageContainer.remove(); });
            };

            var show = function (options) {
                //Tratando "default"
                options = {
                    id: options.id = options.id || new Date().getTime(),
                    target: options.target ? $(options.target) : options.target,
                    type: (options.type + "").toLowerCase().trim(),
                    condition: typeof (options.condition) === "undefined" ? true : !!options.condition,
                    message: Array.isArray(options.message) ? options.message : [options.message],
                    delay: typeof (options.delay) === "number" ? options.delay : 0
                };

                //Efetuando validações
                var error = function (m) { console.error("message: " + m); return false; }
                if (!options.target) return error("\"target\" is required.");
                if (!options.type) return error("\"type\" is required.");
                if (!options.message.length || options.message.some(function (m) { return !(m + "").trim(); })) return error("\"message\" is required.");
                if (!types.some(function (type) { return type === options.type; })) return error("\"type\" invalid. Expected values -> [" + types + "].");
                if (!(options.target = $(options.target)).length) return error("\"target\" not found.");

                if (options.type === "error") options.type = "clear";
                if (options.type === "success") options.type = "done";

                var messages = options.target.find(".message").filter(function () {
                    return $(this).data("options").message.some(function (mc) {
                        return options.message.some(function (m) { return mc == m; });
                    });
                });

                if (!options.condition) {
                    remove(messages);
                    return options.condition;
                }

                if (messages.length) {
                    var optionsContainer = messages.data("options");
                    if (optionsContainer.timeout)
                        clearTimeout(optionsContainer.timeout);
                    if (optionsContainer.delay)
                        messages.data("options").timeout = setTimeout(function () { remove(messages); }, optionsContainer.delay);

                    var pulse = messages.find(".pulse").removeClass("pulse");
                    setTimeout(function () { pulse.addClass("pulse"); }, 200);
                    return options.condition;
                }

                messages = $();
                for (var i = 0; i < options.message.length; i++) {
                    var messageIcon = $("<div/>", { "class": "message-ico pulse" }).html($("<i/>", { "class": "material-icons" }).text(options.type));
                    var messageContent = $("<div/>", { "class": "message-content" }).html($("<span/>").html(options.message[i]));

                    var messageContainer = $("<div/>", { "class": "message " + options.type });
                    messageContainer.append(messageIcon, messageContent).click(function () {
                        if (options.field)
                            $(options.field).focus();

                        remove($(this));
                    }).data("options", options);
                    messages = messages.add(messageContainer);
                }

                options.target.append(messages);
                setTimeout(function () { messages.find(".message-content").addClass("translate"); }, 10);

                if (options.delay)
                    messages.data("options").timeout = setTimeout(function () { remove(messages); }, options.delay);

                return options.condition;
            };

            return {
                show: show,
                remove: function (id) { remove($(".message").filter(function () { return $(this).data("options").id === id; })); }
            };
        })();

        function shortcutMessage(type, t, c, m, d) {
            return message.show({
                type: type,
                target: t,
                condition: c,
                message: typeof (m) === "string" || Array.isArray(m) ? m : c,
                delay: typeof (m) === "number" ? m : d
            });
        }

        $.fn.showMessage = function (options) { options.target = this; return message.show(options); };
        $.fn.removeMessage = function (id) { message.remove(id); };
        types.forEach(function (type) {
            $.fn[type + "Message"] = function (c, m, d) { return shortcutMessage(type, this, c, m, d); };
        });
    });
})(jQuery);
