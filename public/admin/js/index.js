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
const formCheckInputs = document.querySelectorAll('[name="status"]');
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

// change multi
const checkBoxAllBtn = document.querySelector("[checkbox-all]");
let ids = [];
let cntBoxes = 0;
if (checkBoxAllBtn) {
  checkBoxAllBtn.addEventListener("click", () => {
    const table = checkBoxAllBtn.closest("table");
    const tbody = table.querySelector("tbody");
    const checkBoxSingleBtns = tbody.querySelectorAll("[checkbox-single]");
    checkBoxAllBtn.checked = checkBoxAllBtn.checked ? true : false;
    if (checkBoxSingleBtns.length > 0) {
      checkBoxSingleBtns.forEach((btn) => {
        btn.checked = checkBoxAllBtn.checked;
        const id = btn.getAttribute("checkbox-single");
        if (checkBoxAllBtn.checked) {
          ids.push(id);
        } else {
          ids = [];
        }
        cntBoxes++;
      });
    }
  });
}

const checkBoxSingleBtns = document.querySelectorAll("[checkbox-single]");
if (checkBoxSingleBtns.length > 0) {
  checkBoxSingleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isChecked = btn.checked;
      const id = btn.getAttribute("checkbox-single");
      if (isChecked) {
        btn.checked = true;
        ids.push(id);
        cntBoxes++;
      } else {
        btn.checked = false;
        const findIndex = ids.findIndex((item) => item === id);
        ids.splice(findIndex, 1);
        cntBoxes--;
      }
      checkBoxAllBtn.checked =
        cntBoxes === checkBoxSingleBtns.length ? true : false;
    });
  });
}

const formChangeMulti = document.querySelector("[form-change-multi]");
const selectMulti = formChangeMulti.querySelector('[name="changeMulti"]');
let updateObj = {};
if (selectMulti) {
  selectMulti.addEventListener("change", (e) => {
    const { name, value } = e.target;
    updateObj[name] = value;
  });
}
if (formChangeMulti) {
  const input = formChangeMulti.querySelector('[name="updateInfo"]');
  formChangeMulti.addEventListener("submit", (e) => {
    if (ids.length === 0) {
      e.preventDefault();
      alert("Bạn phải chọn ít nhất một bản ghi để thay đổi");
    } else if (!updateObj["changeMulti"]) {
      e.preventDefault();
      alert("Bạn phải chọn một tiêu chí cập nhật");
    } else {
      updateObj["ids"] = ids.join("-");
      input.value = JSON.stringify(updateObj);
      formChangeMulti.submit();
    }
  });
}

// end change multi