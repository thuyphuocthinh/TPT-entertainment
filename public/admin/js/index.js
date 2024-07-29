// search
const formSearch = document.querySelector("[form-search]");
if (formSearch) {
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = formSearch.querySelector('[name="search"]');
    const value = input.value;
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("search", value);
    } else {
      url.searchParams.delete("search");
    }
    window.location.href = url.href;
  });
}

// sort
const formSort = document.querySelector("[form-select-sort]");
if (formSort) {
  formSort.addEventListener("change", (e) => {
    const { value } = e.target;
    const keyValue = value.split("-");
    const [sortKey, sortValue] = keyValue;
    const url = new URL(window.location.href);
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    window.location.href = url.href;
  });
}

// filter
const formCheckInputs = document.querySelectorAll(".form-check-input");
if (formCheckInputs.length > 0) {
  formCheckInputs.forEach((item) => {
    item.addEventListener("change", (e) => {
      const { name, value } = e.target;
      const url = new URL(window.location.href);
      if (value) {
        url.searchParams.set(name, value);
      } else {
        url.searchParams.delete(name);
      }
      window.location.href = url.href;
    });
  });
}

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
