const serveurl = process.env.SERVER_API;

const cores = [];
const tamanhos = [];
let precos = null;
let ordens = [];
let end = 9;

const faixaPrecos = [
  "price_gte=0&price_lte=50",
  "price_gte=51&price_lte=151",
  "price_gte=151&price_lte=301",
  "price_gte=301&price_lte=501",
  "price_gte=500",
];

bundle();

function getRoupas(url) {
  let request = new XMLHttpRequest();
  request.open("GET", url, false);
  request.send();
  return request.responseText;
}

const filtroOrdem = [...document.querySelectorAll(".title select")];
filtroOrdem.forEach(function (e) {
  e.addEventListener("click", function () {
    ordens = e.value;
    bundle();
  });
});

const precoProduto = document.querySelectorAll(".price input");
precoProduto.forEach(function (e) {
  const valor = e.getAttribute("data-valor");
  e.addEventListener("click", function () {
    const checked = e.checked;
    if (checked) {
      precos = valor;
    } else {
      precos = null;
    }
    bundle();
  });
});

const pegarCores = document.querySelectorAll(".colors input");
pegarCores.forEach(function (e) {
  const cor = e.getAttribute("data-cor");
  e.addEventListener("click", function () {
    const checked = e.checked;
    if (checked) {
      cores.push(cor);
    } else {
      const colorIndex = cores.indexOf(cor);
      cores.splice(colorIndex, 1);
    }
    console.log(cores);
    bundle();
  });
});

const tamanhoProduto = document.querySelectorAll(".size input");
tamanhoProduto.forEach(function (e) {
  const tamanho = e.getAttribute("data-tamanho");
  e.addEventListener("click", function () {
    const checked = e.checked;
    if (checked) {
      tamanhos.push(tamanho);
    } else {
      const sizeIndex = tamanhos.indexOf(tamanho);
      tamanhos.splice(sizeIndex, 1);
    }
    console.log(tamanhos);
    bundle();
  });
});

function criarCard(produto) {
  const div = document.createElement("div");
  const image = document.createElement("img");
  const name = document.createElement("h2");
  const price = document.createElement("h3");
  const parcelamento = document.createElement("h4");
  const link = document.createElement("a");

  image.src = produto.image;
  name.innerHTML = produto.name;
  price.innerHTML = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(produto.price);
  parcelamento.innerHTML = `Até ${produto.parcelamento.slice(0, 1)}x
    ${new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(produto.parcelamento.slice(1))}`;
  link.innerHTML = "COMPRAR";

  div.appendChild(image);
  div.appendChild(name);
  div.appendChild(price);
  div.appendChild(parcelamento);
  div.appendChild(link);
  return div;
}

function bundle() {
  let url = "http://localhost:5000/products";
  let firstTime = true;

  cores.forEach(function (cor) {
    if (firstTime) {
      url += "?color=" + cor;
      firstTime = false;
    } else {
      url += "&color=" + cor;
    }
  });
  if (tamanhos.length) {
    url += tamanhos.reduce(
      function (prev, curr, idx) {
        return prev + `${curr}${idx ? "|" : ""}`;
      },
      firstTime ? "?size_like=" : "&size_like="
    );
  }

  if (precos !== null) {
    if (firstTime) {
      url += "?" + faixaPrecos[precos];
      firstTime = false;
    } else {
      url += "&" + faixaPrecos[precos];
    }
  }

  if (firstTime) {
    if (ordens === "price") {
      let sort = ordens;
      url += "?_sort=" + sort + "&_order=desc";
      firstTime = false;
    } else if (ordens === "date") {
      let sort = ordens;
      url += "?_sort=" + sort + "&_order=desc";
      firstTime = false;
    } else if (ordens === "menor") {
      url += "?_sort=price&_order=asc";
      firstTime = false;
    }
  }
  const botaoCarregarMais = [...document.querySelectorAll(".carregarMais")];
  botaoCarregarMais.forEach(function (e) {
    e.addEventListener("click", function () {
      end = produtos.length;

      bundle();
    });
  });

  let data = getRoupas(url);
  let produtos = JSON.parse(data);
  let produto = document.querySelector("#produto");
  produto.innerHTML = "";
  for (let i = 0; i < end; i++) {
    let div = criarCard(produtos[i]);
    produto.appendChild(div);
  }
}
