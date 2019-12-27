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

  	// Values for Minimax
  	private DEPTH = 2;

	constructor(game) {
		this.engine = game;
	}

	getMove(option:number) {
		switch (option) {
			case 0:
				return this.getRandomMove();
				break;
			case 1:
				return this.getGreedyMove();
				break;
			case 2:
				return this.getMiniMaxMove();
				break;
			default:
				return this.getRandomMove();
				break;
		}
	}


	// Begin helper methods
	
	private getRandomMove() {
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

	private getGreedyMove() {
		let possibleMoves:[] = this.engine.moves()

		if (possibleMoves.length === 0) {
			alert("Game over!");
			return;
		}

		var targetValue:number = Infinity * this.COLOR;
		var moveIndex:number = 0;
		var temp = new Chess(this.engine.fen());
		for(var i:number = 0; i < possibleMoves.length; i++) {
			
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
			temp.undo();
		}
		return possibleMoves[moveIndex];
	}

	private getMiniMaxMove() {
		let possibleMoves:[] = this.engine.moves()
		if (possibleMoves.length === 0) {
			alert("Game over!");
			return;
		}
		let isMaximizing:boolean = (this.COLOR == 1);
		let bestIndex:number = this.getMinimaxRoot(this.DEPTH, new Chess(this.engine.fen()), isMaximizing);
		return possibleMoves[bestIndex];
	}

	private getMinimaxRoot (depth, game, isMaximizingPlayer) {
	    var possibleMoves:[] = game.moves();
	    var bestMove = -Infinity;
	    var bestIndexFound:number;

	    for(var i:number = 0; i < possibleMoves.length; i++) {
	        var nextMove = possibleMoves[i];
	        game.move(nextMove);
	        var value = this.minimax(depth-1, game, -Infinity, Infinity, !isMaximizingPlayer);
	        game.undo();
	        if(value >= bestMove) {
	            bestMove = value;
	            bestIndexFound = i;
	        }
	    }
	    return bestIndexFound;
	};

	private minimax (depth, game, alpha, beta, isMaximizingPlayer) {
	    if (depth === 0) {
	        return -this.computeScore(game.fen());
	    }
	    // console.log(`Calling minimax with depth: ${depth}`);
	    var possibleMoves:[] = game.moves();

	    if (isMaximizingPlayer) {
	        var bestMove = -Infinity;
	        for (var i = 0; i < possibleMoves.length; i++) {
	            game.move(possibleMoves[i]);
	            bestMove = Math.max(bestMove, this.minimax(depth -1, game, alpha, beta, !isMaximizingPlayer));

	            alpha = Math.max(alpha, bestMove);
	            if (beta <= alpha) {
	                return bestMove;
	            }

	            game.undo();
	        }
	        return bestMove;
	    } else {
	        var bestMove = Infinity;
	        for (var i = 0; i < possibleMoves.length; i++) {
	            game.move(possibleMoves[i]);
	            bestMove = Math.min(bestMove, this.minimax(depth - 1, game, alpha, beta, !isMaximizingPlayer));

	            beta = Math.min(beta, bestMove);
	            if (beta <= alpha) {
	                return bestMove;
	            }
	            game.undo();
	        }
	        return bestMove;
	    }
	};

	private computeScore(fen) {
		var score:number = 0;
		let ranks:string[] = fen.split("/");
		// console.log("Split ranks");
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
					// console.log("Score is updated to: "+score);
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
