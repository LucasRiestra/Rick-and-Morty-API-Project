
interface Character {
    name: string;
    status: CharacterStatus;
    species: CharacterSpecies;
    gender: CharacterGender;
    image: string;
    location: LocationData;
    episode: string[];
    url:string;
}

 enum CharacterStatus {
    Alive = "Alive",
    Dead = "Dead",
    Unknown = "unknown"
}
 enum CharacterSpecies {
    Human = "Human",
    Alien = "Alien",
    Other = "unknown"
}

 enum CharacterGender {
    Male = "Male",
    Female = "Female",
    Genderless = "Genderless",
    Unknown = "unknown"
}

interface LocationData {
    id: number;
    name: string;
    type: string;
    dimension: string;
    residents: string[];
    url:string;
    location: string;
}

const containerCharacters = document.getElementById("container-characters") as HTMLDivElement;
const containerLocations = document.getElementById("container-locations") as HTMLDivElement;

export const mainContainer = document.getElementById("container-characters") as HTMLDivElement;

import { displayLocations } from "./locations.js";

export async function loadEpisodeAndCharacters(episodeId: number): Promise<void> {
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

    } catch (error) {
        console.error("Error loading episode and characters:", error);
    }
}

export async function createCharacterModal(character: Character): Promise<void> {
    const modal = document.getElementById("exampleModal") as HTMLElement;

    const modalTitle = modal.querySelector(".modal-title") as HTMLElement;
    const modalBody = modal.querySelector(".modal-body") as HTMLElement;

    modalTitle.textContent = character.name;

    const characterImage = document.createElement("img");
    characterImage.src = character.image;
    characterImage.alt = character.name;

    const statusParagraph = document.createElement("p");
    statusParagraph.textContent = `Status: ${character.status}`;

    const speciesParagraph = document.createElement("p");
    speciesParagraph.textContent = `Species: ${character.species}`;

    const locationResponse = await fetch(character.location.url);
    const locationData = await locationResponse.json();

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

    const characterEpisodesHeader = document.createElement("h3");
    characterEpisodesHeader.textContent = "Episodes";

    characterEpisodes.appendChild(characterEpisodesHeader);

    for (const episodeUrl of character.episode) {
        const episodeResponse = await fetch(episodeUrl);
        const episodeData = await episodeResponse.json();

        const episodeNameParagraph = document.createElement("h5");
        episodeNameParagraph.textContent = `Episode: ${episodeData.name}`;

        const episodeCodeParagraph = document.createElement("p");
        episodeCodeParagraph.textContent = `Code: ${episodeData.episode}`;

        characterEpisodes.appendChild(episodeNameParagraph);
        characterEpisodes.appendChild(episodeCodeParagraph);
    }

    modalBody.appendChild(characterEpisodes);

    async function updateModalWithLocationInfo(location: LocationData): Promise<void> {
        const modalBody = document.querySelector(".modal-body") as HTMLElement;
        const modalTitle = document.querySelector(".modal-title") as HTMLElement;
    
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
};
