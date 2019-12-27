declare const Chess:any;

class ChessAI {
	private engine;
	private PAWN = 'p';
 	private KNIGHT = 'n';
  	private BISHOP = 'b';
  	private ROOK = 'r';
  	private QUEEN = 'q';
  	private KING = 'k';
  	// Hardcoded for now as the user is always white
  	private COLOR  = 1;

  	private VALUES;

	constructor(game) {
		this.engine = game;
	}

	getRandomMove() {
		let possibleMoves:[] = this.engine.moves()
		// game over
		if (possibleMoves.length === 0) {
			alert("Game over!");
			return;
		}
		let randomIdx = Math.floor(Math.random() * possibleMoves.length)
		let move = possibleMoves[randomIdx];
		return move;
	}

	getGreedyMove() {
		let possibleMoves:[] = this.engine.moves()
		var targetValue:number = Infinity * this.COLOR;
		var moveIndex:number = 0;
		for(var i:number = 0; i < possibleMoves.length; i++) {
			var temp = new Chess(this.engine.fen());
			temp.move(possibleMoves[i]);
			let moveValuation = this.computeScore(temp.fen());
			if(this.COLOR == 1) {
				if(moveValuation < targetValue) {
					targetValue = moveValuation;
					moveIndex = i;
				}
			} else {
				if(moveValuation > targetValue) {
					targetValue = moveValuation;
					moveIndex = i;
				}
			}
		}
		return possibleMoves[moveIndex];
	}

	getMiniMaxMove() {
		let possibleMoves:[] = this.engine.moves()

		// game over
		if (possibleMoves.length === 0) {
			alert("Game over!");
			return;
		}

		this.generateMiniMax();

		let randomIdx = Math.floor(Math.random() * possibleMoves.length)
		let move = possibleMoves[randomIdx];
		return move;
	}

	private generateMiniMax() {
		let moves: [] = this.engine.moves();
		let fen:string = this.engine.fen();
		
		let score:number = this.computeScore(fen);

		console.log(JSON.stringify(moves));
		console.log(score);
	}

	private computeScore(fen) {
		var score:number = 0;
		let ranks:string[] = fen.split("/");
		console.log("Split ranks");
		for(var i:number = 0; i < ranks.length; i++) {
			let rank:string = ranks[i];
			let rank_arr:string[] = rank.split("");
			for(var j:number = 0; j < rank_arr.length; j++) {
				let notation = rank_arr[j];
				var multiplier:number = 1;
				if(isNaN(Number(notation))) {
					if(notation.charAt(0) == notation.toLowerCase().charAt(0)) {
						multiplier = -1;
					}
					var value = multiplier * this.lookupMove(notation);
					score += value;
					console.log("Score is updated to: "+score);
				}
			}
		}
		return score;
	}

	private lookupMove(notation:string) {
		let x = notation.toLowerCase();
		var retVal:number = 0;
		switch (x) {
			case this.PAWN:
				retVal = 1;
				break;
			case this.KNIGHT:
				retVal = 3;
				break;
			case this.BISHOP:
				retVal = 3;
				break;
			case this.ROOK:
				retVal = 5;
				break;
			case this.QUEEN:
				retVal = 9;
				break;
			case this.KING:
				retVal = 90;
				break;
			default:
				retVal = 0;
				break;
		}
		return retVal;
	}
}