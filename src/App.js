import React, {Component} from 'react';
import Particles from 'react-particles-js'
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const particlesOptions= {
    particles:{
        number: {
            value:100,
            density:{
                enable:true,
                value_area:800
            }
        }
    },
    interactivity:{
        detect_on: 'window',
        events:{
            onhover:{
                enable: true,
                mode: 'repulse'
            }
        }

    }
}
class App extends Component {
    constructor(){
        super();
        this.state = {
            input: ''
        }
    }
    render(){
      return (
        <div className="App">
          <Particles className= "particles" params={particlesOptions} />
          <Navigation />
          <Logo />
          <Rank />
          <ImageLinkForm />

          {/*<FaceRecognition />*/}
        </div>
      );
    }
}

export default App;
