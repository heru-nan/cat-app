import React from 'react'
import Modal from 'react-modal'

const customStyles = {
    content : {
      width: window.innerWidth - 100,
      height: window.innerHeight - 200,
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

Modal.setAppElement("#App")

export default function Overlay({modalIsOpen, closeModal, content}){
    var subtitle;
   
    function afterOpenModal() {
      // references are now sync'd and can be accessed.
      subtitle.style.color = "#2b2d2f";
      subtitle.style.marginBottom = "15%";
    }
   
      return (
        <div>
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <h1 ref={_subtitle => (subtitle = _subtitle)}>{content.title}</h1>
            {
              content.isLoading? <p>loading...</p>:
              <>
              <p>you catch: </p>
              {content.img && <img style={{
                width: window.innerWidth * 0.5,
                height: "120px",
                objectFit: "cover"}
              } src={content.img} />}
              <p>...</p>
              <p>...</p>
              <p>{content.content}</p>
              <div style={{height: "10%"}}></div>
              </>
            }
            <button onClick={closeModal}>Close</button>
          </Modal>
        </div>
      );
}