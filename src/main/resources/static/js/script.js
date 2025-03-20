'use strict';


(function () {

    const API_BASE_URL = "http://localhost:9090/api";
    const ERROR_ELEMENT = document.getElementById('error-message');
    const URL_INPUT = document.getElementById('url-input');
    const SHORT_URL_INPUT = document.getElementById('short-url');
    const RESULT_SECTION = document.getElementById('result-section');
    const COPY_BUTTON = document.getElementById('copy-btn');

    function switchTab(tabName) {
        document.querySelectorAll('.tab, .form').forEach(element => {
            element.classList.remove('active');
        });

        document.querySelector(`#${tabName}Form`).classList.add('active');
        document.querySelector(`button[onclick="switchTab('${tabName}')"]`).classList.add('active');
    }



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




    function checkPasswordStrength(password) {
        let strength = 0;
        const strengthSegments = document.querySelectorAll('.strength-segment');
        const strengthText = document.querySelector('.strength-text');


        strengthSegments.forEach(segment => {
            segment.className = 'strength-segment';
        });

        if (password.length === 0) {
            strengthText.textContent = 'Força da senha';
            return;
        }


        const patterns = {
            comprimento: password.length >= 8,
            letrasMinusculas: /[a-z]/.test(password),
            letrasMaiusculas: /[A-Z]/.test(password),
            numeros: /[0-9]/.test(password),
            caracteresEspeciais: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };


        strength += patterns.comprimento ? 1 : 0;
        strength += patterns.letrasMinusculas ? 1 : 0;
        strength += patterns.letrasMaiusculas ? 1 : 0;
        strength += patterns.numeros ? 1 : 0;
        strength += patterns.caracteresEspeciais ? 1 : 0;

        let strengthClass = '';
        let strengthMessage = '';

        if (strength <= 2) {
            strengthClass = 'weak';
            strengthMessage = 'Fraca';
        } else if (strength <= 3) {
            strengthClass = 'medium';
            strengthMessage = 'Média';
        } else {
            strengthClass = 'strong';
            strengthMessage = 'Forte';
        }


        for (let i = 0; i < strengthSegments.length; i++) {
            if (i < Math.ceil(strength * (4/5))) {
                strengthSegments[i].classList.add(strengthClass);
            }
        }

        strengthText.textContent = strengthMessage;
        return strength;
    }

    function setupForms() {
        setupLoginForm();
        setupRegisterForm();


        const passwordInput = document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                checkPasswordStrength(e.target.value);
            });
        }


        setupPasswordToggles();
    }



    function setupLoginForm() {
        const loginForm = document.getElementById('loginForm');

        loginForm.addEventListener('submit', async (e) => { e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (!email || !password) {
                showMessage('loginMessage', 'Preencha todos os campos!', 'error');
                return;
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


                if (response.ok) {

                    window.location.href = '/dashboard';

                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erro no login');
                }

            } catch (error) {
                showMessage('loginMessage', error.message || 'Erro de conexão', 'error');
                console.error('Erro detalhado:', error);

            }

        })
    }

    

    function setupRegisterForm() {
        const registerForm = document.getElementById('registerForm');

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('registerUsername').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value.trim();
            const confirmPassowrd = document.getElementById('registerConfirmPassword').value.trim();



            if (!username || !email || !password || !confirmPassowrd) {
                showMessage('registerMessage', 'Preencha todos os campos!', 'error');
                return;
            }

            if (password !== confirmPassowrd) {
                showMessage('registerMessage', 'As senhas não coincidem!', 'error');
                return;
            }

            if (passwordInput) {
                passwordInput.addEventListener('input', (e) => {
                    checkPasswordStrength(e.target.value);
                });
            }

             

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({username: username,
                    email: email,
                    password: password})
                });

                if (response.status == 201) {
                    showMessage('registerMessage', 'Cadastro realizado!', 'success');
                    registerForm.reset();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erro no cadastro!');
                }

            } catch (error) {
                showMessage('registerMessage', error.message || 'Erro de conexão', 'error');
                console.log('Erro detalhado: ', error);
            }

        })
    }




    function isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    function checkPasswordStrength(password) {
        let strength = 0;
        const strengthSegments = document.querySelectorAll('.strength-segment');
        const strengthText = document.querySelector('.strength-text');

       
        strengthSegments.forEach(segment => {
            segment.className = 'strength-segment';
        });

        if (password.length === 0) {
            strengthText.textContent = 'Força da senha';
            return;
        }

      
        const patterns = {
            comprimento: password.length >= 8,
            letrasMinusculas: /[a-z]/.test(password),
            letrasMaiusculas: /[A-Z]/.test(password),
            numeros: /[0-9]/.test(password),
            caracteresEspeciais: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        
        strength += patterns.comprimento ? 1 : 0;
        strength += patterns.letrasMinusculas ? 1 : 0;
        strength += patterns.letrasMaiusculas ? 1 : 0;
        strength += patterns.numeros ? 1 : 0;
        strength += patterns.caracteresEspeciais ? 1 : 0;

       
        let strengthClass = '';
        let strengthMessage = '';

        if (strength <= 2) {
            strengthClass = 'weak';
            strengthMessage = 'Fraca';
        } else if (strength <= 3) {
            strengthClass = 'medium';
            strengthMessage = 'Média';
        } else {
            strengthClass = 'strong';
            strengthMessage = 'Forte';
        }

        for (let i = 0; i < strengthSegments.length; i++) {
            if (i < Math.ceil(strength * (4/5))) {
                strengthSegments[i].classList.add(strengthClass);
            }
        }

        strengthText.textContent = strengthMessage;
        return strength;
    }



    function showMessage(elementId, text, type) {
        const element = document.getElementById(elementId);
        element.textContent = text;
        element.className = `message ${type}`;
        element.style.display = 'block';
    }

    function showError(message) {
        ERROR_ELEMENT.textContent = message;
        ERROR_ELEMENT.style.display = 'block';
    }

    document.addEventListener('DOMContentLoaded', () => {
        const togglePasswordButtons = document.querySelectorAll('.toggle-password');

        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Encontra o input de senha relacionado
                const passwordInput = this.parentElement.querySelector('input[type="password"], input[type="text"]');
                const icon = this.querySelector('i');

                // Alterna o tipo do input
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);

                // Alterna o ícone
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        });
    });

    document.addEventListener('DOMContentLoaded', setupForms);

    window.switchTab = switchTab;
    window.shortenUrl = shortenUrl;


})();



