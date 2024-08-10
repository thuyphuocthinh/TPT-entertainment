const alertBtnClose = document.querySelector(".alert-btn-close");
if (alertBtnClose) {
  const div = alertBtnClose.closest(".alert");
  const time = div.getAttribute("data-time");
  const idTimeout = setTimeout(() => {
    div.style.animation = "fadeOut linear .5s forwards";
  }, time);
  alertBtnClose.addEventListener("click", () => {
    div.style.animation = "fadeOut linear .5s forwards";
    clearTimeout(idTimeout);
  });
}
