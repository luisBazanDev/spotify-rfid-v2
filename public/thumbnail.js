const thumbnailContainer = document.getElementById("thumbnail");

// Use canva img2

setTimeout(() => {
  htmlToImage
    .toPng(thumbnailContainer, {
      width: 1280,
      height: 640,
      backgroundColor: "#000000",
    })
    .then(function (dataUrl) {
      var img = new Image();

      // record the image to 1186x593px after download
      img.src = dataUrl;
      img.width = 1186;
      img.height = 593;

      // download the image
      var a = document.createElement("a");
      a.href = img.src;
      a.download = "thumbnail.png";
      a.click();
    })
    .catch(function (error) {
      console.error("oops, something went wrong!", error);
    });
}, 100);
