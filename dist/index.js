import { Paint } from "./paint.js";
const paint = new Paint("canvas1", Math.min(800, window.innerWidth - 18), Math.min(800, window.innerWidth - 18, window.innerHeight - 200));
const initImg = new Image();
initImg.src = "../static/ragdoll.webp";
initImg.onload = (e) => {
    paint.paintImage(initImg);
};
document.getElementById("img").addEventListener("change", function (e) {
    if (this.files === null) {
        return;
    }
    var img = new Image();
    img.src = URL.createObjectURL(this.files[0]);
    img.onload = (e) => {
        paint.paintImage(img);
    };
});
//# sourceMappingURL=index.js.map