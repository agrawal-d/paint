"use strict";
// 5x5 gaussian kernel taken from https://www.codingame.com/playgrounds/2524/basic-image-manipulation/filtering
let gaussian_kernel = Object.freeze([
    [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
    [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
    [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
    [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
    [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
]);
// gaussian_kernel = [...Array(10)].map((_) => `Array(10).fill(1 / 100));
const KERNEL_SIZE = gaussian_kernel.length;
const BLUR_SIZE = 100;
function gaussianBlur(x, y, input, imgId) {
    const output = Uint8ClampedArray.from(input);
    // Layer is R, G, B, or A [0 to 3]
    function getIndex(x, y, layer) {
        return 4 * (y * BLUR_SIZE + x) + layer;
    }
    const getColor = (x, y, layer) => {
        return input[getIndex(Math.min(BLUR_SIZE - 1, Math.max(0, x)), Math.min(BLUR_SIZE - 1, Math.max(0, y)), layer)];
    };
    for (let layer = 0; layer < 3; layer++) {
        for (let img_r = 0; img_r < BLUR_SIZE; img_r++) {
            for (let img_c = 0; img_c < BLUR_SIZE; img_c++) {
                output[getIndex(img_r, img_c, layer)] = 0;
                for (let krnl_r = 0; krnl_r < KERNEL_SIZE; krnl_r++) {
                    for (let krnl_c = 0; krnl_c < KERNEL_SIZE; krnl_c++) {
                        output[getIndex(img_r, img_c, layer)] +=
                            gaussian_kernel[krnl_r][krnl_c] *
                                getColor(img_r - (KERNEL_SIZE - 1) / 2 + krnl_r, img_c - (KERNEL_SIZE - 1) / 2 + krnl_c, layer);
                    }
                }
            }
        }
    }
    return { x, y, img: new ImageData(output, BLUR_SIZE, BLUR_SIZE), imgId };
}
onmessage = (e) => {
    postMessage(gaussianBlur(e.data.x, e.data.y, e.data.input, e.data.imgId));
};
//# sourceMappingURL=worker.js.map