document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("userMenuBtn");
  const dropdown = document.getElementById("userDropdown");

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", function () {
    dropdown.classList.add("hidden");
  });
});