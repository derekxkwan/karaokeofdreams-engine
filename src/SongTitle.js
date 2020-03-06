import React from 'react';
import ReactDOM from 'react-dom';

export function SongTitle(props)
{
    return (
	<div className="title" onClick={props.onClick}>
	    {props.value}
	</div>
	    );
}
