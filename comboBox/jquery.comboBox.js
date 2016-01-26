(function () {
    var configuration = {
        loadingText: "Loading...",
        errorText: "Load Fail",

        defaultText: "Select",
        defaultValue: "",

        disableOnLoad: true,
        disableOnError: true,

        onStartAll: null,
        onLoadAll: null,
        onErrorAll: null,
        onCompleteAll: null
    };

    $.fn.comboBox = function (options) {
        var settings = $.extend({
            comboBox: $(this),
            value: "",
            text: "",

            itens: [],

            url: "",
            params: {},

            onStart: null,
            onLoad: null,
            onError: null,
            onComplete: null,

            defaultText: "",
            defaultValue: "",

            selectedValue: null
        }, options);

        settings.defaultValue = settings.defaultValue || configuration.defaultValue;
        settings.defaultText = settings.defaultText || configuration.defaultText;

        settings.comboBox.html(new Option(configuration.loadingText, settings.defaultValue)).prop("disabled", configuration.disableOnLoad);

        var execute = function ($function, param) {
            if ($function && typeof ($function) === "function")
                $function(param);
        };

        var load = function (itens, ajax) {
            settings.comboBox.empty();

            if (settings.defaultText)
                settings.comboBox.append(new Option(settings.defaultText, settings.defaultValue));

            itens.forEach(function (item) {
                var regex = /\{\w+\}/, text = settings.text;
                if (!settings.text.match(regex))
                    text = item[settings.text];
                else {
                    var resultMatch;
                    while ((resultMatch = text.match(regex)))
                        text = text.replace(regex, item[resultMatch[0].replace(/[\{\}]/g, "")]);
                }

                settings.comboBox.append(new Option(text, item[settings.value]));
            });
             
            if (settings.selectedValue)
                settings.comboBox.val(settings.selectedValue);

            settings.comboBox.removeAttr("disabled");

            if (!ajax) {
                execute(settings.onLoad, itens);
                execute(configuration.onLoadAll, itens);
                execute(settings.onComplete);
                execute(configuration.onCompleteAll);
            }
        };

        execute(settings.onStart);
        execute(configuration.onStartAll);

        if (settings.itens.length) {
            load(settings.itens);
        } else {
            $.ajax({
                url: settings.url,
                method: "GET",
                type: "JSON",
                data: settings.params,
                success: function (data) {
                    load(data, true);
                },
                error: function (xhr) {
                    settings.comboBox.html(new Option(configuration.errorText, settings.defaultValue)).prop("disabled", configuration.disableOnError);
                    execute(settings.onError, xhr);
                    execute(configuration.onErrorAll, xhr);
                },
                complete: function () {
                    execute(settings.onComplete);
                    execute(configuration.onCompleteAll);
                }
            });
        }

        return settings.comboBox;;
    };
})();
