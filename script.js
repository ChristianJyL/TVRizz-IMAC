const maxID = 70000;
const defaultText = "Unknown";

/**
 * Used to get randomly a serie or a personality
 * @param {string} request - Request to the api (TVMaze)
 */
async function getRandomlyWithRequest(request) {
    const id = Math.floor(Math.random() * maxID); //get a random id between 0 and 70000
    const reponse = await fetch(request + id); 
    const resultJson = await reponse.json();
    if (resultJson.status == 404) {
        return getRandomlyWithRequest(request);
    }
    return resultJson;
}

/**
 * change attibutes for an image
 * @param {HTMLElement} imageElement - HTMLElement corresponding to the image
 * @param {JSON} data - JSON containing the image link 
 */
function setImageAttributes( imageElement, data) {
    const imageSrc = data.image ? data.image.medium : "Image/unknownImage.png";
    const altText = data.image ? "image of " + data.name  : "no poster";
    imageElement.setAttribute("src", imageSrc);
    imageElement.setAttribute("alt", altText);
}

/**
 * change text of an HTMLElement
 * @param {HTMLElement} Element - HTMLElement corresponding to the texxt
 * @param {string} content - the content that we want to put
 * @param {string} defaultText - text in case content is null
 */
function setTextContent(element, content, defaultText) {
    element.innerText = content ? content : defaultText; 
}



function formatSummary(summary) { //remove <p> tag in the summary (tag present in the json by default)
    if (summary != null) {
        summary = summary.replace("<p>", "");
        summary = summary.replace("</p>", "");
        return summary;
    }
    return "Unknown";
}

async function displaySerie() {
    const serie = await getRandomlyWithRequest("https://api.tvmaze.com/shows/");
    const imageElement = document.getElementById("serie-image");

    setImageAttributes(imageElement, serie );
    setTextContent(document.getElementById("serie-title"), serie.name , defaultText);
    setTextContent(document.getElementById("premiered"), serie.premiered, defaultText);
    setTextContent(document.getElementById("language"), serie.language , defaultText);
    if (serie.network) {
        setTextContent(document.getElementById("network"), serie.network.name , defaultText);
    }

    const genresElement = document.getElementById("genres");
    genresElement.innerText = serie.genres.length !== 0 ? serie.genres : defaultText;
    document.getElementById("summary").innerHTML = formatSummary(serie.summary)
}

async function displayPersonality() {
    const personality = await getRandomlyWithRequest("https://api.tvmaze.com/people/");
    const imageElement = document.getElementById("personality-image");

    setTextContent(document.getElementById("personality-name"), personality.name, defaultText);
    setTextContent(document.getElementById("birthday"), personality.birthday, defaultText);

    if (personality.country) {
        setTextContent(document.getElementById("country"),  personality.country.name, defaultText);
    }
    setImageAttributes(imageElement,personality )
}


