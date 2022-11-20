import { Paint } from "./paint.js";
const paint = new Paint(
    "canvas1",
    Math.min(800, window.innerWidth - 18),
    Math.min(800, window.innerWidth - 18, window.innerHeight - 200),
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
