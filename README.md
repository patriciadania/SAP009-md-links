# Markdown Links 💻

Quarto projeto desenvolvido pelo bootcamp @Laboratoria . [BACK-END] Markdown Links (md-links) é uma lib para identificar links em arquivos markdown, bem como seus respectivos status https. Criada usando NodeJS, pode ser executada através de CLI.

***
<div align="center">
  
  
 
  <img align="center" alt="Rafa-Js" height="30" width="40" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-plain.svg">
  <img align="center" alt="vscode" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" />
  
  <br>

  Desenvolvido por : <br>
  <br>
    Patricia Adania de Oliveira<br>
  [Linkedin](https://www.linkedin.com/in/patriciadania/) | [Github](https://github.com/patriciadania)
  <br>

  
</div>
 
***

## Índice

* [1. Prefácio](#1-prefácio)
* [2. Resumo do projeto](#2-resumo-do-projeto)
* [3. Instalação](#3-instalação)
* [4. Comandos](#4-comandos)
* [5. Arquivos do Projeto](#5-arquivos-do-projeto)
* [6. Teste](#6-teste)
* [7. Fluxograma](#7-fluxograma)


***

## 1. Prefácio

[Markdown](https://pt.wikipedia.org/wiki/Markdown) é uma linguagem de marcação
muito popular entre os programadores. É usada em muitas plataformas que
manipulam texto (GitHub, fórum, blogs e etc) e é muito comum encontrar arquivos
com este formato em qualquer repositório (começando pelo tradicional
`README.md`).

Os arquivos `Markdown` normalmente contém _links_ que podem estar
quebrados, ou que já não são válidos, prejudicando muito o valor da
informação que está ali.

Uma comunidade open source nos propôs criar uma ferramenta, usando
[Node.js](https://nodejs.org/), que leia e analise arquivos no formato
`Markdown`, para verificar os arquivos que contenham links e mostrar algumas
estatísticas.


## 2. Resumo do projeto

Neste projeto, foi criado uma ferramenta de linha de comando (CLI) assim como
a sua própria biblioteca (library) em Javascript.

Desta vez, ficamos um pouco longe do navegador para construir um programa
executado com Node.js. Iremos aprender sobre processos
(`process.env`, `process.argv`, ...),como interagir com sistemas de arquivos,
como fazer consultas de rede, etc.

[Node.js](https://nodejs.org/pt-br/) é um ambiente de execução para JavaScript
construído com o [motor de JavaScript V8 do
Chrome](https://developers.google.com/v8/). Ele vai nos permitir executar o
JavaScript no nosso sistema operacional, seja no seu computador ou em um
servidor, o que nos abre portas para poder interagir com sistemas, arquivos,
redes e etc.

Desenvolver sua própria biblioteca é uma experiência fundamental para qualquer
desenvolvedora, pois te obriga a pensar na interface (API) dos seus _módulos_ e
como ela será usada por outras desenvolvedoras. Você deve levar em conta as
peculiaridades da linguagem, convenções e boas práticas.


## 3. Instalação
  

   npm install patriciadania/md-links
    
## 4. Comandos

<div style="display:flex">
  <div align="center">
    <img alt="sem comando" width="850"src="https://user-images.githubusercontent.com/120285942/233188268-57610ee2-428e-45f3-8009-9106f44bbf5f.png"/><br>
  

    Comando: $ md-links ./arquivos/texto.md
    

  <div align="center">
    <img alt="comando validate" width="850"src="https://user-images.githubusercontent.com/120285942/232912970-6280d788-f60f-4da1-a72e-8a5559e50369.png"/><br>
  
    Comando: $ md-links ./arquivos/texto.md --validate
  </div>

  <div align="center">
    <img alt="comando stats" width="650"src="https://user-images.githubusercontent.com/120285942/232913456-0ee7ce2b-a00e-4ede-9ffc-3e6867f50723.png"/><br>
  
    Comando: $ md-links ./arquivos/texto.md --stats
</div>


  <div align="center">
    <img alt="comando validate e stats" width="650"src="https://user-images.githubusercontent.com/120285942/232914246-8f51328a-591b-4456-9bd2-2507a9a77c15.png"/><br>
  
    Comando: $ md-links ./arquivos/texto.md --stats --validate
</div>
</div>


## 5. Arquivos do Projeto

* `README.md` com descrição do módulo, instruções de instalação e uso,
  documentação da API e exemplos. Tudo que for relevante para qualquer
  desenvolvedora saber como utilizar a sua biblioteca sem inconvenientes.
* `index.js`: este arquivo deve exportar a função `mdLinks`.
* `package.json` deve possuir o nome, versão, descrição, autor, licença,
  dependências e scripts (pretest, test e etc).
* `.editorconfig` com a configuração para o editor de texto. Este arquivo não
  deve ser alterado.
* `.eslintrc` com a configuração para o linter. Este arquivo contém uma
configuração básica para ESLint, se quiser colocar regras adicionais
como Airbnb, você deverá modificar este arquivo.
* `.gitignore` para ignorar o `node_modules` e outras pastas que não devem
  ser incluídas no controle de versão (`git`).
* `test/md-links.spec.js` deve conter os testes unitários para a função
  `mdLinks()`. A sua implementação deve rodar estes testes.

## 6. Teste
 <div style="display:flex">
  <div align="center">
    <img alt="teste" width="850"src="https://user-images.githubusercontent.com/120285942/232915321-ac34e33a-b279-45b2-be1f-71527183b4b6.png"/><br>
  
   Função mdLinks passou no teste.
  </div>
   </div>



## 7. Fluxograma

 <div style="display:flex">
  <div align="center">
    <img alt="fluxograma" width="650"src="https://user-images.githubusercontent.com/120285942/233455697-88c128f1-e00d-4b65-8864-6eb746131a68.jpg"/><br>


   Fluxograma para estudos.
  </div>
 </div>
