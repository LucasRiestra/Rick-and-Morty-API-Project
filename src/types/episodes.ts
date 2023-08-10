const episodeList = document.getElementById("episodeList") as HTMLUListElement;
const loadMoreButton = document.getElementById("loadMore") as HTMLButtonElement;

let episodeCounter = 0;
const episodesPerLoad = 20;
let allEpisodes: Episode[] 

export interface Episode {
    name: string;
    air_date: string;
    episode: string;
    id: number;
}
import { loadEpisodeAndCharacters } from "./characters.js";

export async function loadEpisodes(): Promise<void> {
    try {
        const response = await fetch("https://rickandmortyapi.com/api/episode");
        const data = await response.json();
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

    } catch (error) {
        console.error("Error loading episodes:", error);
    }
}

export async function loadMoreEpisodes() {
    try {
        const nextPageUrl = `https://rickandmortyapi.com/api/episode?page=${Math.floor(episodeCounter / episodesPerLoad)}`;
        const response = await fetch(nextPageUrl);
        const data = await response.json();
        const newEpisodes: Episode[] = data.results;

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

    } catch (error) {
        console.error("Error loading more episodes:", error);
    }
}

loadMoreButton.addEventListener("click", loadMoreEpisodes);