var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var CharacterStatus;
(function (CharacterStatus) {
    CharacterStatus["Alive"] = "Alive";
    CharacterStatus["Dead"] = "Dead";
    CharacterStatus["Unknown"] = "unknown";
})(CharacterStatus || (CharacterStatus = {}));
var CharacterSpecies;
(function (CharacterSpecies) {
    CharacterSpecies["Human"] = "Human";
    CharacterSpecies["Alien"] = "Alien";
    CharacterSpecies["Other"] = "unknown";
})(CharacterSpecies || (CharacterSpecies = {}));
var CharacterGender;
(function (CharacterGender) {
    CharacterGender["Male"] = "Male";
    CharacterGender["Female"] = "Female";
    CharacterGender["Genderless"] = "Genderless";
    CharacterGender["Unknown"] = "unknown";
})(CharacterGender || (CharacterGender = {}));
const containerCharacters = document.getElementById("container-characters");
const containerLocations = document.getElementById("container-locations");
export const mainContainer = document.getElementById("container-characters");
import { displayLocations } from "./locations.js";
export function loadEpisodeAndCharacters(episodeId) {
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
            while (mainContainer.firstChild) {
                mainContainer.removeChild(mainContainer.firstChild);
            }
            mainContainer.appendChild(fragment);
            mainContainer.scrollIntoView({ behavior: "smooth" });
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
            mainContainer.appendChild(episodeDetailsDiv);
            mainContainer.appendChild(charactersDiv);
        }
        catch (error) {
            console.error("Error loading episode and characters:", error);
        }
    });
}
export function createCharacterModal(character) {
    return __awaiter(this, void 0, void 0, function* () {
        const modal = document.getElementById("exampleModal");
        const modalTitle = modal.querySelector(".modal-title");
        const modalBody = modal.querySelector(".modal-body");
        modalTitle.textContent = character.name;
        const characterImage = document.createElement("img");
        characterImage.src = character.image;
        characterImage.alt = character.name;
        const statusParagraph = document.createElement("p");
        statusParagraph.textContent = `Status: ${character.status}`;
        const speciesParagraph = document.createElement("p");
        speciesParagraph.textContent = `Species: ${character.species}`;
        const locationResponse = yield fetch(character.location.url);
        const locationData = yield locationResponse.json();
        const locationName = locationData.name;
        const locationParagraph = document.createElement("h6");
        locationParagraph.textContent = `Location: ${locationName}`;
        locationParagraph.style.cursor = "pointer";
        locationParagraph.addEventListener("click", () => {
            containerCharacters.style.display = "none";
            containerLocations.style.display = "block";
            displayLocations();
            updateModalWithLocationInfo(locationData);
        });
        modalBody.innerHTML = "";
        modalBody.appendChild(characterImage);
        modalBody.appendChild(statusParagraph);
        modalBody.appendChild(speciesParagraph);
        modalBody.appendChild(locationParagraph);
        const characterEpisodes = document.createElement("div");
        characterEpisodes.classList.add("character-episodes");
        const characterEpisodesHeader = document.createElement("h2");
        characterEpisodesHeader.textContent = "Episodes";
        characterEpisodes.appendChild(characterEpisodesHeader);
        for (const episodeUrl of character.episode) {
            const episodeResponse = yield fetch(episodeUrl);
            const episodeData = yield episodeResponse.json();
            const episodeNameParagraph = document.createElement("h5");
            episodeNameParagraph.textContent = `Episode: ${episodeData.name}`;
            const episodeCodeParagraph = document.createElement("p");
            episodeCodeParagraph.textContent = `Code: ${episodeData.episode}`;
            characterEpisodes.appendChild(episodeNameParagraph);
            characterEpisodes.appendChild(episodeCodeParagraph);
        }
        modalBody.appendChild(characterEpisodes);
        function updateModalWithLocationInfo(location) {
            return __awaiter(this, void 0, void 0, function* () {
                const modalBody = document.querySelector(".modal-body");
                const modalTitle = document.querySelector(".modal-title");
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
    });
}
