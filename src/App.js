import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import {SongTitle} from './SongTitle';
import {Lyrics} from './Lyrics';
import axios from 'axios';
import './main.css';


export class App extends React.Component
{
    constructor(props) {
	super(props);
	this.eventsource = null;
	//this.render_lyrics = this.render_lyrics.bind(this);
	this.state = {
	    playing: false,
	    lyrics: " ",
	    bkg: "#FFFFFF"
	};
	}
    
    titles = ["gravitational wave me, maybe", "ski inn", "day star in your eyes", "desert de beber", "hack the fuck out of it", "cute lover fluffy fur heart pom pom soft candy matte phone case", "seagulls over chatsubo", "so many cats, so little time", "She bid a lot, the bot, stuck the boot out.", "Seaborn", "The desert lives in your hair", "Dust of stars, Surf the universe", "My body is a battleground"]

    rgb_string()
    {
	let int_array = Array.from({length: 3}, (x, i) => parseInt(Math.random() * 100 + 155).toString(16).toUpperCase());
	return ("#" + int_array.join(""));
    }

     startSong(wantplaying)
    {
	if(wantplaying)
	{
	    this.setState({playing: true});
            window.scrollTo(0,0);
	    console.log("begin_song");
	}
	else
	{
	    this.setState({lyrics: " "});
	    this.setState({playing: false});
	    console.log("stop_song");
	};
    }
    
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
		let cur_color = this.rgb_string();
		this.setState({lyrics: cur_lyrics});
		this.setState({bkg: cur_color});
	    }, false);
	    this.eventsource.addEventListener('beginsong', (e) =>
	    {
		let isplaying = this.state.playing;
		let wantplaying = parseInt(e.data);
		if(wantplaying > 0 && !isplaying)
		    this.startSong(true);
		else if(wantplaying <= 0)
		    this.startSong(false);
		else
		    console.log("err!");
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

    render_lyrics(cur, bkg)
    {
	return (<Lyrics
		bkg={bkg}
	value={cur} />
		);
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

    stopClick()
    {
	axios.post('/song', {idx: -1})
	.then(res => {});
	this.startSong(false);
    }


    render(){
	return (
		<div className="App">
		<div id="titlebank"
	    style={this.state.playing ? {visibility: 'hidden'} : {visibility: 'visible'}}>
		{this.titles.map((title, idx) => 
			   this.render_songtitle(title, idx))}
	    </div>
		<div id="lyricsbank"
	    style={this.state.playing ? {visibility: 'visible'} : {visibility: 'hidden'}}
		>
		{this.render_lyrics(this.state.lyrics, this.state.bkg)}
		<br />
		<div id="control">
		<button type="button" className="karaokeButton" onClick={() => this.stopClick()}>stop</button>
		</div>
		</div>
		</div>
	);
    
    }
    }
