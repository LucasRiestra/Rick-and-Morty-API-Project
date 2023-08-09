const locationsButton = document.getElementById("locationsButton") as HTMLButtonElement;
const containerCharacters = document.getElementById("container-characters") as HTMLDivElement;
const containerLocations = document.getElementById("container-locations") as HTMLDivElement;

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
        const backToEpisodesButton = document.createElement('button');
        backToEpisodesButton.textContent = 'Back to Episodes';
        backToEpisodesButton.classList.add('backToEpisodes-button');
        backToEpisodesButton.addEventListener('click', () => {
            window.location.href = "index.html";
        });

        const loadLocationsButton = document.createElement('button');
        loadLocationsButton.textContent = 'Load More Locations';
        loadLocationsButton.classList.add('location-button');
        loadLocationsButton.addEventListener('click', async () => {
            await loadMoreLocations();
        });

        bottomButtons.appendChild(backToEpisodesButton);
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

    } catch (error) {
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
        loadLocationsButton.addEventListener('click', async () => {
            await loadMoreLocations();
        });

        bottomButtons.appendChild(backToEpisodesButton);
        bottomButtons.appendChild(loadLocationsButton);

        containerLocations!.appendChild(bottomButtons);

}

export function init() {
    const locationsButton = document.getElementById("locationsButton") as HTMLButtonElement;
    locationsButton.addEventListener("click", () => {
        containerCharacters.style.display = "none";
        containerLocations.style.display = "block";
        displayLocations();
    });
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