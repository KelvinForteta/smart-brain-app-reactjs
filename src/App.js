import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import 'tachyons';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

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
            input: ''
        }
    }

   onInputChange = (event) => {
        console.log(event);
    };

    onButtonSubmit = () => {
        app.models.predict(Clarifai.GENERAL_MODEL, 'https://samples.clarifai.com/metro-north.jpg')
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });
    };

  render () {
      return (
      <div className="App">
          <Particles
              className='particles'
              params={particlesOptions}
          />
          <Navigation/>
          <Logo/>
          <Rank/>
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition />

      </div>
      );
  };
}

export default App;
