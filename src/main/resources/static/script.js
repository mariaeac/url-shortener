const API_BASE_URL = "http://localhost:9090/api";



async function shortenUrl() {
    const ERROR_ELEMENT = document.getElementById('error-message');
    const URL_INPUT = document.getElementById('url-input');
    const longUrl = URL_INPUT.value.trim();


    if (!longUrl || !isValidURL(longUrl)) {
        ERROR_ELEMENT.textContent = "Por favor, insira uma URL válida!";
        ERROR_ELEMENT.style.display = 'block';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/shorten-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({url: longUrl})
            });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao encurtar a URL');
        }

        const data = await response.json();
        showResult(data.url)

    } catch (error) {

        ERROR_ELEMENT.textContent = error.message();
        ERROR_ELEMENT.style.display = 'block';

    }
}

function showResult(shortUrl) {
    const SHORT_URL_ELEMENT = document.getElementById('short-url');
    const RESULT_DIV = document.getElementById('result');


    SHORT_URL_ELEMENT.textContent = shortUrl;
    SHORT_URL_ELEMENT.href = shortUrl;
    RESULT_DIV.style.display = 'block';

}

async function copyURLToClipboard() {
    const SHORT_URL_ELEMENT = document.getElementById('short-url');

    try {
        await navigator.clipboard.writeText(SHORT_URL_ELEMENT.textContent);
        alert("URL encurtada copiada com sucesso!");
    } catch (error) {
        alert("Ocorreu um erro ao copiar a URL");
    }
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }

}