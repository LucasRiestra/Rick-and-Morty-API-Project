var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const locationsButton = document.getElementById("locationsButton");
const containerCharacters = document.getElementById("container-characters");
const containerLocations = document.getElementById("container-locations");
window.addEventListener("load", init);
import { createCharacterModal } from "./characters.js";
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
        const backToEpisodesButton = document.createElement('button');
        backToEpisodesButton.textContent = 'Back to Episodes';
        backToEpisodesButton.classList.add('backToEpisodes-button');
        backToEpisodesButton.addEventListener('click', () => {
            window.location.href = "index.html";
        });
        const loadLocationsButton = document.createElement('button');
        loadLocationsButton.textContent = 'Load More Locations';
        loadLocationsButton.classList.add('location-button');
        loadLocationsButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            yield loadMoreLocations();
        }));
        bottomButtons.appendChild(backToEpisodesButton);
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
        }
        catch (error) {
            console.error("Error loading more locations:", error);
        }
        const bottomButtons = document.createElement('div');
        bottomButtons.classList.add('button-container');
        const backToEpisodesButton = document.createElement('button');
        backToEpisodesButton.textContent = 'Back to Episodes';
        backToEpisodesButton.classList.add('backToEpisodes-button');
        backToEpisodesButton.addEventListener('click', () => {
            window.location.href = "index.html";
        });
        const loadLocationsButton = document.createElement('button');
        loadLocationsButton.textContent = 'Load More Locations';
        loadLocationsButton.classList.add('location-button');
        loadLocationsButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            yield loadMoreLocations();
        }));
        bottomButtons.appendChild(backToEpisodesButton);
        bottomButtons.appendChild(loadLocationsButton);
        containerLocations.appendChild(bottomButtons);
    });
}
export function init() {
    const locationsButton = document.getElementById("locationsButton");
    locationsButton.addEventListener("click", () => {
        containerCharacters.style.display = "none";
        containerLocations.style.display = "block";
        displayLocations();
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
        residentsHeader.textContent = "Residents Names:";
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
