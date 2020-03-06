import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import {SongTitle} from './SongTitle';
import {Lyrics} from './Lyrics';
import axios from 'axios';


export class App extends React.Component
{
    constructor(props) {
	super(props);
	this.eventsource = null;
	this.state = {
	    isplaying: false,
	    lyrics: " "
	};
	}
    
    titles = ["gravitational wave me, maybe", "desert de beber", "Seaborn", "The desert lives in your hair", "Dust of stars, Surf the universe", "My body is a battleground"]

   
    componentDidMount()
    {
	if(!this.eventsource)
	{
	    console.log("establishing eventsource");
	    this.eventsource = new EventSource('/stream');
	    /*
	    this.eventsource.onmessage = (e) =>
	    {
		console.log(e.data);
	    };
	    */


	    this.eventsource.addEventListener('lyrics', (e) =>
	    {
		let cur_lyrics = e.data;
		this.setState({lyrics: cur_lyrics});
	    }, false);
	    this.eventsource.addEventListener('begin_song', (e) =>
	    {
		let isplaying = this.state.playing;
		let wantplaying = parseInt(e.data);
		if(wantplaying > 0 && !isplaying)		    
		    this.setState({playing: true});
		else if(wantplaying <= 0 && isplaying)
		{
		    this.setState({lyrics: " "});
		    this.setState({playing: false});
		}
	    }, false);


	};
    }

    componentWillUnmount() {
     if(this.eventsource)
     this.eventsource.close();
    }

    render_songtitle(cur, idx)
    {
	return (
	    <SongTitle 
		value={cur.toLowerCase()} key={idx} onClick={() => this.handleClick(idx)}/ >
	    );
    }

    render_lyrics(cur)
    {
	return  <Lyrics
	style={this.state.playing ? {visibility: 'visible'} : {visibility: 'hidden'}}
	value={cur} />

    }
	
    handleClick(idx)
    {
	//alert(cur);
	console.log(idx);
	axios.post('/song', {idx: idx})
	    .then(res => {

		});
	//alert(evt.text);
    }

    render(){
return (
    <div className="App">
	  <div id="titlebank"
	  style={this.state.playing ? {visibility: 'hidden'} : {visibility: 'visible'}}>
	  {this.titles.map((title, idx) => 
			   this.render_songtitle(title, idx))}
      </div>
	  {this.render_lyrics(this.state.lyrics)}
    </div>
  );
    
    }
    }
