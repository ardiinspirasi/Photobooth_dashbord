const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const frame = document.getElementById("frame");

let stream;
let facing = "user";

async function startCamera() {
  if (stream) stream.getTracks().forEach(t => t.stop());

  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: facing }
  });

  video.srcObject = stream;
}

function capture() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");

  if (facing === "user") {
    ctx.translate(canvas.width,0);
    ctx.scale(-1,1);
  }

  ctx.drawImage(video,0,0);
  ctx.setTransform(1,0,0,1,0,0);
  ctx.drawImage(frame,0,0,canvas.width,canvas.height);

  const img = canvas.toDataURL("image/jpeg",0.9);
  localStorage.setItem("lastPhoto", img);

  const a = document.createElement("a");
  a.href = img;
  a.download = "reuni.jpg";
  a.click();
}

document.getElementById("btnCapture").addEventListener("click", capture);
document.getElementById("btnSwitch").addEventListener("click", () => {
  facing = facing === "user" ? "environment" : "user";
  startCamera();
});

startCamera();
