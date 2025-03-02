import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

import * as cocoSsd from '@tensorflow-models/coco-ssd';

var myModel = null;
var V = null;

var requestAnimationFrameIndex = null;
var myPlayer = document.getElementById("myPlayer");

var videoHeight = 0;
var videoWidth = 0;
var clientHeight = 0;
var clientWidth = 0;

var modelLoad = false;
var videoLoad = false;

window.onload = function () {

  myPlayer.addEventListener("canplay", function () {
    videoHeight = myPlayer.videoHeight;
    videoWidth = myPlayer.videoWidth;
    clientHeight = myPlayer.clientHeight;
    clientWidth = myPlayer.clientWidth;
    V = this;
    videoLoad = true;
  })

  loadModel();
}

function loadModel() {
  if (modelLoad) {
    return;
  }

  cocoSsd.load().then(model => {
    var showBox = document.getElementById("showBox");
    showBox.innerHTML = "载入成功";
    myModel = model;
    detectImage();
    modelLoad = true;
  });
}

function detectImage() {
  var showBox = document.getElementById("showBox");
  // 分类名
  var classList = [];
  // 分类颜色框
  var classColorMap = ["red", "green", "blue", "white"];
  // 颜色角标
  var colorCursor = 0;

  showBox.innerHTML = "检测中...";

  if (videoLoad) {
    myModel.detect(V).then(predictions => {

      showBox.innerHTML = "检测结束";

      const $imgbox = document.getElementById('img-box');

      $imgbox.innerHTML = ""

      predictions.forEach(box => {

        if (classList.indexOf(box.class) != -1) {
          classList.push(box.class);
        }

        console.log(box);

        var borderColor = classColorMap[colorCursor % 4];
        // console.log(colorCursor);
        // console.log(borderColor);

        const $div = document.createElement('div')
        //$div.className = 'rect';
        $div.style.border = "2px solid " + borderColor;
        var heightScale = (clientHeight / videoHeight);
        var widthScale = (clientWidth / videoWidth)
        var transformTop = box.bbox[1] * heightScale;
        var transformLeft = box.bbox[0] * widthScale;
        var transformWidth = box.bbox[2] * widthScale;
        var transformHeight = box.bbox[3] * heightScale;
        var score = box.score.toFixed(3);
        $div.style.top = transformTop + 'px'
        $div.style.left = transformLeft + 'px'
        $div.style.width = transformWidth + 'px'
        $div.style.height = transformHeight + 'px'
        $div.innerHTML = `<span class='className'>${box.class} ${score}</span>`

        $imgbox.appendChild($div)

        colorCursor++;
      })

      setTimeout(function () {
        detectImage();
      }, 10);

    });

  }
}
