import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
 apiKey: 'c4d640cfd8764436a95e8cdc88cea671'
});

const particlesOptions = {
                particles: {
                  number:{
                    value:50,
                  density:{
                    enable:true,
                    value_area: 800
                  }
                }
              }
            }

class App extends React.Component {
  constructor(){
    super();
    this.state={
      input: '',
      imageUrl: ''
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    console.log(this.state.input)
    console.log(this.state.imageUrl)
    
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(
    function(response) {
      console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    },
    function(err) {
      // there was an error
    }
    );
  }

  render(){
    return (
      <div className="App">
        <Particles className='particles'
                params={particlesOptions}
              />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
            onSubmit={this.onSubmit} 
            onInputChange={this.onInputChange}/>
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
