var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadEpisodes } from "./types/episodes.js";
import { createCharacterModal, mainContainer } from "./types/characters.js";
import { fetchLocations } from "./types/locations.js";
window.addEventListener("load", init);
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadEpisodes();
        yield fetchLocations();
        ;
        const characterImages = mainContainer.querySelectorAll(".character-image");
        characterImages.forEach(characterImage => {
            characterImage.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                if (characterImage instanceof HTMLImageElement) {
                    const characterId = characterImage.dataset.characterId;
                    const character = yield fetchCharacter(characterId);
                    if (character) {
                        yield createCharacterModal(character);
                    }
                }
            }));
        });
    });
}
function fetchCharacter(characterId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
            if (response.ok) {
                const character = yield response.json();
                return character;
            }
            else {
                console.error("Error fetching character details");
                return null;
            }
        }
        catch (error) {
            console.error("Error fetching character details:", error);
            return null;
        }
    });
}
