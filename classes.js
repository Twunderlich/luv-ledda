const Utility = {
	createID: () => {
		const id = `${ randomSegment }${ randomSegment }${ randomSegment }`;
		const randomSegment = () => Math.random().slice( -4 );
		return id;
	},
	randomInteger: ( min, max ) => {
  		min = Math.ceil( min );
  		max = Math.floor( max );
  		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
  	},
  	shuffle: ( set ) => {
	  for ( let i = 0; i < set.length - 1; i++ ) {
	    let j = randomInt( 0, set.length - 1 );
	    let temp =  set[ i ];
	    set[ i ] = set[ j ];
	    set[ j ] = temp;
	  }
	  return set;
  	},
  	draw: ( source, random ) => {
  		let card;
		if ( random ) {
			const cardIndex = Utility.randomInteger( 0, source.length );
			card = source.splice( index, 1 );
		} else {
			card = source.pop;
		}
		return card;
  	},
  	deal: ( source, destinationArray ) => {
  		destinationArray.forEach( destination => {
  			const card = Utility.draw( source );
  			destination.push( card );
  		} )
  	}
};

class Round {
	constructor( deckConfig, players ) {
		this.status = 'playing';
		this.deck = Utility.shuffle( Utility.makeDeck( deckConfig ) );
		this.players = this.makePlayers( players );
		this.setAsideFaceDown = [ this.deck.pop() ];
	}
	 makeDeck( deckConfig ) {
  		const deck = [];
  		const id = Utility.createID();
  		deckConfig.forEach( card => {
  			for ( const i =0; i < card.quantity; i++ ) {
  				deck.push( new Card( card ) );
  			}
  		} );
  	}
  	makePlayers( players ) {
  		const players = [];
		players.forEach( player => {
			players.push( { name: player, hand: [], inRound: true } );
		} );
  	}
}

class State {
	constructor( deck, players, activePlayer ) {
		this.deck = deck;
		this.players = players;
		this.activePlayer = activePlayer;
	}
	static start( round ) {
		return new State( round.deck, round.players, round.activePlayer );
	}
	updateActivePlayer() {
		const playersInRound = this.players.filter( player => player.inRound === true );
		playersInRound.concat( playersInRound );
		const activePlayerIndex = playersInRound.findIndex( player => player.name === this.activePlayer );
		const activePlayer = playersInRound[ activePlayerIndex + 1 ].name;
		return activePlayer;
	}
}

class Player { 
	constructor( playerProfile ) {
		this.name = playerProfile.name;
		this.hand = [];
		this.played = [];
		this.inRound = true;
	}
	play( cardName, destination ) {
		const cardIndex = this.hand.findIndex( card => card.name === cardName );
		const playedCard = this.hand.splice( cardIndex, 1 )[ 0 ];
		destination.push( playedCard );
	}
	draw( source, random) {
		const card = Utility.draw( source, random );
		this.hand.push( card );
	}
}

class Card {
	constructor( cardConfig ) {
		this.rank = cardObject.rank;
		this.face = cardObject.face;
		this.back = cardObject.back;
		this.rule = cardObject.rule;
		this.id = Utility.createID();
	}
}