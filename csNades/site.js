const mapsData = {
    mirage: {
        name: "Mirage",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_p3640NB7PPjfo573Wdejv2efvisbxqkF5Q&s",
        ct: [
        ],
        tr: [
            { title: "Smokes Bomb A", video: "QC2_GJOYoGc" }
        ]
    },
    dust2: {
        name: "Dust 2",
        image: "https://img-cdn.hltv.org/gallerypicture/NHjWpIj8lNlRM-_OGkGSW_.jpg?ixlib=java-2.1.0&w=1200&s=8e40510e9331d025088971931584a620",
        ct: [
        ],
        tr: [
            { title: "Smokes Bomb B", video: "vkLMyXkJfpM" }
        ]
    },
    inferno: {
        name: "Inferno",
        image: "https://assets.gamearena.gg/wp-content/uploads/2024/04/01141238/De_infernoCS2BSite.jpeg",
        ct: [
        ],
        tr: [
        ]
    },
    nuke: {
        name: "Nuke",
        image: "https://i.redd.it/nuke-cs1-vs-cs2-comparison-shots-v0-1rl0kalos29b1.png?width=2560&format=png&auto=webp&s=920e3cb3d15f245468c66ea1932211d6a538cfc9",
        ct: [
        ],
        tr: [
            { title: "Smokes Fora", video: "esSCv3umgoM" }
        ]
    },
    ancient: {
        name: "Ancient",
        image: "https://images.steamusercontent.com/ugc/2042997274847133077/8534B50A5A691EE7D3F1500E1CF03D41A37D03AC/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
        ct: [
        ],
        tr: [
        ]
    },
    train: {
        name: "Train",
        image: "https://cdn.sanity.io/images/6znhzi10/production/d72ebcffe297b573d921eb18436ecdf458aff188-1917x1054.jpg?w=768&auto=format",
        ct: [
        ],
        tr: [
        ]
    },
    vertigo: {
        name: "Vertigo",
        image: "https://cs.money/ru/blog/wp-content/uploads/2024/12/cs2_vertigo_a_site.jpg",
        ct: [
        ],
        tr: [
        ]
    },
    anubis: {
        name: "Anubis",
        image: "https://static.draft5.gg/news/2023/06/07112727/Anubis-CS2.jpg",
        ct: [
        ],
        tr: [
        ]
    }
};

function renderMaps() {
    const grid = $('#mapsGrid');
    grid.empty();

    var totalVideos = 0;
    $.each(mapsData, function (key, map) {
        totalVideos += map.ct.length + map.tr.length;

        const mapCard = $('<div class="map-card"></div>');

        const mapHeader = $(`
            <div class="map-header" style="background-image: url('${map.image}')">
                <div class="map-name">${map.name}</div>
            </div>
        `);

        const videoContainer = $('<div class="video-container"></div>');

        // Adicionar filtros dentro do mapa
        const filterSection = $(`
            <div class="map-filter">
                <button class="filter-btn active" data-map="${key}" data-side="ct">CT (${map.ct.length})</button>
                <button class="filter-btn" data-map="${key}" data-side="tr">TR (${map.tr.length})</button>
            </div>
        `);

        const videosDiv = $(`<div class="videos-list" data-map="${key}"></div>`);

        // Renderizar vídeos CT por padrão
        renderVideos(map.ct, videosDiv);

        videoContainer.append(filterSection).append(videosDiv);
        mapCard.append(mapHeader).append(videoContainer);
        grid.append(mapCard);
    });

    document.title = 'CS2 Utility Guides (' + totalVideos + ')';
}

function renderVideos(videos, container) {
    container.empty();

    if (videos.length > 0) {
        $.each(videos, function (i, video) {
            const videoElement = $(`
                <div class="video-item">
                    <div class="video-title">${video.title}</div>
                    <button class="play-btn" title="Play" data-video="${video.video}">▶</button>
                </div>
            `);
            container.append(videoElement);
        });
    } else {
        container.append('<div class="no-videos">Nenhum vídeo disponível</div>');
    }
}

$(document).ready(function () {
    renderMaps();

    $(document).on('click', '.filter-btn', function () {
        const mapKey = $(this).data('map');
        const side = $(this).data('side');

        // Atualizar botões ativos apenas dentro do mesmo mapa
        $(`.filter-btn[data-map="${mapKey}"]`).removeClass('active');
        $(this).addClass('active');

        // Renderizar vídeos do lado selecionado
        const videosContainer = $(`.videos-list[data-map="${mapKey}"]`);
        const videos = mapsData[mapKey][side];
        renderVideos(videos, videosContainer);
    });

    // Evento para abrir o modal com o vídeo
    $(document).on('click', '.play-btn', function () {
        const videoId = $(this).data('video');
        const modal = $('#videoModal');
        const iframe = $('#modalVideo');
        iframe.attr('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
        modal.addClass('show');
    });

    // Evento para fechar o modal
    $(document).on('click', '#closeModal', function () {
        const modal = $('#videoModal');
        const iframe = $('#modalVideo');
        iframe.attr('src', ''); // Parar o vídeo
        modal.removeClass('show');
    });

    // Fechar modal ao clicar fora
    $(document).on('click', '#videoModal', function (e) {
        if (e.target === this) {
            const modal = $('#videoModal');
            const iframe = $('#modalVideo');
            iframe.attr('src', '');
            modal.removeClass('show');
        }
    });
});
