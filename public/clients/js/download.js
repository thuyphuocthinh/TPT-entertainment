const btnDownload = document.querySelector("[button-download]");
let url, title;
if (btnDownload) {
  url = btnDownload.getAttribute("button-download");
  title = btnDownload.getAttribute("button-title");
}

/*
  1. Create an object URL for the blob object
  2. Create an anchor element (<a></a>)
  3. Set the href attribute of the anchor element to 
  the created object URL
  4. Set the download attribute to the filename 
  of the file to be downloaded. 
  This forces the anchor element to trigger a file 
  download when it is clicked
  5. If the link is for a one-off download, 
  release the object URL after the anchor element has been clicked
*/

function downloadBlob(blob, filename) {
  // Create an object URL for the blob object
  const url = URL.createObjectURL(blob);
  console.log(url);

  // Create a new anchor element
  const a = document.createElement("a");

  // Set the href and download attributes for the anchor element
  // You can optionally set other attributes like `title`, etc
  // Especially, if the anchor element will be attached to the DOM
  a.href = url;
  a.download = filename || "download";
  a.title = "Tải xuống";

  // Click handler that releases the object URL after the element has been clicked
  // This is required for one-off downloads of the blob content
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      removeEventListener("click", clickHandler);
    }, 150);
  };

  a.addEventListener("click", clickHandler, false);
  return a;
}

function readBlobFromUrl(url, title) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      // Create a new FileReader innstance
      const reader = new FileReader();
      // Start reading the content of the blob
      // The result should be a base64 data URL
      reader.readAsDataURL(blob);
      // get result
      reader.onloadend = function () {
        var base64string = reader.result;
        console.log(base64string);
      };
      const downloadLink = downloadBlob(blob, title);
      downloadLink.innerHTML = "<i class='fa-solid fa-download'></i>";
      btnDownload.removeChild(
        btnDownload.querySelector(".fa-solid.fa-download")
      );
      btnDownload.appendChild(downloadLink);
    });
}

readBlobFromUrl(url, title);
