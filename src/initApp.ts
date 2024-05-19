export default function initApp() {
    // user can select any image to parse
    const input = document.querySelector<HTMLInputElement>('input[type="file"]')
    if (!input) throw new Error('Missing file input element')

    // for parsing the user's image
    const canvas = document.querySelector('canvas')
    if (!canvas) throw new Error('Missing canvas element')

    // for manipulating the context
    const context = canvas.getContext('2d')
    if (!context) throw new Error('No context')

    // used so the user can preview which file they selected
    const imageNode = document.querySelector<HTMLImageElement>('img')
    if (!imageNode) throw new Error('Missing img for previous')

    // css version of the image is here
    const preview = document.querySelector<HTMLDivElement>('#preview')
    if (!preview) throw new Error('Preview element missing')

    // image to load into the canvas
    const imageForCanvas = new Image()

    input.addEventListener('change', () => {
        // clear canvas from previous selections
        context.reset()
        const selectedImage = input.files?.[0]
        if (!selectedImage) throw new Error('Missing image or node')

        // load selected image in the preview and canvas
        const imageSrc = URL.createObjectURL(selectedImage)
        imageNode.src = imageSrc
        imageForCanvas.src = imageSrc
    })

    imageNode.addEventListener('load', () => {
        const imageWidth = imageForCanvas.width
        const imageHeight = imageForCanvas.height

        // set the canvas width and height to the selected image
        canvas.width = imageWidth
        canvas.height = imageHeight

        // load the image into the canvas
        context.drawImage(imageForCanvas, 0, 0)

        // set preview width dimensions
        preview.style.width = `${imageWidth}px`
        preview.style.height = `${imageHeight}px`

        // to replicate an image through CSS
        // 1. create as many divs as the image is high.
        // 2. each div will be 1px high
        // 3. apply a linear-gradient to each div, which equals 1 row of pixels of the original image

        // create a div for each height
        for (
            let currentHeight = 0;
            currentHeight < imageHeight;
            currentHeight++
        ) {
            const div = document.createElement('div')
            div.style.height = '1px'

            // get pixel color data for the current row (1 row = 1 pixel of the image)
            const imageData = context.getImageData(
                0,
                currentHeight,
                imageWidth,
                1
            )
            // `imageData.data` represents a one-dimensional Uint8ClampedArray containing the data
            // in RGBA order, with integer values between 0 and 255 (inclusive). The order goes by
            // rows from the top-left pixel to the bottom-right.
            //
            // this means that for an image with the size 1x1 pixels, `imageData.data` would return
            // an Uint8ClampedArray with 4 integer values:
            // [redValue, blueValue, greenValue, alphaChannelValue]
            //
            // in order to render 1 pixel, we need all 4 values. but because 4 values represent 1
            // pixel, we chunk the array in groups of 4. The result will be a number[][] array,
            // where each 1st level array contains all data for a single pixel
            const chunk = chunkRGBAArray(imageData.data)

            // we create as many linear gradients as the image is high. we stack colors from left to
            // right
            let linearGradientString = 'to right '

            for (
                let currentWidth = 0;
                currentWidth < imageWidth;
                currentWidth++
            ) {
                // this returns [redValue, blueValue, greenValue, alphaChannelValue] for the current pixel
                const pixelData = chunk[currentWidth]
                if (!pixelData) {
                    throw new Error(
                        `Pixel at position width: ${currentWidth}, height: ${currentHeight} doesn't exist`
                    )
                }

                const [r, g, b, a] = pixelData
                if (
                    !Number.isInteger(r) ||
                    !Number.isInteger(g) ||
                    !Number.isInteger(b) ||
                    !Number.isInteger(a)
                ) {
                    throw new Error(
                        `Pixel data missing:\n
                        r: ${r}\n
                        g: ${g}\n
                        b: ${b}\n
                        a: ${a}`
                    )
                }

                // map rgba values to the css `rgba` function
                const colorString = `rgba(${r}, ${g}, ${b}, ${a})`

                // this creates a linear gradient that has hard color-stops (so technically it isn't
                // a gradient). to achieve a hard color stop, you need a start and end position of
                // the color, which you can do by setting hard pixel values.
                //
                // we currently have data for 1 pixel, so the start and stop values are just 1px wide
                linearGradientString += `, ${colorString} ${currentWidth}px, ${colorString} ${
                    currentWidth + 1
                }px`
            }

            // add a background style to the current row
            div.style.background = `linear-gradient(${linearGradientString})`
            preview.append(div)
        }
    })
}

const chunkSize = 4
function chunkRGBAArray(RGBAArray: Uint8ClampedArray) {
    const chunkedArray: Uint8ClampedArray[] = []
    for (let i = 0; i < RGBAArray.length; i += chunkSize) {
        chunkedArray.push(RGBAArray.slice(i, i + chunkSize))
    }
    return chunkedArray
}
