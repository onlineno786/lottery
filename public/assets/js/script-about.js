const buttons = document.querySelectorAll(".card1-buttons button");
const sections = document.querySelectorAll(".card1-section");
const card1 = document.querySelector(".card1");

const handleButtonClick = e => {
  const targetSection = e.target.getAttribute("data-section");
  const section = document.querySelector(targetSection);
  targetSection !== "#about" ?
  card1.classList.add("is-active") :
  card1.classList.remove("is-active");
  card1.setAttribute("data-state", targetSection);
  sections.forEach(s => s.classList.remove("is-active"));
  buttons.forEach(b => b.classList.remove("is-active"));
  e.target.classList.add("is-active");
  section.classList.add("is-active");
};

buttons.forEach(btn => {
  btn.addEventListener("click", handleButtonClick);
});



