const aplayer = document.querySelector("#aplayer");
const avatar = document.querySelector(".inner-avatar > img");
if (aplayer) {
  let dataSong = JSON.parse(aplayer.getAttribute("data-song"));
  let dataSinger = JSON.parse(aplayer.getAttribute("data-singer"));
  const ap = new APlayer({
    container: aplayer,
    lrcType: 1,
    audio: [
      {
        name: dataSong.title,
        artist: dataSinger.fullName,
        url: dataSong.audio,
        cover: dataSong.avatar,
        lrc: dataSong.lyrics,
      },
    ],
    autoplay: true,
    volumn: 1,
  });
  ap.on("play", () => {
    avatar.style.animationPlayState = "running";
  });
  ap.on("pause", () => {
    avatar.style.animationPlayState = "paused";
  });
  ap.on("ended", () => {
    const id = dataSong._id;
    const api = `/songs/listen/${id}`;
    fetch(api, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          const innerListen = document.querySelector(".inner-listen");
          const span = innerListen.querySelector("span");
          span.innerText = data.data;
        }
      });
  });
}

// get cookie
function getCookie(cookie, name) {
  const arr = cookie.split("; ");
  const newArr = arr.map((item) => {
    return item.split("=");
  });
  for (const pair of newArr) {
    if (pair[0] === name) return pair[1];
  }
  return "";
}

// handle like
let buttonLike = document.querySelector("[button-like]");
if (buttonLike) {
  buttonLike.addEventListener("click", () => {
    const id = buttonLike.getAttribute("button-like");
    let typeLike = "yes";
    if (buttonLike.classList.contains("active")) {
      typeLike = "no";
    }
    const api = `/songs/like/${typeLike}/${id}`;
    const tokenUser = getCookie(document.cookie, "tokenUser");
    fetch(api, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenUser}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 400) {
          window.location.href = "/auth/login";
        } else if (data.status === 200) {
          const span = buttonLike.querySelector("span");
          span.innerText = data.data;
          buttonLike.classList.toggle("active");
        }
      });
  });
}

// handle favourite
let listButtonFavourite = document.querySelectorAll("[button-favourite]");
if (listButtonFavourite.length > 0) {
  listButtonFavourite.forEach((buttonFavourite) => {
    buttonFavourite.addEventListener("click", () => {
      const id = buttonFavourite.getAttribute("button-favourite");
      let typeFavourite = "yes";
      if (buttonFavourite.classList.contains("active")) {
        typeFavourite = "no";
      }
      const tokenUser = getCookie(document.cookie, "tokenUser");
      const api = `/songs/favourite/${typeFavourite}/${id}`;
      fetch(api, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${tokenUser}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 400) {
            window.location.href = "/auth/login";
          } else if (data.status === 200) {
            buttonFavourite.classList.toggle("active");
          }
        });
    });
  });
}
