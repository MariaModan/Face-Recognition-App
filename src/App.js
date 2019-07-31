import React from 'react';
import Navigation from './components/Navigation';
import Logo from './components/Logo';
import ImgLinkForm from './components/ImgLinkForm';
import Rank from './components/Rank';
import FaceRecognition from './components/FaceRecognition';
import SignIn from './components/SignIn';
import Register from './components/Register';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '736b5349b73a4caa95fe0cd34af106f2'
 });

class App extends React.Component {
  constructor (){
    super();
    this.state = {
      input: '',
      imgUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser =(data) => {
    this.setState({
      user:{
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
      
    })
  }


  onInputChange = (ev) => {
    this.setState({
      input: ev.target.value
    })
  }

  onSubmit = () => {
    this.setState({
      imgUrl: this.state.input
    })

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then( response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          }).then (res => res.json())
            .then( count => {
              this.setState(Object.assign(this.state.user, {entries: count}))
            })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
        })
      .catch (err => console.log('oops', err)) 
    
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById('inputImg');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({
      box:box
    })
  }

  onRouteChange = (route) => {
    this.setState({
      route: route
    })
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' />
        <Navigation onRouteChange={this.onRouteChange}/>
        {
          this.state.route === 'home' ? 
            <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImgLinkForm 
                onInputChange={this.onInputChange} 
                onSubmit={this.onSubmit}
              />   
              <FaceRecognition box={this.state.box} imgUrl={this.state.imgUrl}/> 
            </div>
            :
            (this.state.route === 'signin' ? 
              <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>)
            

        }   
      </div>
    );
  } 
}

export default App;
