import React, { Component } from 'react'

import { bookFile, initPlayData, msFormat, rand, randSize } from '../../util/util'

const minVol = 1
const maxVol = 2
const minBook = 1
const maxBook = 100
const minPuzzleNo = 0
const maxPuzzleNo = size => size == '14x14' ? 11 : 23

String.prototype.replaceAt=function(index, replacement) { //https://stackoverflow.com/a/1431113
	return this.substr(0, index) + replacement+ this.substr(index + replacement.length)
}

export default class Puzzle extends Component {
	constructor(props) {
		super(props)
		this.state = this.initialState('random')

		this.timerInterval = null
	}

	componentWillMount() {
		this.initGame()
	}

	initGame(size='random') {
		if(this.state.timerOn) this.stopTimer()
		this.setState(this.initialState(size))
	}
	
	initialState(uSize, v, b, p) {
		var size = uSize == 'random' ? randSize() : uSize
		var vol = v || rand(minVol, maxVol)
		var book = b || rand(minBook, maxBook)
		var puzzleNo = p || rand(minPuzzleNo, maxPuzzleNo(size))
		var puzzleBookFile = bookFile(size, vol, book)
		var bookData = require(`../../data/${puzzleBookFile}`)
		var playData = initPlayData(bookData[puzzleNo])
		var pRec = bookData[puzzleNo]
		return { size, vol, book, puzzleNo, puzzleBookFile, pRec, playData, timerMS: 0, timerOn: false }
	}

	render() {
		let { puzz } = this.state.pRec.puzzle_data
		let { playData, size, vol, book, puzzleNo, timerMS } = this.state
		var sizeN = Math.sqrt(puzz.length)
		return (
			<React.Fragment>
				<div className="puzzle-board" style={{ 'gridTemplateColumns': `repeat(${sizeN}, 1fr)`  }}>
					{this.renderPuzzlePieces(puzz, playData)}
				</div>
				<div className="game-info">
					<div className="timer">{msFormat(timerMS)}</div>
					<div className="which-puzzle">{size}, Volume {vol}, Book {book}, Puzzle {parseInt(puzzleNo)+1}</div>
					<div className="new-puzzle" onClick={() => { this.initGame().bind(this) }}>Random Puzzle</div>
					<br></br>
					<div className="select-puzzle" onClick={() => { this.selectPuzzle().bind(this) }}>Select Puzzle</div>
					<br></br>
					<div className="reset-puzzle" onClick={this.resetGame.bind(this)}>Reset</div>
					<br></br>
					<div className="solve-puzzle" onClick={this.solveGame.bind(this)}>Solve</div>
					<br></br>
					<div className="puzzle8x8 size-puzzle" onClick={() => { this.initGame('8x8').bind(this) }}>8x8</div>
					<div className="puzzle10x10 size-puzzle" onClick={() => { this.initGame('10x10').bind(this) }}>10x10</div>
					<div className="puzzle14x14 size-puzzle" onClick={() => { this.initGame('14x14').bind(this) }}>14x14</div>
				</div>
			</React.Fragment>
		)
	}

	startTimer() {
		this.timerInterval = setInterval(() => {
			this.setState({ timerMS: this.state.timerMS + 1000 })
		}, 1000)
	}

	stopTimer() {
		clearInterval(this.timerInterval)
	}

	resetGame() {
		var playData = initPlayData(this.state.pRec)
		this.stopTimer()
		this.setState({ playData, timerMS: 0, timerOn: false })
	}

	solveGame() {
		this.stopTimer()
		let { solved } = this.state.pRec.puzzle_data
		this.setState({ playData: solved.replace(/1/g, '3'), timerMS: 0, timerOn: false })
	}

	selectPuzzle() {
		var puzzleSyntax = prompt('Enter a puzzle in the form SIZE;VOL;BOOK;PUZZLENO-1', '8x8;1;1;0')
		let [size, vol, book, puzzleNo] = puzzleSyntax.split(';')
		console.log(puzzleNo)
		this.setState(this.initialState(size, vol, book, puzzleNo))
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
			var classname = 'puzzle-piece'+ (hasLeft ? ' bLeft' : '') + (hasUp ? ' bUp' : '') + codeToSymbol(playData[i])
			return <div key={i} className={classname} onClick={() => { this.clickPiece(i) }}></div>
		})

		function codeToSymbol(code) {
			var symbol = ''
			switch(code) {
			case '1': symbol = ' dot'; break
			case '2': symbol = ' star'; break
			case '3': symbol = ' star win'
			}
			return symbol
		}
	}

	clickPiece(i) {
		if(!this.state.timerOn) {
			this.startTimer()
			this.setState({ timerOn: true })
		}
		var playDataT = this.state.playData
		playDataT = playDataT.replaceAt(i, ((playDataT[i] + 1) % 3).toString()) 
		this.setState({ playData: playDataT })
		this.checkWin(playDataT)
	}

	checkWin(playData) {
		let { solved } = this.state.pRec.puzzle_data
		var playDataT = playData.replace(/1/g, '0').replace(/2/g, '1')
		if(solved == playDataT) { //win
			this.stopTimer()
			playDataT = playData.replace(/2/g, '3')
			this.setState({ playData: playDataT, timerOn: false })
		}
	}
}
