export const bookFile = (vol, book) => `stbV${vol}-B${book}.json`

export function initPlayData(pRec) {
	return new Array(pRec.puzzle_data.puzz.length + 1).join('0')
}

export function msFormat(ms) {
	var hrs = Math.floor(ms / (1000*60*60))
	var mins = Math.floor(Math.floor(ms % (1000*60*60)) / (1000*60))
	var secs = Math.floor(Math.floor(ms % (1000*60)) / 1000)
	if(hrs > 0) {
		return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2,'0')}`
	}
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2,'0')}`
}