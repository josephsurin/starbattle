import React, { Component } from 'react'

import { bookFile } from '../../util/util'

export default class Puzzle extends Component {
	constructor(props) {
		super(props)
		this.state = {
			vol: 1,
			book: 1,
			puzzleNo: 0,
			puzzleBookFile: bookFile(1,1),
			pRec: {}
		}
	}

	componentWillMount() {
		var bookData = require(`../../data/${this.state.puzzleBookFile}`)
		this.setState({ pRec: bookData[this.state.puzzleNo] })
	}
	

	render() {
		let { puzz } = this.state.pRec.puzzle_data
		var size = Math.sqrt(puzz.length)
		return (
			<div className="puzzle-wrapper">
				<div className="puzzle-board" style={{ 'gridTemplateColumns': `repeat(${size}, 1fr)`  }}>
					{this.renderPuzzlePieces(puzz)}
				</div>
			</div>
		)
	}

	renderPuzzlePieces(puzz) {
		var numPieces = puzz.length
		var size = Math.sqrt(numPieces)
		return puzz.split('').map((el, i) => {
			var row = Math.floor(i / size)
			var col = i % size
			var hasLeft, hasUp = false
			if(col > 0) {
				hasLeft = puzz[i-1] != puzz[i]
			}
			if(row > 0) {
				hasUp = puzz[i-size] != puzz[i]
			}
			var classname = 'puzzle-piece'+ (hasLeft ? ' bLeft' : '') + (hasUp ? ' bUp' : '')
			return (
				<div key={i} className={classname}>
					<div className="top-space"></div>
					<div className="puzzle-piece-symbol">{el}</div>
				</div>)
		})
	}
}
