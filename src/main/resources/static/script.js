const API_BASE_URL = "http://localhost:9090/api";

function switchTab(tabName) {
    document.querySelectorAll('.tab, .form').forEach(element => {
        element.classList.remove('active');
    });

    document.querySelector(`#${tabName}Form`).classList.add('active');
    document.querySelector(`button[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

// Funções principais
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
            body: JSON.stringify({ url: longUrl })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao encurtar a URL');
        }

        const data = await response.json();
        showResult(data.shortUrl);

    } catch (error) {
        ERROR_ELEMENT.textContent = error.message;
        ERROR_ELEMENT.style.display = 'block';
    }
}

function showResult(shortUrl) {
    const SHORT_URL_ELEMENT = document.getElementById('short-url');
    const RESULT_DIV = document.getElementById('result');

    SHORT_URL_ELEMENT.textContent = shortUrl;
    SHORT_URL_ELEMENT.href = shortUrl;
    RESULT_DIV.style.display = 'block';

    getClicksCount(shortUrl);
}

let updateInterval;

async function getClicksCount(shortUrl) {
    // Limpa intervalo anterior se existir
    if (updateInterval) clearInterval(updateInterval);

    updateInterval = setInterval(async () => {
        try {
            const response = await fetch(`${shortUrl}/clicks`);
            const data = await response.json();
        } catch (error) {
            console.error('Erro ao buscar cliques:', error);
        }
    }, 5000);
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

// Registro / Login de Usuário
document.addEventListener('DOMContentLoaded', () => {
    setupRegisterForm();
    setupLoginForm();
});

function setupLoginForm() {
     const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        console.log(email, password);

        if (!email || !password) {
            console.log('Preencha todos os campos!');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })

            });

            if (response.status === 202) {
                showRegisterMessage(messageElement, 'Login realizado!', 'success');
                loginForm.reset();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro no cadastro');
            }


        } catch (error) {
            if (error instanceof SyntaxError) {
                showRegisterMessage(messageElement, 'Resposta inválida do servidor', 'error');
            } else {
                showRegisterMessage(messageElement, error.message || 'Erro de conexão', 'error');
            }
            console.error('Erro detalhado:', error);
        }


    });
}


function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const messageElement = document.getElementById('registerMessage');

        // Validações
        if (!username || !email || !password || !confirmPassword) {
            showRegisterMessage(messageElement, 'Preencha todos os campos!', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showRegisterMessage(messageElement, 'As senhas não coincidem!', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });

            if (response.status === 201) {
                showRegisterMessage(messageElement, 'Cadastro realizado!', 'success');
                registerForm.reset();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro no cadastro');
            }

        } catch (error) {
            if (error instanceof SyntaxError) {
                showRegisterMessage(messageElement, 'Resposta inválida do servidor', 'error');
            } else {
                showRegisterMessage(messageElement, error.message || 'Erro de conexão', 'error');
            }
            console.error('Erro detalhado:', error);
        }
    });
}

function showRegisterMessage(element, text, type) {
    element.textContent = text;
    element.className = `message ${type}`;
    element.style.display = 'block';

    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}