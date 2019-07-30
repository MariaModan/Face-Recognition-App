import React from 'react';
import './faceRecognition.css';


const FaceRecognition = ({ box, imgUrl }) => {
    return (
        <div className='center ma mt2'>
            <img id='inputImg' src={imgUrl} alt='' width='500px' height='auto'/>
            <div className='bounding-box' style={{top: box.topRow, right:box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
        </div>
    );
}

export default FaceRecognition;