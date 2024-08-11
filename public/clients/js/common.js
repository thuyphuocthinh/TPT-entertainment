// carousel
if (document.querySelector(".splide")) {
  var splide = new Splide(".splide", {
    type: "loop",
    autoScroll: {
      speed: 1,
    },
  });
  splide.mount();
}

$("#topic-carousel").owlCarousel({
  loop: true,
  margin: 10,
  responsiveClass: true,
  autoplay: true,
  loop: true,
  responsive: {
    0: {
      items: 1,
      nav: true,
      dots: false,
    },
    600: {
      items: 3,
      nav: true,
      dots: false,
    },
    1000: {
      items: 5,
      nav: true,
      loop: true,
      dots: false,
    },
  },
});

$("#songs-carousel").owlCarousel({
  loop: true,
  margin: 10,
  responsiveClass: true,
  autoplay: true,
  loop: true,
  responsive: {
    0: {
      items: 1,
      nav: true,
      dots: false,
    },
    600: {
      items: 3,
      nav: true,
      dots: false,
    },
    1000: {
      items: 5,
      nav: true,
      loop: false,
      dots: false,
    },
  },
});

$("#singers-carousel").owlCarousel({
  loop: true,
  margin: 10,
  responsiveClass: true,
  autoplay: true,
  loop: true,
  responsive: {
    0: {
      items: 1,
      nav: true,
      dots: false,
    },
    600: {
      items: 3,
      nav: true,
      dots: false,
    },
    1000: {
      items: 5,
      nav: true,
      loop: false,
      dots: false,
    },
  },
});
// end carousel

// search
const formSearch = document.querySelector("#navbar-search");
if (formSearch) {
  const input = formSearch.querySelector('[name="keyword"]');
  if (input) {
    input.addEventListener("keyup", () => {
      const value = input.value;
      const searchContainer = document.querySelector(".search");
      const searchSuggest = searchContainer.querySelector(".search-suggest");
      if (value) {
        fetch(`/search/suggest?keyword=${value}`, {
          method: "GET",
        })
          .then((resp) => resp.json())
          .then((result) => {
            if (result.status === 200 && result.songs.length > 0) {
              let html = "";
              result.songs.forEach((item) => {
                html += `
                  <a href="/songs/${item.slug}">
                    <div class="search-item">
                      <div class="search-img">
                        <img src="${item.avatar}" alt=${item.title} class="d-block"/>
                      </div>
                      <div class="search-info">
                        <p class="m-0 p-0 fw-bold"> ${item.title} </p>
                        <p class="m-0 p-0">
                          <i class="me-1 fa-solid fa-microphone-lines"> </i> 
                          <span>
                            ${item.infoSinger.fullName} 
                          </span>
                        </p>
                      </div>
                    </div>
                  </a>
                `;
              });
              searchSuggest.classList.add("show");
              searchSuggest.innerHTML = html;
            }
          })
          .catch((err) => console.log(err));
      } else {
        if (searchSuggest.classList.contains("show")) {
          searchSuggest.classList.remove("show");
        }
      }
    });
  }
}

document.addEventListener("click", (e) => {
  const searchSuggest = document.querySelector(".search-suggest");
  const input = formSearch.querySelector('[name="keyword"]');
  if (
    !searchSuggest.contains(e.target) &&
    searchSuggest.classList.contains("show")
  ) {
    searchSuggest.classList.remove("show");
    input.value = "";
  }
});

// end search

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
