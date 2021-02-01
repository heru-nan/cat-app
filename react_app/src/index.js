import { render } from "react-dom";
import React, {useState, useEffect} from "react";
import {v4 as uuidv4} from 'uuid';
import "./styles.css"

import Bar from './components/TripleBar';
import Cam from './components/CamComponent'
import Overlay from './components/ResponseOverlay'

import catSVG from '../static/domestic-cat-shape.svg';
import arrowSVG from '../static/back-arrow.svg';
import cameraSVG from '../static/camera-shutter.svg';

const App = () => {

  const [cats, setCats] = useState({
    isLoading: false,
    isIn: false,
    images: []
  })
  const [src, setSrc] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [objContent, setContent] = useState({
    title: "Is A Cat ?",
    content: "you catched a beautiful kitty!",
    img: null,
    isLoading: true
  })

  useEffect(()=>{
    if (src){
      const formData = new FormData();

      // the hell
      fetch(src)
           .then((res) => res.blob())
           .then((blob) => {
              let filename = "cat-" + uuidv4() + ".jpg";
              formData.append("image", blob, filename)
              fetch("/predict", {
                method: "POST",
                body: formData
              } )
                .then(res => res.json())
                .then(data => {
                  let {is_cat, neg_prob, pos_prob} = data;
                  let content = is_cat?"wow cute cat you caught! we take care 🐈.":
                                  neg_prob>0.98 ? "RAUGHFFF!! 🐕 did anyone see a cat?" : "that's not a cat, but you can keep trying.";
                  setContent({
                    title: "is a CAT?",
                    content,
                    img: src,
                    isLoading: false,
                  });
                  

                  setSrc(null);
                  if(data.is_cat){
                    fetch("/save", {
                      method: "POST",
                      body: formData
                    }).then(res => console.log(res.json()))
                  }


                })
           })
      // end 
    }
  }, [src])
  
  const webcamRef = React.useRef(null);
 
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setSrc(imageSrc);
      setIsOpen(true);

    },
    [webcamRef]
  );

  const catPageButtons = {
    values: [
      {src: arrowSVG, fn: function(){
        setCats({...cats, isIn: false});
      }}
    ]
  }
  
  const indexButtons = {
    values: [
      {src: cameraSVG, fn: function(){
        if(!src){
          capture();
        }
      }},
      {src: catSVG, fn: function(){
        setCats({...cats, isIn: true, isLoading: true})
        fetch("/cats").then(res => res.json())
            .then(data => {setCats({images: data.base64_imgs, isLoading: false, isIn: true}); console.log(cats)});
      }}
    ],
  }

  if(cats.isIn){
    return(
      <div className="App">
        <h1>Your Cats</h1>
        { cats.isLoading ? <p>loading...</p> :
          <div style={{margin: "20px"}}>
          {cats.images.map((src, i) => <img key={i} width={window.innerWidth * 0.8}
            src={`data:image/jpeg;base64, ${src}`} />)}
          </div>
        }
        <Bar {...catPageButtons} />
      </div>
    )
  }

  return (
    <div className="App">
      <h1>Catch Cat App</h1>
      <Cam webcamRef={webcamRef} />
      <Bar {...indexButtons} />
      <Overlay modalIsOpen={modalIsOpen} closeModal={()=>{setIsOpen(false); setContent({...objContent, isLoading: true})}} content={objContent} />
    </div>
  );
};




render(<App />, document.getElementById("App"));

