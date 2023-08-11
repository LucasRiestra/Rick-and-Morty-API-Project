import { loadEpisodes } from "./types/episodes.js";
import { createCharacterModal, mainContainer } from "./types/characters.js";
import { fetchLocations } from "./types/locations.js";

window.addEventListener("load", init);

async function init() {
    await loadEpisodes(); 
    await fetchLocations();

    const characterImages = mainContainer.querySelectorAll(".character-image");
    characterImages.forEach(characterImage => {
        characterImage.addEventListener("click", async () => {
            if (characterImage instanceof HTMLImageElement) {
                const characterId = characterImage.dataset.characterId!;
                const character = await fetchCharacter(characterId);

                if (character) {
                    await createCharacterModal(character);
                }
            }
        });
    });
}

async function fetchCharacter(characterId: string) {
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
        if (response.ok) {
            const character = await response.json();
            return character;
        } else {
            console.error("Error fetching character details");
            return null;
        }
    } catch (error) {
        console.error("Error fetching character details:", error);
        return null;
    }
}