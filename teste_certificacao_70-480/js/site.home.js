window.home = (function () {
    var loadImage = function(src, target, input) {
        src = src.trim();
        var poster = typeof target === "string" ? $(target) : target,
            posterIcon = poster.querySelector("i");

        poster.style.backgroundImage = "";
        if (!src) {
            posterIcon.innerHTML = "image";
            posterIcon.className = posterIcon.className.replace(/\s?spin/, "");
            return;
        }

        posterIcon.innerHTML = "refresh";
        posterIcon.className += " spin";
        
        var img = new Image();
        img.onload = function() {
            poster.style.backgroundImage = "url('" + img.src + "')";
            posterIcon.innerHTML = "";
            posterIcon.className = posterIcon.className.replace(/\s?spin/, "");
        };
        img.onerror = function() {
            posterIcon.innerHTML = "image";
            posterIcon.className = posterIcon.className.replace(/\s?spin/, "");

            site.error("Url Poster invalid");
            if (input) {
                input.value = "";
                input.focus();
            }
        };
        img.src = src + "?d=" + new Date().getTime();
    };

    var init = function() {
        function Movie(id, poster, trailler) {
            this.id = id;
            this.poster = poster;
            this.trailler = trailler;
        }
    
        var main = $("main");
        [
            new Movie(1, "pictures/picture1.jpg", "Q9X-bAE8KTc"), 
            new Movie(2, "pictures/picture2.jpg", "DiQjnWELurw"),
            new Movie(3, "pictures/picture3.jpg", "m4NCribDx4U"),
            new Movie(4, "pictures/picture4.jpg", "nQCRrZDzeek")
        ].forEach(function(movie) {
            var card = site.create("div", { className: "card card-movie", style: { height: "300px" } }),
                cardMovieContent = site.create("div", { className: "movie-content", innerHTML: '<i class="material-icons">play_circle_outline</i>' }),
                buttonDetail = site.create("button", { className: "button w75", innerHTML: "DETALHES", movie: movie }),
                divDetail = site.create("div"),
                buttonTrailler = site.create("button", { className: "button w75", innerHTML: "TRAILLER", movie: movie }),
                divTrailler = site.create("div"),
                cardPoster = site.create("div", { className: "poster" });

            cardPoster.innerHTML = '<i class="material-icons">image</i>';

            buttonDetail.addEventListener("click", function(e) {
                e.stopPropagation();

                //load

                site.modal("add-movie");
            });

            buttonTrailler.addEventListener("click", function(e) {
                e.stopPropagation();
                $("#trailler").src = "https://www.youtube.com/embed/" + this.movie.trailler + "?autoplay=1";
                site.modal("view-trailler", function() { $("#trailler").src = ""; });
            });
            cardMovieContent.addEventListener("click", function() { buttonTrailler.click(); });

            divDetail.appendChild(buttonDetail);
            divTrailler.appendChild(buttonTrailler);
            cardMovieContent.appendChild(divDetail);
            cardMovieContent.appendChild(divTrailler);
            card.appendChild(cardMovieContent);
            card.appendChild(cardPoster);
            main.appendChild(card);

            loadImage(movie.poster, cardPoster);
        });
    };

    var logout = function() {
        location.href = "index.html";
    };

    var submitMovie = function(form) {

    };

    return {
        init: init,
        logout: logout,
        loadImage: loadImage,
        submitMovie: submitMovie
    };
})();
