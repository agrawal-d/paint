type WorkerToBrowserEvent = {
    data: {
        x: number;
        y: number;
        img: ImageData;
        imgId: number;
    };
};
const BLUR_SIZE = 100;
const myWorker = new Worker("./dist/worker.js");

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * This class immplements the paint logic and rendering.
 */
export class Paint {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private locked = false;
    private imgId = -1;
    private clicked = false;

    constructor(canvas_id: string, w: number, h: number) {
        const canvas = document.getElementById(canvas_id);
        if (canvas === null) {
            throw new Error(`Canvas element with id ${canvas_id} not found.`);
        }

        this.canvas = canvas as HTMLCanvasElement;
        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        document.addEventListener("mousedown", () => (this.clicked = true));
        document.addEventListener("mouseup", () => (this.clicked = false));

        myWorker.onmessage = (e: WorkerToBrowserEvent) => {
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

    // Apply BLUR_SIZE x BLUR_SIZE gaussian blur centered on `x` and `y`
    gaussianBlur = (x: number, y: number) => {
        this.locked = true;
        const input = this.ctx.getImageData(x - BLUR_SIZE / 2, y - BLUR_SIZE / 2, BLUR_SIZE, BLUR_SIZE).data;
        myWorker.postMessage({ x: x - BLUR_SIZE / 2, y: y - BLUR_SIZE / 2, input, imgId: this.imgId });
    };

    mouseListener = async (e: MouseEvent | TouchEvent) => {
        if (this.locked) {
            return;
        }

        if ("touches" in e) {
            const touch = e.touches[0];
            const canvasPos = this.canvas.getBoundingClientRect();
            this.gaussianBlur(touch.clientX - canvasPos.left, touch.clientY - canvasPos.top);
            return;
        }

        if (!this.clicked) {
            return;
        }

        this.gaussianBlur(e.offsetX, e.offsetY);
    };

    // Paint a cat on the whole canvas
    paintImage = (image: HTMLImageElement) => {
        this.clear();
        this.imgId = Date.now();
        this.canvas.removeEventListener("mousemove", this.mouseListener);
        this.canvas.removeEventListener("touchmove", this.mouseListener);
        this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
        this.canvas.addEventListener("mousemove", this.mouseListener);
        this.canvas.addEventListener("touchmove", this.mouseListener);
    };
}
