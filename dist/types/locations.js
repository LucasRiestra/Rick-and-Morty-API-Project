var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const containerCharacters = document.getElementById("container-characters");
const containerLocations = document.getElementById("container-locations");
const loadMoreButton = document.getElementById("loadMore");
window.addEventListener("load", init);
import { createCharacterModal } from "./characters.js";
import { loadEpisodes } from "./episodes.js";
import { loadMoreEpisodes } from "./episodes.js";
export function fetchLocations() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://rickandmortyapi.com/api/location");
        const data = yield response.json();
        return data.results;
    });
}
export function displayLocations() {
    return __awaiter(this, void 0, void 0, function* () {
        const locationsData = yield fetchLocations();
        containerLocations.innerHTML = '';
        const bottomButtons = document.createElement('div');
        bottomButtons.classList.add('button-container');
        const loadLocationsButton = document.createElement('button');
        loadLocationsButton.textContent = 'Load More Locations';
        loadLocationsButton.classList.add('location-button');
        loadLocationsButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            yield loadMoreLocations();
        }));
        bottomButtons.appendChild(loadLocationsButton);
        containerLocations.appendChild(bottomButtons);
        for (let i = 0; i < locationsData.length; i += 3) {
            const row = document.createElement('div');
            row.classList.add('container-locations');
            for (let j = 0; j < 3 && i + j < locationsData.length; j++) {
                const location = locationsData[i + j];
                const locationElement = document.createElement('div');
                locationElement.classList.add('location-grid');
                const nameElement = document.createElement('h3');
                nameElement.textContent = location.name;
                locationElement.appendChild(nameElement);
                const typeElement = document.createElement('p');
                typeElement.textContent = `Type: ${location.type}`;
                locationElement.appendChild(typeElement);
                const dimensionElement = document.createElement('p');
                dimensionElement.textContent = `Dimension: ${location.dimension}`;
                locationElement.appendChild(dimensionElement);
                row.appendChild(locationElement);
                locationElement.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                    yield createLocationsModal(location);
                }));
                locationElement.setAttribute("data-bs-toggle", "modal");
                locationElement.setAttribute("data-bs-target", "#exampleModal");
            }
            containerLocations.appendChild(row);
        }
    });
}
let locationCounter = 20;
const locationsPerPage = 20;
export function loadMoreLocations() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nextPageUrl = `https://rickandmortyapi.com/api/location?page=${Math.floor(locationCounter / locationsPerPage) + 1}`;
            const response = yield fetch(nextPageUrl);
            const data = yield response.json();
            const newLocations = data.results;
            for (let i = 0; i < newLocations.length; i += 3) {
                const locationRow = document.createElement('div');
                locationRow.classList.add('container-locations');
                for (let j = 0; j < 3 && i + j < newLocations.length; j++) {
                    const location = newLocations[i + j];
                    const locationElement = document.createElement('div');
                    locationElement.classList.add('location-grid');
                    const nameElement = document.createElement('h3');
                    nameElement.textContent = location.name;
                    locationElement.appendChild(nameElement);
                    const typeElement = document.createElement('p');
                    typeElement.textContent = `Type: ${location.type}`;
                    locationElement.appendChild(typeElement);
                    const dimensionElement = document.createElement('p');
                    dimensionElement.textContent = `Dimension: ${location.dimension}`;
                    locationElement.appendChild(dimensionElement);
                    locationRow.appendChild(locationElement);
                    locationElement.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                        yield createLocationsModal(location);
                    }));
                    locationElement.setAttribute("data-bs-toggle", "modal");
                    locationElement.setAttribute("data-bs-target", "#exampleModal");
                }
                containerLocations.appendChild(locationRow);
            }
            locationCounter += locationsPerPage;
            if (newLocations.length > 0) {
                const lastLocationElement = containerLocations.lastElementChild;
                if (lastLocationElement) {
                    lastLocationElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
                }
            }
        }
        catch (error) {
            console.error("Error loading more locations:", error);
        }
        const bottomButtons = document.createElement('div');
        bottomButtons.classList.add('button-container');
        const loadLocationsButton = document.createElement('button');
        loadLocationsButton.textContent = 'Load More Locations';
        loadLocationsButton.classList.add('location-button');
        loadLocationsButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            yield loadMoreLocations();
        }));
        bottomButtons.appendChild(loadLocationsButton);
        containerLocations.appendChild(bottomButtons);
    });
}
function createLocationsModal(location) {
    return __awaiter(this, void 0, void 0, function* () {
        const modal = document.getElementById("exampleModal");
        const modalTitle = modal.querySelector(".modal-title");
        const modalBody = modal.querySelector(".modal-body");
        modalTitle.textContent = `Location: ${location.name}`;
        modalBody.innerHTML = "";
        const typeElement = document.createElement("p");
        typeElement.textContent = `Location type: ${location.type}`;
        modalBody.appendChild(typeElement);
        const dimensionElement = document.createElement("p");
        dimensionElement.textContent = `Location dimension: ${location.dimension}`;
        modalBody.appendChild(dimensionElement);
        const residentsElement = document.createElement("div");
        residentsElement.classList.add("residents-list");
        const residentsHeader = document.createElement("h6");
        residentsHeader.textContent = "Residents Names: (you can select it)";
        residentsElement.appendChild(residentsHeader);
        const residentsNames = yield fetchResidentsNames(location.residents);
        if (residentsNames.length > 0) {
            const residentsList = document.createElement("ul");
            residentsNames.forEach(residentName => {
                const residentItem = document.createElement("li");
                residentItem.textContent = residentName;
                residentItem.classList.add("resident-name");
                residentItem.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                    const response = yield fetch(`https://rickandmortyapi.com/api/character?name=${residentName}`);
                    const data = yield response.json();
                    const character = data.results[0];
                    createCharacterModal(character);
                }));
                residentsList.appendChild(residentItem);
            });
            residentsElement.appendChild(residentsList);
        }
        else {
            residentsElement.textContent = "No residents";
        }
        modalBody.appendChild(residentsElement);
        function fetchResidentsNames(residentUrls) {
            return __awaiter(this, void 0, void 0, function* () {
                const residentsNames = [];
                const residentPromises = residentUrls.map((url) => __awaiter(this, void 0, void 0, function* () {
                    const residentResponse = yield fetch(url);
                    const residentData = yield residentResponse.json();
                    residentsNames.push(residentData.name);
                }));
                yield Promise.all(residentPromises);
                return residentsNames;
            });
        }
    });
}
;
loadMoreButton.addEventListener("click", loadMoreEpisodes);
function loadEpisodeAndCharacters(episodeId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const episodeResponse = yield fetch(`https://rickandmortyapi.com/api/episode/${episodeId}`);
            const episode = yield episodeResponse.json();
            const episodeDetailsDiv = document.createElement("div");
            episodeDetailsDiv.classList.add("episode-details");
            const h2 = document.createElement("h2");
            h2.textContent = episode.name;
            episodeDetailsDiv.appendChild(h2);
            const airDate = document.createElement("p");
            airDate.textContent = `Air Date: ${episode.air_date}`;
            episodeDetailsDiv.appendChild(airDate);
            const episodeCode = document.createElement("p");
            episodeCode.textContent = `Episode Code: ${episode.episode}`;
            episodeDetailsDiv.appendChild(episodeCode);
            const characterIds = episode.characters.map((url) => parseInt(url.split('/').pop() || ''));
            const characterPromises = characterIds.map((id) => fetch(`https://rickandmortyapi.com/api/character/${id}`));
            const characterResponses = yield Promise.all(characterPromises);
            const characters = yield Promise.all(characterResponses.map(response => response.json()));
            const charactersDiv = document.createElement("div");
            charactersDiv.classList.add("character-list");
            const fragment = document.createDocumentFragment();
            fragment.appendChild(episodeDetailsDiv);
            fragment.appendChild(charactersDiv);
            while (containerCharacters.firstChild) {
                containerCharacters.removeChild(containerCharacters.firstChild);
            }
            containerCharacters.appendChild(fragment);
            containerCharacters.scrollIntoView({ behavior: "smooth" });
            characters.forEach(character => {
                const characterDiv = document.createElement("div");
                characterDiv.classList.add("character-item");
                const characterImage = document.createElement("img");
                characterImage.src = character.image;
                characterImage.alt = character.name;
                characterImage.addEventListener("click", () => {
                    createCharacterModal(character);
                });
                characterImage.setAttribute("data-bs-toggle", "modal");
                characterImage.setAttribute("data-bs-target", "#exampleModal");
                characterDiv.appendChild(characterImage);
                const nameParagraph = document.createElement("h2");
                nameParagraph.textContent = `Name: ${character.name}`;
                characterDiv.appendChild(nameParagraph);
                const statusParagraph = document.createElement("p");
                statusParagraph.textContent = `Status: ${character.status}`;
                characterDiv.appendChild(statusParagraph);
                const speciesParagraph = document.createElement("p");
                speciesParagraph.textContent = `Species: ${character.species}`;
                characterDiv.appendChild(speciesParagraph);
                charactersDiv.appendChild(characterDiv);
            });
            containerCharacters.appendChild(episodeDetailsDiv);
            containerCharacters.appendChild(charactersDiv);
        }
        catch (error) {
            console.error("Error loading episode and characters:", error);
        }
    });
}
;
export function init() {
    (() => __awaiter(this, void 0, void 0, function* () {
        const locationsButton = document.getElementById("locationsButton");
        locationsButton.addEventListener("click", () => {
            containerCharacters.style.display = "none";
            containerLocations.style.display = "block";
            displayLocations();
        });
        yield (() => __awaiter(this, void 0, void 0, function* () {
            yield loadEpisodes();
        }))();
        const episodeElements = document.querySelectorAll(".episode-item");
        episodeElements.forEach(episodeElement => {
            episodeElement.addEventListener("click", () => {
                containerCharacters.style.display = "block";
                containerLocations.style.display = "none";
                const episodeId = parseInt(episodeElement.getAttribute("data-episode-id") || "0");
                console.log("ID del episodio:", episodeId);
                loadEpisodeAndCharacters(episodeId);
            });
        });
    }))();
}
;
