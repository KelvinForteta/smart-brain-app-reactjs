import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import 'tachyons';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/Auth/SignIn/SignIn';
import Register from './components/Auth/Register/Register';

const particlesOptions = {
    particles: {
        number: {
            value: 30,
            density: {
                enable: true,
                value_area: 800
            }
        }
    }
};

const app = new Clarifai.App({
    apiKey: '7c7587cf05404bbc9b7d347c33d63f7b'
});

class App extends Component {

    constructor(){
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'SignIn',
            isSignedIn: false
        }
    }

    onRouteChange = (route) => {
        if(route === 'SignIn'){
            this.setState({isSignedIn: false});
        }else if(route === 'home'){
            this.setState({isSignedIn: true});
        }
        this.setState({route: route});
    };

    calculateFaceDetection = (data) => {
        const clarifaiData = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);

        return {
            leftCol: clarifaiData.left_col * width,
            topRow: clarifaiData.top_row * height,
            rightCol: width - (clarifaiData.right_col * width),
            bottomRow: height - (clarifaiData.bottom_row * height),
        }
    };

    displayFaceBox = (box) => {
      this.setState({box: box});
    };

   onInputChange = (event) => {
        this.setState({input: event.target.value});
    };

    onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input});

        app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
            .then(response => this.displayFaceBox(this.calculateFaceDetection(response)))
            .catch(err => console.log(err));
    };

  render () {
      const { isSignedIn, imageUrl, box, route } = this.state;

      return (
      <div className="App">
          <Particles
              className='particles'
              params={particlesOptions}
          />
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
          { route === 'home'
              ? <div>
              <Logo/>
              <Rank/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
              :
              (
                  this.state.route === 'SignIn' ?
                  <SignIn onRouteChange={this.onRouteChange}/>
                  :
                  <Register onRouteChange={this.onRouteChange}/>
              )

          }
      </div>
      );
  };
}

export default App;
