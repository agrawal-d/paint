import { Paint } from "./paint.js";
const paint = new Paint(
    "canvas1",
    window.innerWidth - 100,
    Math.min(window.innerWidth - 200, window.innerHeight - 200),
);

(document.getElementById("img") as HTMLInputElement).addEventListener("change", function (e) {
    if (this.files === null) {
        return;
    }
    var img = new Image();
    img.src = URL.createObjectURL(this.files[0]);
    img.onload = (e) => {
        paint.paintImage(img);
    };
});
