import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';


const app = new Clarifai.App({
    apiKey: '74448d5657014f9ea8656877db501479'
});

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
            input: '',
            imageUrl: '',
            box:'',
            route:'signin',
            isSignedIn: false,
            user:{
               id: '',
               name: '',
               email: '',
               entries: 0,
               joined: ''
            }
        }
    }

    /*componentDidMount(){
        fetch('http://localhost:3000/').then(response=>response.json()).then(console.log);
    }*/

    calculateFaceLocation=(obj)=>{
        const clarifaiFace = obj.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);
        console.log(obj);
        return{

            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)//algorithm starts calculates points from the top. So to get the face's bottom point, subtract the product of percentage bottom [CLARIFAIFACE.BOTTOM_ROW] and overall height of the image from the overall height.
        }
    }


    displayFaceBox =(box)=>{
        console.log(box);
        this.setState({box:box});
    }
    onInputChange=(event)=>{
        this.setState({input: event.target.value})
    }

    onButtonSubmit=()=>{

        //set the state of the input box to contain the image URL
        this.setState({imageUrl:this.state.input});

        //make call to clarifai API by passing the model to use and the URL of the image, in the input box
        app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
            .then(response=>{
                if(response){
                    fetch('http://localhost:3000/image', {
                        method: 'put',
                        headers:{'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            id: this.state.user.id
                        })
                    })
                        .then(response => response.json())
                        .then(count=>
                            this.setState(Object.assign(this.state.user, {entries: count}))
                        )
                }
                this.displayFaceBox(this.calculateFaceLocation(response))//call calculateFaceLocation with received response to determine where the box will be placed, on the detected face. Then call displayFaceBox to add borders to the image
                    .catch(err=>console.log(err));
            })

    }

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState({isSignedIn: false})
        } else if (route === 'home') {
            this.setState({isSignedIn: true})
        }
        this.setState({route: route});
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

    render(){
      return (
        <div className="App">
          <Particles className= "particles" params={particlesOptions} />

          <Navigation onRouteChange ={this.onRouteChange} isSignedIn = {this.state.isSignedIn} />
            {
                this.state.route === 'home'
                    ? <div>
                        <Logo/>
                        <Rank name= {this.state.user.name} entries = {this.state.user.entries} />
                        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
                    </div>


                    : (
                        this.state.route === 'signin' ?
                            <SignIn loadUser ={this.loadUser} onRouteChange={this.onRouteChange}/>
                            :
                            <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    )
            }

        </div>
      );
    }
}


export default App;
