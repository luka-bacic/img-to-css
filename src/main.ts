import './style.css'
import initApp from './initApp.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="grid">
    <label id="cta">
      <h1>Pick any image</h1>
      <input type="file" accept="image/*"/>
    </label>
    <div id="original">
      <h2>Your original image</h2>
      <img src=""/>
    </div>
    <div id="preview-wrap">
      <h2>Replicated with CSS</h2>
      <div id="preview"></div>
    </div>

    <!-- not visible -->
    <canvas></canvas>
  </div>
`

initApp()
