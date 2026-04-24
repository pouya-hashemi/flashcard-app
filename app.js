const cards = [
  { q: "Capital of France?", a: "Paris" },
  { q: "2+2?", a: "4" }
];

let index = 0;

function show() {
  document.getElementById("question").innerText = cards[index].q;
}

function next() {
  index = (index + 1) % cards.length;
  show();
}

show();