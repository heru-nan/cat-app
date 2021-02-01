import React from "react"
import Webcam from "react-webcam";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment"
  };

export default function Cam({webcamRef}){
  
  return (
    <Webcam
    className="Webcam"
    audio={false}
    width={window.innerWidth * 0.8}
    height={window.innerHeight * 0.8}
    ref={webcamRef}
    screenshotFormat="image/jpeg"
    videoConstraints={videoConstraints}
    />
  );
}