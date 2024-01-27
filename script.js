const listaLivros = () => {
    const storedBooks = JSON.parse(localStorage.getItem('livros')) || {};
    return storedBooks;
}

const salvarLivros = (livros) => {
    localStorage.setItem('livros', JSON.stringify(livros));
}

const apresentarLista = () => {
    const elementoListaLivros = document.getElementById('livrosBody');
    if (!elementoListaLivros) {
        console.error('Elemento com ID "livrosBody" não encontrado.');
        return;
    }

    const livros = listaLivros();

    // Ordena os livros por nome
    const livrosOrdenados = Object.keys(livros)
        .sort()
        .reduce((obj, key) => {
            obj[key] = livros[key];
            return obj;
        }, {});

    elementoListaLivros.innerHTML = '';

    for (const nomeLivro in livrosOrdenados) {
        const autores = livrosOrdenados[nomeLivro];
        const row = elementoListaLivros.insertRow();

        const cellLivro = row.insertCell(0);
        const cellAutor = row.insertCell(1);
        const cellAcoes = row.insertCell(2); // Nova coluna para as ações

        cellLivro.textContent = nomeLivro;
        cellAutor.textContent = autores.join(', ');

        // Adiciona botão de excluir com caixa de confirmação
        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.addEventListener('click', () => confirmarExclusao(nomeLivro));
        cellAcoes.appendChild(btnExcluir);
    }
}

const confirmarExclusao = (nomeLivro) => {
    const confirmacao = confirm(`Tem certeza que deseja excluir o livro ${nomeLivro}?`);
    if (confirmacao) {
        excluirLivro(nomeLivro);
        apresentarLista();
    }
}

const excluirLivro = (nomeLivro) => {
    const livros = listaLivros();
    delete livros[nomeLivro];
    salvarLivros(livros);
}

const addLivro = () => {
    const nomeLivro = prompt('Digite o nome do livro: ');
    const nomeAutor = prompt('Digite o nome do autor: ');

    if (nomeLivro.length > 0 && nomeAutor.length > 0) {
        const livros = listaLivros();

        // Verifica se o livro já existe na lista
        if (!livros[nomeLivro]) {
            livros[nomeLivro] = [];
        }

        // Adiciona o autor ao livro correspondente
        livros[nomeLivro].push(nomeAutor);

        // Salva a lista atualizada
        salvarLivros(livros);
        apresentarLista();
    } else {
        alert('Por favor, digite o nome do livro e do autor.');
    }
}

const fetchBooks = () => {
    fetch('https://www.googleapis.com/books/v1/volumes?q=Percy+Jackson')
        .then(response => response.json())
        .then(data => processarRespostaApi(data))
        .catch(error => console.error('Erro ao obter a lista de livros:', error));
}

const processarRespostaApi = (data) => {
    const livros = {};

    data.items.forEach(item => {
        const volumeInfo = item.volumeInfo;
        const title = volumeInfo.title;
        const authors = volumeInfo.authors;

        if (title && authors && authors.length > 0) {
            if (!livros[title]) {
                livros[title] = [];
            }
            livros[title].push(authors.join(', '));
        }
    });

    salvarLivros(livros);
    apresentarLista();
}

// Ajuste para apresentar a lista inicial ao carregar a página
window.onload = function () {
    apresentarLista();
    fetchBooks();
};
