const maxID =  70000;

async function getRandomlyWithRequest(request) {
    const id = Math.floor(Math.random() * maxID);
    const reponse = await fetch(request + id);
    const resultJson = await reponse.json();
    if (resultJson.status == 404) {
        return getRandomlyWithRequest(request);
    }
    return resultJson;
}

async function getSeriesFromPersonality(id) {
    const reponse = await fetch("https://api.tvmaze.com/people/" + id + "/castcredits?embed=show");
    const resultJson = await reponse.json();
    return resultJson;
}

async function displaySerie() {
    const serie = await getRandomlyWithRequest("https://api.tvmaze.com/shows/");

    const premieredText = document.getElementById("premiered");
    premieredText.innerText = serie.premiered ? serie.premiered : "Unknown";

    const genresText = document.getElementById("genres");
    genresText.innerText = serie.genres.length !== 0 ? serie.genres : "Unknown"


    if (serie.summary != null) {
        serie.summary = serie.summary.replace("<p>", "");
        serie.summary = serie.summary.replace("</p>", "");
        
        document.getElementById("summary").innerHTML = serie.summary;
    }else{
        document.getElementById("summary").innerHTML = "Unknown"
    }

    if (serie.language != null) {
        document.getElementById("language").innerHTML = serie.language;
    }else{
        document.getElementById("language").innerHTML = "Unknown"
    }

    if (serie.image != null) {
        document.getElementById("serie-image").setAttribute("src", serie.image.medium);
        document.getElementById("serie-image").setAttribute("alt", "poster of " + serie.name);
    }else{
        document.getElementById("serie-image").setAttribute("src", "Image/unknowImage.png");
        document.getElementById("serie-image").setAttribute("alt", "no poster");
    }
    if (serie.network != null) {
        document.getElementById("network").innerHTML = serie.network.name;
    }else{
        document.getElementById("network").innerHTML = "Unknown"
    }

    document.getElementById("serie-title").innerHTML = serie.name;
    
}

async function displayPersonality(){
    const personality = await getRandomlyWithRequest("https://api.tvmaze.com/people/");

    document.getElementById("name").innerHTML = personality.name;
    if (personality.birthday != null) {
        var birthday = document.createElement("p");
        birthday.innerHTML = "<strong>Birthday :</strong> " + personality.birthday;
        document.getElementById("content").appendChild(birthday);
    }
    if (personality.country != null) {
        var country = document.createElement("p");
        country.innerHTML = "<strong>Country :</strong> " + personality.country.name;
        document.getElementById("content").appendChild(country);
    }
    

    if (personality.image != null) {
        document.getElementById("personality-image").setAttribute("src", personality.image.medium);
        document.getElementById("personality-image").setAttribute("alt", "picture of " + personality.name);
    }
}


