'use scritct';


(function () {

    const API_BASE_URL = "http://localhost:9090/api";
    const ERROR_ELEMENT = document.getElementById('error-message');
    const URL_INPUT = document.getElementById('url-input');
    const SHORT_URL_INPUT = document.getElementById('short-url');
    const RESULT_SECTION = document.getElementById('result-section');
    const COPY_BUTTON = document.getElementById('copy-btn');


    async function shortenUrl() {
        const longUrl = URL_INPUT.value.trim();
        if (!longUrl || !isValidURL(longUrl)) {
            showError("Por favor, insira uma URL válida!");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/shorten-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: longUrl })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao encurtar a URL!');
            }

            const data = await response.json();
            showResult(data.url);

        } catch (error) {
            showError(error.message);
        }

    }

    function showResult(shortUrl) {
        SHORT_URL_INPUT.value = shortUrl;
        SHORT_URL_INPUT.setAttribute('href', encodeURI(shortUrl));
        RESULT_SECTION.style.display = 'block';

        COPY_BUTTON.onclick = () => {
            navigator.clipboard.writeText(shortUrl)
                .then(() => {
                    COPY_BUTTON.innerHTML = `<i class="fas fa-check"></i> Copiado!`;
                    setTimeout(() => {
                        COPY_BUTTON.innerHTML = `<i class="fas fa-copy"></i> Copiar`;
                    }, 2000);
                })
                .catch(err => console.error('Erro ao copiar:', err));
        };
    }


    function isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    function showError(message) {
        ERROR_ELEMENT.textContent = message;
        ERROR_ELEMENT.style.display = 'block';
    }

    window.shortenUrl = shortenUrl;

})();



