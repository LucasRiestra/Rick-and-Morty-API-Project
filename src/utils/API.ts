const url = "https://rickandmortyapi.com/api/";
const urlCharacters = `${url}/character`;

export async function getCharacters(){
    const response = await fetch(urlCharacters)
    const data = await response.json();
    return data.results;
}

