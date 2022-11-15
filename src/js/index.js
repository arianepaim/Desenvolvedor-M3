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

const filter = [...document.querySelectorAll(".title select")];
filter.forEach(function (e) {
  e.addEventListener("click", function () {
    ordens = e.value;
    bundle();
  });
});

const priceProduct = document.querySelectorAll(".price input");
priceProduct.forEach(function (e) {
  const priceValor = e.getAttribute("data-valor");
  e.addEventListener("click", function () {
    const checked = e.checked;
    if (checked) {
      precos = priceValor;
    } else {
      precos = null;
    }
    bundle();
  });
});

const colorsPickers = document.querySelectorAll(".colors input");
colorsPickers.forEach(function (e) {
  const colorName = e.getAttribute("data-cor");
  e.addEventListener("click", function () {
    const checked = e.checked;
    if (checked) {
      cores.push(colorName);
    } else {
      const colorIndex = cores.indexOf(colorName);
      cores.splice(colorIndex, 1);
    }
    console.log(cores);
    bundle();
  });
});

const sizeProduct = document.querySelectorAll(".size input");
sizeProduct.forEach(function (e) {
  const sizeLetra = e.getAttribute("data-tamanho");
  e.addEventListener("click", function () {
    const checked = e.checked;
    if (checked) {
      tamanhos.push(sizeLetra);
    } else {
      const sizeIndex = tamanhos.indexOf(sizeLetra);
      tamanhos.splice(sizeIndex, 1);
    }
    console.log(tamanhos);
    bundle();
  });
});

function criaCard(product) {
  const div = document.createElement("div");
  const image = document.createElement("img");
  const name = document.createElement("h2");
  const price = document.createElement("h3");
  const parcelamento = document.createElement("h4");
  const link = document.createElement("a");

  image.src = product.image;
  name.innerHTML = product.name;
  price.innerHTML = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);
  parcelamento.innerHTML = `Até ${product.parcelamento.slice(0, 1)}x
    ${new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(product.parcelamento.slice(1))}`;
  link.innerHTML = "COMPRAR";
  link.setAttribute("href", `/products?id=${product.id}`);

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
      end = products.length;
    
      bundle();
    });
  });

  let data = getRoupas(url);
  let products = JSON.parse(data);
  let produto = document.getElementById("produto");
  produto.innerHTML = "";
//   products.forEach((e) => {    
//     let div = criaCard(e);
//     produto.appendChild(div);
//   });
// }
for (var i = 0; i < end; i++) {
  let div = criaCard(products[i]);
  produto.appendChild(div);
}
}
