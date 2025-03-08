'use strict';

(function() {

    const API_BASE_URL = "http://localhost:9090/api";
    const URL_INPUT = document.getElementById('url-input');
    const SHORT_URL_INPUT = document.getElementById('shortened-url');
    const RESULT_SECTION = document.getElementById('result-section');
    const COPY_BUTTON = document.getElementById('copyBtn');

    async function loadUserInfo() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/info`, {
                credentials: 'include'
            });

            if(!response.ok) {
                throw new Error('Falha ao carregar os dados!');
            }

            const userData = await response.json();
            document.getElementById('username').textContent = userData.username;

        } catch (error) {
            console.log('Erro:' , error)
        }
    }

    async function shortenUrl() {
        const longUrl = URL_INPUT.value.trim();

        if (!longUrl || !isValidURL(longUrl)) {
            // TODO: Substituir depois por um método para mostrar as mensagens de erro corretamente.
            throw new Error('Por favor, insira uma URL válida!');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/urls`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: longUrl
                })
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao encurtar a URL!');
            }

            const data = await response.json();
            showResult(data.url);

        } catch (error) {
            // TODO: Substituir depois por um método para mostrar as mensagens de erro corretamente.
            console.log('Error: ', error);
        }

    }

    async function loadUserUrls() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/urls`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Falha ao carregar URLs');
            }

            const urls = await response.json();
            renderUrls(urls)

        } catch (error) {
            console.log('Erro: ', error);
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


                    void COPY_BUTTON.offsetWidth;

                    setTimeout(() => {
                        COPY_BUTTON.innerHTML = `<i class="fas fa-copy"></i> Copiar`;
                    }, 2000);
                })
                .catch(err => console.error('Erro ao copiar:', err));
        };
    }

    function formatTimeRemaining(expiresAt) {
        const now = new Date();
        const expiration = new Date(expiresAt);
        const diffInMilliseconds = expiration - now;

        const seconds = Math.floor(diffInMilliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours % 24 > 0) parts.push(`${hours % 24}h`);
        if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
        if (seconds % 60 > 0) parts.push(`${seconds % 60}s`);

        return parts.join(" ") + " restantes";

    }


    function renderUrls(urls) {
        const tbody = document.querySelector('#linksTable tbody');
        tbody.innerHTML = '';

        urls.forEach(url => {
            const row = document.createElement('tr');


            const originalUrlCell = document.createElement('td');
            originalUrlCell.textContent = url.originUrl;


            const shortUrlCell = document.createElement('td');
            const shortUrlLink = document.createElement('a');
            shortUrlLink.href = url.shortUrl;
            shortUrlLink.textContent = url.shortUrl;
            shortUrlLink.target = '_blank';
            shortUrlCell.appendChild(shortUrlLink);

            const expiresAtCell = document.createElement('td');
            expiresAtCell.className = 'expires-at';
            expiresAtCell.dataset.expiration = url.expiresAt;
            updateTimeRemaining(expiresAtCell);

            const clicksCell = document.createElement('td');
            clicksCell.textContent = url.clicksCount;


            const actionsCell = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Excluir';
            deleteBtn.className = 'delete-btn';
            deleteBtn.dataset.urlId = url.id;
            deleteBtn.onclick = () => deleteUrl(url.id);

            actionsCell.appendChild(deleteBtn);


            row.appendChild(originalUrlCell);
            row.appendChild(shortUrlCell);
            row.appendChild(expiresAtCell);
            row.appendChild(clicksCell);
            row.appendChild(actionsCell);

            tbody.appendChild(row);

            setInterval(() => {
                document.querySelectorAll('.expires-at').forEach(updateTimeRemaining);
            }, 1000);

        });

    }

    function updateTimeRemaining(element) {
        const expiration = element.dataset.expiration;
        element.textContent = formatTimeRemaining(expiration);
    }


    async function logout() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                localStorage.removeItem('jwtToken')
                window.location.href='/index.html'
            }

        } catch (error) {
            console.log('Ocorreu um erro durante o logout: ', error);
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


    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('shortenBtn').addEventListener('click', shortenUrl);
    document.addEventListener('DOMContentLoaded', loadUserInfo);
    document.addEventListener('DOMContentLoaded', loadUserUrls);






})();

