import React, { Component } from 'react'

import Puzzle from '../Puzzle'

export default class Home extends Component {
	constructor(props) {
		super(props)
	}
	
	render() {
		return (
			<div className="home-wrapper">
				<Puzzle />
			</div>
		)
	}
}
