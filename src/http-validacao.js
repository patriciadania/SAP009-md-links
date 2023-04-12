function extraiLinks(arrLinks) {
    return arrLinks.map((objetoLink) => Object.values(objetoLink).join())
}

function checaStatus(listaURLs) {
    return Promise.all(
        listaURLs.map((url) => {
            return fetch(url)
                .then(response => response.status)
                .catch(erro => manejaErros(erro));
        })
    );
}

function manejaErros(erro) {
    if (erro.cause.code === 'UND_ERR_CONNECT_TIMEOUT') {
        return 'Link nao encontrado';
    } else {
        return ' Ocorreu um erro';
    }
}

export default function listaValidada(listaDeLinks) {
    const links = extraiLinks(listaDeLinks);
    return checaStatus(links).then(status => {
        return listaDeLinks.map((objeto, indice) => ({
            ...objeto,
            status: status[indice]
        }));
    });
}
