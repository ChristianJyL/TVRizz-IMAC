const maxID =  70000;

async function getASerie(id) {
    const reponse = await fetch("https://api.tvmaze.com/shows/" + id);
    const serie = await reponse.json();
    return serie;
}

async function getRandomSerie() {
    const id = Math.floor(Math.random() * maxID);
    const serie = await getASerie(id);
    if (serie.status == 404) {
        return getRandomSerie();
    }
    return serie;
}

//replace the content of the div with id "serie" with the serie
async function displaySerie() {
    const serie = await getRandomSerie();

    if (serie.premiered != null) {
        document.getElementById("premiered").innerHTML = serie.premiered;
    }
    if (serie.genres != null || serie.genres.length != 0) {
        document.getElementById("genres").innerHTML = serie.genres;
    }
    if (serie.summary != null) {
        serie.summary = serie.summary.replace("<p>", "");
        serie.summary = serie.summary.replace("</p>", "");
        
        document.getElementById("summary").innerHTML = serie.summary;
    }
    if (serie.language != null) {
        document.getElementById("language").innerHTML = serie.language;
    }
    if (serie.image != null) {
        document.getElementById("serie-image").setAttribute("src", serie.image.medium);
    }

    document.getElementById("serie-title").innerHTML = serie.name;
    
    
    
    
}


displaySerie();