import * as tfvis from '@tensorflow/tfjs-vis'

window.onload = () => {
  const xs = [1, 2, 3, 4];
  const ys = [1, 3, 5, 7];

  tfvis.render.scatterplot(
    { name: '线性回归' },
    { values: xs.map((x, i) => { return { x, y: ys[i] } }) },
    {}
  )

}