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

const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user:{
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }


class App extends React.Component {
  constructor(){
    super();
    this.state=initialState;
    }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined

    }})
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
    
    fetch('https://cryptic-bayou-73581.herokuapp.com/imageurl',{
          method:'post',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({input: this.state.input})
        })
    .then(response => response.json())
    .then(response => {
        if (response) {
          fetch('https://cryptic-bayou-73581.herokuapp.com/image',{
          method:'put',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user,{entries:count}))
          })
          .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
      })
    .catch(err => console.log(err));
  }

  onRouteChange = (to_page) => {
    if(to_page==='signin'){
      this.setState(initialState);
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
            <Rank name={this.state.user.name} 
                entries={this.state.user.entries} />
            <ImageLinkForm 
                onSubmit={this.onSubmit} 
                onInputChange={this.onInputChange} />
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>
          :(
            this.state.route==='signin'
            ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} /> 
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} /> 
            )
        }
      </div>
    );
  }
}

export default App;
