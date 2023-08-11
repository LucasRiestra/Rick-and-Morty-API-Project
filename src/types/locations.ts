const containerCharacters = document.getElementById("container-characters") as HTMLElement;
const containerLocations = document.getElementById("container-locations") as HTMLElement;
const loadMoreButton = document.getElementById("loadMore") as HTMLButtonElement;
interface LocationData {
    id: number;
    name: string;
    type: string;
    dimension: string;
    residents: string[];
    url:string;
    location: string;
}

window.addEventListener("load", init);

import { createCharacterModal } from "./characters.js";
import { loadEpisodes } from "./episodes.js";
import { loadMoreEpisodes } from "./episodes.js";

export async function fetchLocations() {
    const response = await fetch("https://rickandmortyapi.com/api/location");
    const data = await response.json();
    return data.results as LocationData[];
}

export async function displayLocations() {
    const locationsData = await fetchLocations();

    containerLocations!.innerHTML = '';

    const bottomButtons = document.createElement('div');
        bottomButtons.classList.add('button-container'); 

        const loadLocationsButton = document.createElement('button');
        loadLocationsButton.textContent = 'Load More Locations';
        loadLocationsButton.classList.add('location-button');
        loadLocationsButton.addEventListener('click', async () => {
            await loadMoreLocations();
        });

        bottomButtons.appendChild(loadLocationsButton);

        containerLocations!.appendChild(bottomButtons);

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
            
            locationElement.addEventListener("click", async () => {
                await createLocationsModal(location);
            });

            locationElement.setAttribute("data-bs-toggle", "modal");
            locationElement.setAttribute("data-bs-target", "#exampleModal");
        }

        containerLocations!.appendChild(row);
    }
}

let locationCounter = 20;
const locationsPerPage = 20; 

export async function loadMoreLocations() {
    try {
        const nextPageUrl = `https://rickandmortyapi.com/api/location?page=${Math.floor(locationCounter / locationsPerPage) + 1}`;
        const response = await fetch(nextPageUrl);
        const data = await response.json();
        const newLocations: LocationData[] = data.results;

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

                locationElement.addEventListener("click", async () => {
                    await createLocationsModal(location);
                });

                locationElement.setAttribute("data-bs-toggle", "modal");
                locationElement.setAttribute("data-bs-target", "#exampleModal");
            }
            containerLocations!.appendChild(locationRow);
        }

        locationCounter += locationsPerPage;

        if (newLocations.length > 0) {
            const lastLocationElement = containerLocations.lastElementChild;
            if (lastLocationElement) {
                lastLocationElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
            }
        }

    } catch (error) {
        console.error("Error loading more locations:", error);
    }
    const bottomButtons = document.createElement('div');
        bottomButtons.classList.add('button-container'); 

        const loadLocationsButton = document.createElement('button');
        loadLocationsButton.textContent = 'Load More Locations';
        loadLocationsButton.classList.add('location-button');
        loadLocationsButton.addEventListener('click', async () => {
            await loadMoreLocations();
        });
        bottomButtons.appendChild(loadLocationsButton);

        containerLocations!.appendChild(bottomButtons);

}

    async function createLocationsModal(location: LocationData): Promise<void> {
    const modal = document.getElementById("exampleModal") as HTMLElement;

    const modalTitle = modal.querySelector(".modal-title") as HTMLElement;
    const modalBody = modal.querySelector(".modal-body") as HTMLElement;

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
    
        const residentsNames = await fetchResidentsNames(location.residents);

        if (residentsNames.length > 0) {
        const residentsList = document.createElement("ul");
        residentsNames.forEach(residentName => {
            const residentItem = document.createElement("li");
            residentItem.textContent = residentName;
            residentItem.classList.add("resident-name");

            residentItem.addEventListener("click", async () => {
                const response = await fetch(`https://rickandmortyapi.com/api/character?name=${residentName}`);
                const data = await response.json();
                const character = data.results[0]; 
                
                createCharacterModal(character);
            });

            residentsList.appendChild(residentItem);
            });

            residentsElement.appendChild(residentsList);
            } else {
        residentsElement.textContent = "No residents";
            }
    
        modalBody.appendChild(residentsElement);
    
        async function fetchResidentsNames(residentUrls: string[]): Promise<string[]> {
            const residentsNames: string[] = [];
        
            const residentPromises = residentUrls.map(async (url) => {
                const residentResponse = await fetch(url);
                const residentData = await residentResponse.json();
                residentsNames.push(residentData.name);
            });
        
            await Promise.all(residentPromises);
        
            return residentsNames;
        }
    };

    loadMoreButton.addEventListener("click", loadMoreEpisodes);


    async function loadEpisodeAndCharacters(episodeId: number): Promise<void> {
        try {
            const episodeResponse = await fetch(`https://rickandmortyapi.com/api/episode/${episodeId}`);
            const episode = await episodeResponse.json();
    
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
            
            const characterIds = episode.characters.map((url: string) => parseInt(url.split('/').pop() || ''));
    
            const characterPromises = characterIds.map((id:number) => fetch(`https://rickandmortyapi.com/api/character/${id}`));
            const characterResponses = await Promise.all(characterPromises);
            const characters = await Promise.all(characterResponses.map(response => response.json()));
    
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
    
        } catch (error) {
            console.error("Error loading episode and characters:", error);
        }
    };

    export function init() {
        (async () => {
            const locationsButton = document.getElementById("locationsButton") as HTMLButtonElement;
            locationsButton.addEventListener("click", () => {
                containerCharacters.style.display = "none";
                containerLocations.style.display = "block";
                displayLocations();
            });
    
            await (async () => {
                await loadEpisodes();
            })();
    
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
        })();
    };