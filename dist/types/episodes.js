var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const episodeList = document.getElementById("episodeList");
const loadMoreButton = document.getElementById("loadMore");
const containerCharacters = document.getElementById("container-characters");
const containerLocations = document.getElementById("container-locations");
let episodeCounter = 0;
const episodesPerLoad = 20;
let allEpisodes;
import { loadEpisodeAndCharacters } from "./characters.js";
export function loadEpisodes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://rickandmortyapi.com/api/episode");
            const data = yield response.json();
            allEpisodes = data.results;
            const startIndex = episodeCounter;
            const episodesToShow = allEpisodes.slice(startIndex);
            episodesToShow.forEach(episode => {
                const listItem = document.createElement("li");
                listItem.classList.add("episode-item");
                const episodeDetails = document.createElement("strong");
                episodeDetails.textContent = episode.name;
                const airDate = document.createElement("p");
                airDate.textContent = `Air Date: ${episode.air_date}`;
                const episodeCode = document.createElement("p");
                episodeCode.textContent = `Episode Code: ${episode.episode}`;
                listItem.appendChild(episodeDetails);
                listItem.appendChild(airDate);
                listItem.appendChild(episodeCode);
                listItem.addEventListener("click", () => {
                    loadEpisodeAndCharacters(episode.id);
                });
                episodeList.appendChild(listItem);
            });
            episodeCounter += episodesPerLoad;
        }
        catch (error) {
            console.error("Error loading episodes:", error);
        }
    });
}
export function loadMoreEpisodes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nextPageUrl = `https://rickandmortyapi.com/api/episode?page=${Math.floor(episodeCounter / episodesPerLoad)}`;
            const response = yield fetch(nextPageUrl);
            const data = yield response.json();
            const newEpisodes = data.results;
            newEpisodes.forEach(episode => {
                const listItem = document.createElement("li");
                listItem.classList.add("episode-item");
                const episodeDetails = document.createElement("strong");
                episodeDetails.textContent = episode.name;
                const airDate = document.createElement("p");
                airDate.textContent = `Air Date: ${episode.air_date}`;
                const episodeCode = document.createElement("p");
                episodeCode.textContent = `Episode Code: ${episode.episode}`;
                listItem.appendChild(episodeDetails);
                listItem.appendChild(airDate);
                listItem.appendChild(episodeCode);
                listItem.addEventListener("click", () => {
                    loadEpisodeAndCharacters(episode.id);
                });
                episodeList.appendChild(listItem);
            });
            episodeCounter += episodesPerLoad;
            window.scrollTo(0, document.body.scrollHeight);
            const newEpisodeElements = document.querySelectorAll(".episode-item");
            newEpisodeElements.forEach(newEpisodeElement => {
                newEpisodeElement.addEventListener("click", () => {
                    containerCharacters.style.display = "block";
                    containerLocations.style.display = "none";
                    const episodeId = parseInt(newEpisodeElement.getAttribute("data-episode-id") || "0" || "1" || "2");
                    console.log("ID del episodio:", episodeId);
                    loadEpisodeAndCharacters(episodeId);
                });
            });
        }
        catch (error) {
            console.error("Error loading more episodes:", error);
        }
    });
}
loadMoreButton.addEventListener("click", loadMoreEpisodes);
