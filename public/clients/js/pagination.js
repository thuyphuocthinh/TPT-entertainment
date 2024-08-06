// pagination
const btnPagination = document.querySelectorAll("[button-pagination]");
if (btnPagination.length > 0) {
  btnPagination.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.getAttribute("button-pagination");
      const url = new URL(window.location.href);
      if (page > 1) {
        url.searchParams.set("page", page);
      } else {
        url.searchParams.delete("page");
      }
      window.location.href = url.href;
    });
  });
}