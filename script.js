//get video from page with their id 
const video = document.getElementById('video')

Promise.all([

  //faceapi differetn detectors 
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  //detect diffrent points in the face 
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}




video.addEventListener('playing', () => {

  //canvas is used to display the result of face degtection on screen from our cideo element 
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  
  const displaySize = { width: video.width, height: video.height }
  //match dimension of canvas with displaySize
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    //we want to detect faces using TinyFaceDetectorOptions, what we want detect? FaceLandmark
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    //clear canvas before starting 
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

    //draw using face api in video
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})

