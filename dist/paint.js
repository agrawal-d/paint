var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BLUR_SIZE = 100;
const myWorker = new Worker("../dist/worker.js");
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * This class immplements the paint logic and rendering.
 */
export class Paint {
    constructor(canvas_id, w, h) {
        this.locked = false;
        this.imgId = -1;
        this.clicked = false;
        // Apply BLUR_SIZE x BLUR_SIZE gaussian blur centered on `x` and `y`
        this.gaussianBlur = (x, y) => {
            const input = this.ctx.getImageData(x - BLUR_SIZE / 2, y - BLUR_SIZE / 2, BLUR_SIZE, BLUR_SIZE).data;
            myWorker.postMessage({ x: x - BLUR_SIZE / 2, y: y - BLUR_SIZE / 2, input, imgId: this.imgId });
        };
        this.mouseListener = (e) => __awaiter(this, void 0, void 0, function* () {
            if (this.locked || !this.clicked) {
                return;
            }
            this.locked = true;
            this.gaussianBlur(e.offsetX, e.offsetY);
        });
        // Paint a cat on the whole canvas
        this.paintImage = (image) => {
            this.clear();
            this.imgId = Date.now();
            this.canvas.removeEventListener("mousemove", this.mouseListener);
            this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
            this.canvas.addEventListener("mousemove", this.mouseListener);
        };
        const canvas = document.getElementById(canvas_id);
        if (canvas === null) {
            throw new Error(`Canvas element with id ${canvas_id} not found.`);
        }
        this.canvas = canvas;
        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx = this.canvas.getContext("2d");
        document.addEventListener("mousedown", () => (this.clicked = true));
        document.addEventListener("mouseup", () => (this.clicked = false));
        myWorker.onmessage = (e) => {
            this.locked = false;
            const data = e.data;
            if (data.imgId != this.imgId) {
                console.log("Skipping stale image update");
                return;
            }
            this.ctx.putImageData(data.img, data.x, data.y);
        };
    }
    // Clear the canvas
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
//# sourceMappingURL=paint.js.map