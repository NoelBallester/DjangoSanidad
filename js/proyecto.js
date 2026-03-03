const video = document.getElementById('video');
const containerpubli = document.getElementById('containerpubli');


const changeVideo= (event) => {
  if(event.target.nodeName === 'IMG' ){
     video.src = event.target.alt}
}

containerpubli.addEventListener('click', changeVideo);