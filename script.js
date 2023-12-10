const maxID = 70000;
const defaultText = "Unknown";

/**
 * Used to get randomly a serie or a personality
 * @param {string} request - URL to do the request
 */
async function getRandomlyWithRequest(request, count = 0) {
    if (count > 5) {
        throw new Error("Too many requests");
    }
    const id = Math.floor(Math.random() * maxID); //get a random id between 0 and 70000
    const reponse = await fetch(request + id);
    const resultJson = await reponse.json();
    if (resultJson.status == 404) {
        return getRandomlyWithRequest(request, count + 1);
    }
    return resultJson;
}

/**
 * change attibutes for an image
 * @param {HTMLElement} imageElement - HTMLElement corresponding to the image
 * @param {JSON} data - JSON containing the image link and the name 
 */
function setImageAttributes(imageElement, data) {
    const imageSrc = data.image ? data.image.medium : "Image/unknownImage.png";
    const altText = data.image ? "image of " + data.name : "no poster";
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


/**
 * Format the summary
 * @param {string} summary - summary that we get from the json
 */
function formatSummary(summary) { //remove <p> tag in the summary (tag present in the json by default)
    if (summary != null && summary !== "") {
        summary = summary.replace("<p>", "");
        summary = summary.replace("</p>", "");
        return summary;
    }
    return "Unknown"; //if the summary is null or empty
}

/**
 * Display a serie 
 */
async function displaySerie() {
    try { //try to get a serie
        const serie = await getRandomlyWithRequest("https://api.tvmaze.com/shows/");
        const imageElement = document.getElementById("serie-image");

        //change attributes and text of the elements
        setImageAttributes(imageElement, serie);
        setTextContent(document.getElementById("serie-title"), serie.name, defaultText);
        setTextContent(document.getElementById("premiered"), serie.premiered, defaultText);
        setTextContent(document.getElementById("language"), serie.language, defaultText);
        if (serie.network) { //if the network is not null
            setTextContent(document.getElementById("network"), serie.network.name, defaultText);
        }
        const genresElement = document.getElementById("genres");
        genresElement.innerText = serie.genres.length !== 0 ? serie.genres : defaultText; //if the genres is not empty
        document.getElementById("summary").innerHTML = formatSummary(serie.summary)
    } catch (error) { //if we get an error (too many requests)
        const imageElement = document.getElementById("serie-image"); 
        imageElement.setAttribute("src", "Image/deadImage.png");
        imageElement.setAttribute("alt", "Error image");
        setTextContent(document.getElementById("serie-title"), "Too many requests, please try again with the reroll button", defaultText);
        setTextContent(document.getElementById("premiered"), null, defaultText);
        setTextContent(document.getElementById("language"), null, defaultText);
        setTextContent(document.getElementById("network"), null, defaultText);
        setTextContent(document.getElementById("genres"), null, defaultText);
        setTextContent(document.getElementById("summary"), null, defaultText);
    }

}

/**
 * Display a personality
 */
async function displayPersonality() {
    try { //try to get a personality
        const personality = await getRandomlyWithRequest("https://api.tvmaze.com/people/");
        const imageElement = document.getElementById("personality-image");

        setTextContent(document.getElementById("personality-name"), personality.name, defaultText);
        setTextContent(document.getElementById("birthday"), personality.birthday, defaultText);

        if (personality.country) { //if the country is not null
            setTextContent(document.getElementById("country"), personality.country.name, defaultText);
        }
        setImageAttributes(imageElement, personality)
    } catch (error) { //if we get an error (too many requests)
        const imageElement = document.getElementById("personality-image");
        imageElement.setAttribute("src", "Image/deadImage.png");
        imageElement.setAttribute("alt", "Error image");
        setTextContent(document.getElementById("personality-name"), "Too many requests, please try again with the reroll button", defaultText);
        setTextContent(document.getElementById("birthday"), null, defaultText);
        setTextContent(document.getElementById("country"), null, defaultText);
    }
}