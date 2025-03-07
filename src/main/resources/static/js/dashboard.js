'use strict';

(function() {

    const API_BASE_URL = "http://localhost:9090/api";




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


    document.getElementById('logoutBtn').addEventListener('click', logout);


})();

