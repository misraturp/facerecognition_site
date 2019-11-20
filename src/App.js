import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/Signin/Signin'
import Register from './components/Register/Register'
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
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) =>{
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      
      return{
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});

  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange = (to_page) => {
    if(to_page==='signin'){
      this.setState({isSignedIn: false});
    } else if(to_page === 'home'){
      this.setState({isSignedIn: true});
    }
      this.setState({route: to_page});
  }

  render(){
    // const {isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <Particles className='particles'
                params={particlesOptions}
              />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {this.state.route==='home' 
          ?
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm 
                onSubmit={this.onSubmit} 
                onInputChange={this.onInputChange}/>
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>
          :(
            this.state.route==='signin'
            ? <SignIn onRouteChange={this.onRouteChange} /> 
            : <Register onRouteChange={this.onRouteChange} /> 
            )
        }
      </div>
    );
  }
}

export default App;
