// upload-Audio
const uploadAudio = document.querySelector("[audio-upload-input]");
if (uploadAudio) {
  uploadAudio.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const previewAudio = document.querySelector(".preview-audio");
    if (previewAudio.querySelector(".img-thumbnail")) {
      previewAudio.removeChild(
        previewAudio.querySelector(".audio-preview-item")
      );
    }
    if (previewAudio) {
      const url = URL.createObjectURL(file);
      const html = `
        <audio class="audio-preview-item" controls>
            <source src=${url} type="audio/mp3">
        </audio>
      `;
      previewAudio.innerHTML = html;
    }
  });
}
