import React, { Component } from 'react'

import { bookFile } from '../../util/util'

String.prototype.replaceAt=function(index, replacement) { //https://stackoverflow.com/a/1431113
	return this.substr(0, index) + replacement+ this.substr(index + replacement.length)
}

export default class Puzzle extends Component {
	constructor(props) {
		super(props)
		this.state = {
			vol: 1,
			book: 1,
			puzzleNo: 0,
			puzzleBookFile: bookFile(1,1),
			pRec: {},
			playData: ''
		}
	}

	componentWillMount() {
		var bookData = require(`../../data/${this.state.puzzleBookFile}`)
		var playData = new Array(bookData[this.state.puzzleNo].puzzle_data.puzz.length + 1).join('0')
		this.setState({ pRec: bookData[this.state.puzzleNo], playData })
	}
	

	render() {
		let { puzz } = this.state.pRec.puzzle_data
		let { playData } = this.state
		var size = Math.sqrt(puzz.length)
		return (
			<div className="puzzle-board" style={{ 'gridTemplateColumns': `repeat(${size}, 1fr)`  }}>
				{this.renderPuzzlePieces(puzz, playData)}
			</div>
		)
	}

	renderPuzzlePieces(puzz, playData) {
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
				<div key={i} className={classname} onClick={() => { this.clickPiece(i) }}>
					<div className="top-space"></div>
					<div className="puzzle-piece-symbol">{codeToSymbol(playData[i])}</div>
				</div>)
		})

		function codeToSymbol(code) {
			var symbol = ''
			switch(code) {
			case '1': symbol = <i className="material-icons dot">brightness_1</i>; break
			case '2': symbol = <i className="material-icons star">star</i>; break
			case 'W': symbol = <i className="material-icons star win">star</i>
			}
			return symbol
		}
	}

	clickPiece(i) {
		var playDataT = this.state.playData
		playDataT = playDataT.replaceAt(i, ((playDataT[i] + 1) % 3).toString()) 
		this.setState({ playData: playDataT })
		this.checkWin(playDataT)
	}

	checkWin(playData) {
		let { solved } = this.state.pRec.puzzle_data
		var playDataT = playData.replace(/1/g, '0').replace(/2/g, '1')
		if(solved == playDataT) { //win
			playDataT = playData.replace(/2/g, 'W')
			console.log(playDataT)
			this.setState({ playData: playDataT })
		}
	}
}
