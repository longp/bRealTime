require("dotenv").config();
const express = require("express");
const request = require('request');
const rp = require('request-promise');
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const path = require('path');

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => {
	let query = req.query
	let q = query.q
	let d = query.d
	let responseMessage = ''
	switch (true) {
		case q === 'Ping':
			responseMessage = 'OK'
			break;
		case q === 'Years':
			responseMessage = '2'
			break;
		case q === 'Position':
			responseMessage = 'Software Engineer'
			break;
		case q === 'Phone':
			responseMessage = '9083311664'
			break;
		case q === 'Source':
			responseMessage = 'https://github.com/longp/bRealTime'
			break;
		case q === 'Name':
			responseMessage = 'Long Phan'
			break;
		case q === 'Email Address':
			responseMessage = 'fileislong@gmail.com'
			break;
		case q === 'Referrer':
			responseMessage = 'Angelist'
			break;
		case q === 'Degree':
			responseMessage = 'Rutgers Physics'
			break;
		case q === 'Puzzle':
			let answer = solvePuzzle(query.d)
			responseMessage = answer
			break;
		case q === 'Resume':
			responseMessage = 'https://www.dropbox.com/s/lcmbwbk68bua7y6/long%20phan%20resume%20v2.pdf?dl=0'
			break;
		case q === 'Status':
			responseMessage = 'Yes'
			break;
		default:
			responseMessage = 'not sure waht to respond to with this query, ', query.d ? query.d : 'no query'
	}

	if(!query) {
		res.send('no query supplied')
	}
	res.send(responseMessage)
})

/**
 *
 *
 * @version 1.0
 * @desc solving puzzle i used three steps
 * 1 - i went and looked for the symbols in matrix that were given to me(were not '=' or '-') and filled the symmetrical location with their
 *  opposite counterpart eg("<" to ">") and labeling each row with either have a ">" with hasGT or '<' with hasLT property (Abusing arrays since they are also obj)
 * 2 - after filling as much as i can, i noticed that the rows that dont have both hasGT and hasLT all have same symbols so i filled them according to that
 * 3 - that leaves us with 2 rows withunfilled values, and just used the same process as #1 to fill in the blanks
 * @author Long Phan <fileislong@gmail.com>
 */
function solvePuzzle(input) {

	let split = input.split('\n');
	// we know that every answer has a diagonal of '=' so well make static matrix
	let matrix = [
		['=','-','-','-'],
		['-','=','-','-'],
		['-','-','=','-'],
		['-','-','-','='],
	]
	let letterArray = ['A', 'B', 'C', 'D']
	//just getting rid of extra blank item
	split.pop();

	//============fill in extra clues and use reverse rule===============
	let slice = split.slice(2, split.length)
	for (var i = 0; i < slice.length; i++) {

		let subArray = slice[i].slice(1,slice[i].length)

		for (var j = 0; j < subArray.length; j++) {
			let subArrayItem = subArray[j]
			if (subArrayItem == '>') {
				matrix[i][j] = '>'
				matrix[j][i] = '<'
				//attach hasGT or hasLT proiperty to respective row
				matrix[i].hasGT = true
				matrix[j].hasLT = true
			}
			if (subArrayItem == '<') {
				matrix[i][j] = '<'
				matrix[j][i] = '>'
				//attach hasGT or hasLT proiperty to respective row
				matrix[i].hasLT = true
				matrix[j].hasGT = true
			}
		}

	}

	// check for rows with only one has property, those are the ones with all values being same symbol and fill in
	for (var i = 0; i < matrix.length; i++) {
		let row = matrix[i]
		if (!row.hasLT) {
			for (var r = 0; r < row.length; r++) {
				let rowValue = row[r]
				if (rowValue == '-') {
					matrix[i][r] = '>'
					matrix[i].finished = true
				}
			}
		}
		if (!row.hasGT) {
			for (var r = 0; r < row.length; r++) {
				let rowValue = row[r]
				if (rowValue == '-') {
					matrix[i][r] = '<'
					matrix[i].finished = true
				}
			}
		}
	}

	// same process as #1 but going back to rows that werent finished yet
	for (var i = 0; i < matrix.length; i++) {
		let row = matrix[i]
		if (!row.finished) {
			for (var r = 0; r < row.length; r++) {
				let rowValue = row[r]
				if (rowValue == '-') {
					if (matrix[r][i] == '<') {
						matrix[i][r] = '>'
					}else {
						matrix[i][r] ='<'
					}
					matrix[i].finished = true
				}
			}
		}
	}
	//after everything is filled in lets get only symbols
	// lets get final array
	let final = []
	for (var i = 0; i < matrix.length; i++) {
		let symbols = matrix[i].slice(0,4);
		let letter = letterArray[i];
		final.push(letter + symbols.join(''))
	}

	//lets compile answer to be returned
	let answer = ' ABCD\n'
	for (var i = 0; i < final.length; i++) {
		answer += final[i] +'\n'
	}
	return answer

}

app.get("*", (req,res) => {
	res.send('<h1 style="color:#67c8db">' + process.env.NODE_ENV + ' bRealTime Test Api </h1>');
})

const server = app.listen(PORT, () => {
	console.log(process.env.NODE_ENV)
    console.log("listening on ", PORT);
});
