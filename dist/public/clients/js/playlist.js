const aplayerList = document.querySelector("#aplayer-list");

if (aplayerList) {
  let dataSongs = JSON.parse(aplayerList.getAttribute("data-songs"));
  let dataSingers = JSON.parse(aplayerList.getAttribute("data-singers"));
  const ap = new APlayer({
    container: aplayerList,
    lrcType: 1,
    audio: dataSongs.map((dataSong, index) => {
      return {
        name: dataSong.title,
        artist: dataSingers[index],
        url: dataSong.audio,
        cover: dataSong.avatar,
        lrc: dataSong.lyrics,
      };
    }),
    autoplay: true,
    volumn: 1,
  });
  // ended
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
