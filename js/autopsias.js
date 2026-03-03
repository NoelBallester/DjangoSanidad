const video = document.getElementById("video");
const containermini = document.getElementById("containermini");

const changeVideo = (event) => {
  if (event.target.nodeName === "IMG") {
    video.src = event.target.alt;
    video.previousElementSibling.textContent =
      event.target.nextElementSibling.textContent;
  }
};

containermini.addEventListener("click", changeVideo);
