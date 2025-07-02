function previewImage(input) {
  console.log("createEvent.js is loaded");
  const preview = document.getElementById("image-preview");
  const file = input.files[0];
  console.log("prview function triggered", file);

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = "#";
    preview.classList.add("hidden");
  }
}
