(function () {
    var configuration = {
        loadingText: "Loading...",
        errorText: "Load fail",

        defaultText: "Select",
        defaultValue: "",

        disabledOnLoad: true,
        disabledOnError: true,

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

        settings.comboBox.html(new Option(configuration.loadingText, settings.defaultValue)).prop("disabled", configuration.disabledOnLoad);

        var execute = function ($function) {
            if ($function && typeof ($function) === "function")
                $function();
        };

        var load = function (itens) {
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
                
            execute(settings.onComplete);
            execute(configuration.onCompleteAll);
            execute(settings.onLoad);
            execute(configuration.onLoadAll);
        };

        execute(settings.onStart);
        execute(configuration.onStartAll);

        if (settings.itens.length) {
            load(settings.itens);
        } else {
            $.get(settings.url, settings.params).success(function (data) {
                load(data);
            }).error(function (xhr) {
                settings.comboBox.html(new Option(configuration.errorText, defaultValue)).prop("disabled", configuration.disabledOnError);
                execute(settings.onError);
                execute(configuration.onErrorAll);
            }).complete(function () {
                execute(settings.onComplete);
                execute(configuration.onCompleteAll);
            });
        }

        return settings.comboBox;
    };
})();
