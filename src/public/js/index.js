document.addEventListener('DOMContentLoaded', function(event) {
  //document.querySelector("form").classList.add('js');

  const fileInput = document.querySelector('.input-file'),
    button = document.querySelector('.input-file-trigger'),
    the_return = document.querySelector('.file-return');

  // Show image
  fileInput.addEventListener('change', handleImage, false);
  var canvas = document.getElementById('imageCanvas');
  var ctx = canvas.getContext('2d');

  button.addEventListener('keydown', function(event) {
    if (event.keyCode == 13 || event.keyCode == 32) {
      fileInput.focus();
    }
  });
  button.addEventListener('click', function(event) {
    fileInput.focus();
    //return false;
  });
  fileInput.addEventListener('change', function(event) {
    the_return.innerHTML = this.value.replace(/C:\\fakepath\\/i, '');
    canvas.style.display = 'block';
    //button.innerHTML =  this.value.replace(/C:\\fakepath\\/i, '');
  });

  function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function(event) {
      var img = new Image();
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = event.target.result;
      canvas.height = img.height;
    };
    reader.readAsDataURL(e.target.files[0]);
  }
  //do work

  let spans = document.querySelectorAll('.word span');
  spans.forEach((span, idx) => {
    span.addEventListener('click', e => {
      e.target.classList.add('active');
    });
    span.addEventListener('animationend', e => {
      e.target.classList.remove('active');
    });

    // Initial animation
    setTimeout(() => {
      span.classList.add('active');
    }, 750 * (idx + 1));
  });
});
