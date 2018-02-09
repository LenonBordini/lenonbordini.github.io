window.home = (function () {
    var idUser;

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

    function loadMovies() {
        var movies = $("main .card.card-movie");
        if (movies) {
            if (!movies.length)
                movies.remove();
            else
                for (var i = 0; i < movies.length; i++)
                    movies[i].remove();
        }

        site.ajax({
            method: "GET",
            url: "user/" + idUser + "/movie",
            success: function(data) {
                var movies = JSON.parse(data);
                if (!movies.length) {
                    $(".no-movie").style.display = "block";
                    return;
                }

                $(".no-movie").style.display = "none";

                var main = $("main");
                movies.forEach(function(movie) {
                    var card = site.create("div", { className: "card card-movie", style: { height: "300px" } }),
                    cardMovieContent = site.create("div", { className: "movie-content", innerHTML: '<i class="material-icons">play_circle_outline</i>' }),
                    buttonDetail = site.create("button", { className: "button w75", innerHTML: "DETALHES" }),
                    divDetail = site.create("div"),
                    buttonTrailler = site.create("button", { className: "button w75", innerHTML: "TRAILLER" }),
                    divTrailler = site.create("div"),
                    cardPoster = site.create("div", { className: "poster" });

                    cardPoster.innerHTML = '<i class="material-icons">image</i>';

                    buttonDetail.addEventListener("click", function(e) {
                        e.stopPropagation();
                        home.modalMovie(movie);
                    });

                    buttonTrailler.addEventListener("click", function(e) {
                        e.stopPropagation();
                        $("#trailler").src = this.movie.urlTrailler + "?autoplay=1";
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

                    loadImage(movie.urlPoster, cardPoster);
                });
            }
        });
    }

    var init = function() {
        if (!(idUser = sessionStorage.idUser)) {
            location.href = "index.html";
            return;
        }

        site.ajax({
            method: "GET",
            url: "category",
            success: function(data) {
                JSON.parse(data).forEach(function(category) {
                    $("[name='idCategory']").appendChild(new Option(category.name, category.id));
                    $("#nav-options").appendChild(site.create("li", {
                        title: category.name,
                        innerHTML: '<i class="material-icons">movie_filter</i> ' + category.name
                    }));
                });

                $("#nav-options").appendChild(site.create("li", {
                    title: "Logout",
                    innerHTML: '<i class="material-icons logout" onclick="home.logout();">highlight_off</i> Logout'
                }));
            }
        });

        loadMovies();
    };

    var logout = function() {
        delete sessionStorage.idUser;
        location.reload();
    };

    var modalMovie = function(movie) {
        site.modal('add-movie');
        movie = movie || {};

        var form = $("#formMovie");
        form.id.value = movie.id || "";
        form.name.value = movie.name || "";
        form.idCategory.value = movie.idCategory || "";
        form.urlPoster.value = movie.urlPoster || "";
        form.urlTrailler.value = movie.urlTrailler || "";
        form.watched.value = movie.watched ? 1 : 0;
        form.watchedDate.value = movie.watchedDate ? new Date(movie.watchedDate).toLocaleDateString() : "";
        form.quality.value = form.id.value ? movie.quality : 5;
        form.description.value = movie.description || "";

        $('#quality').innerHTML = form.quality.value;
        loadImage(form.urlPoster.value, ".add-poster");
    };

    var submitMovie = function(form) {
        var method = "POST", 
            url = "user/" + idUser + "/movie";

        if (form.id.value) {
            method = "PUT";
            url += "/" + form.id.value;
        }

        site.ajax({
            method: method,
            url: url,
            data: {
                name: form.name.value,
                idCategory: form.idCategory.value,
                urlPoster: form.urlPoster.value,
                urlTrailler: form.urlTrailler.value,
                watched: !!+form.watched.value,
                watchedDate: form.watchedDate.value,
                quality: +form.quality.value,
                description: form.description.value
            },
            success: function() {
                site.success("Movie saved successfully");
                site.closeModal();
                loadMovies();
            }
        });
    };

    var deleteMovie = function() {
        var form = $("#formMovie");
        if (!form.id.value) {
            site.closeModal();
            return;
        }

        site.ajax({
            method: "DELETE",
            url: "user/" + idUser + "/movie/" + form.id.value,
            success: function() {
                site.success("Movie deleted successfully");
                site.closeModal();
                loadMovies();
            }
        });
    };

    return {
        init: init,
        logout: logout,
        loadImage: loadImage,
        modalMovie: modalMovie,
        submitMovie: submitMovie,
        deleteMovie: deleteMovie
    };
})();
