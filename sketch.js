// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background('#e7c6ff');

  // 確保攝影機已啟動並取得寬高，否則不進行繪圖，避免 map 函數報錯
  if (video.width === 0 || video.height === 0) return;

  // 定義顯示尺寸：螢幕寬高的 50%
  let displayW = width * 0.5;
  let displayH = height * 0.5;
  
  // 計算置中座標
  let x = (width - displayW) / 2;
  let y = (height - displayH) / 2;

  // 繪製擷取影像，並強制縮放到指定的 50% 尺寸
  image(video, x, y, displayW, displayH);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      // Use confidence or score depending on ml5 version
      let detectionScore = hand.confidence || hand.score || 0;
      if (detectionScore > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 重點：將手部關節的原始座標，映射到畫布上縮放且置中後的座標
          let px = map(keypoint.x, 0, video.width, x, x + displayW);
          let py = map(keypoint.y, 0, video.height, y, y + displayH);

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(px, py, 12); // 稍微縮小圓點尺寸，視覺上更精確
        }
      }
    }
  }
}
