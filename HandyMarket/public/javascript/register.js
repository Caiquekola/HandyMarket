document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Pegando os valores dos inputs
            const nome = document.getElementById('nome')?.value;
            const sobrenome = document.getElementById('sobrenome')?.value;
            const email = document.getElementById('email')?.value;
            const senha = document.getElementById('senha')?.value;
            const confsenha = document.getElementById('confsenha')?.value;
            const data_nasc = document.getElementById('datansc')?.value;
            const genero = document.getElementById('genero')?.value;

            // Verifica se algum valor é null ou undefined
            if (!nome || !sobrenome || !email || !senha || !confsenha || !data_nasc || !genero) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            if (senha !== confsenha) {
                alert('As senhas não coincidem.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome, sobrenome, email, senha, data_nasc, genero })
                });

                if (response.ok) {
                    const data = await response.json();
                    alert('Usuário cadastrado com sucesso!');
                    console.log(data);
                } else {
                    alert('Erro ao cadastrar usuário.');
                }
            } catch (error) {
                console.error('Erro ao enviar dados', error);
                alert('Erro ao enviar dados.');
            }
        });
    } else {
        console.error('Formulário de registro não encontrado!');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('loginEmail')?.value;
            const senha = document.getElementById('loginSenha')?.value;

            if (!email || !senha) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, senha })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.redirect) {
                        window.location.href = data.redirect;
                    } else {
                        alert('Login bem-sucedido!');
                        console.log(data);
                    }
                } else {
                    const message = await response.text();
                    alert(message); // Exibe a mensagem de erro do servidor
                }
            } catch (error) {
                console.error('Erro ao enviar dados', error);
                alert('Erro ao enviar dados.');
            }
        });
    } else {
        console.error('Formulário de login não encontrado!');
    }
});