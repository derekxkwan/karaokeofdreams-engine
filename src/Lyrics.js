import React from 'react';
import ReactDOM from 'react-dom';

export function Lyrics(props)
{
    return (
	<div className="lyrics" style={{backgroundColor: props.bkg}}>
	    {props.value}
	</div>
	    );
}
