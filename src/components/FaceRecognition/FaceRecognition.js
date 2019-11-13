import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({imageUrl, box}) => {
	return(
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='inputImage' src={imageUrl}  alt='' width='500px' height='auto'/>
				<div className='bounding_box' style={{top:box.topRow, right:box.rightCol, left:box.leftCol, bottom:box.bottomRow}}></div>
			</div>
		</div>
	)
}

export default FaceRecognition;

