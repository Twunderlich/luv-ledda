
let DECKS = [
  {
    "name": "Love Letter",
    "recipe": [
      {
        "card": "Guard",
        "quantity": 5
      },
      {
        "card": "Priest",
        "quantity": 2
      },
      {
        "card": "Baron",
        "quantity": 2
      },
      {
        "card": "Handmaid",
        "quantity": 2
      },
      {
        "card": "Prince",
        "quantity": 2
      },
      {
        "card": "King",
        "quantity": 1
      },
      {
        "card": "Countess",
        "quantity": 1
      },
      {
        "card": "Princess",
        "quantity": 1
      }
    ]
  }
];

let CARDS = [
  {
    "rank": 1,
    "name": "Guard",
    "img": "guard.jpg",
    "rule": "Guess a player's hand; if correct the player is out."
  },
  {
    "rank": 2,
    "name": "Priest",
    "img": "priest.jpg",
    "rule": "Choose another player: Look at their hand."
  },
  {
    "rank": 3,
    "name": "Baron",
    "img": "baron.jpg",
    "rule": "Choose another player: Compare hands; player with lower value is out."
  },
  {
    "rank": 4,
    "name": "Handmaid",
    "img": "handmaid.jpg",
    "rule": "Until next turn, ignore all effects from other player's cards."
  },
  {
    "rank": 5,
    "name": "Prince",
    "img": "prince.jpg",
    "rule": "Choose any player: They discard their hand and draw new card."
  },
  {
    "rank": 6,
    "name": "King",
    "img": "king.jpg",
    "rule": "Choose another player: Trade hands with them"
  },
  {
    "rank": 7,
    "name": "Countess",
    "img": "countess.jpg",
    "rule": "if you have this card and 'King' or 'Prince': You must discard this card."
  },
  {
    "rank": 8,
    "name": "Princess",
    "img": "princess.jpg",
    "rule": "If this card is discarded: you are out."
  }
];
let PLAYERS = [ 'Trav', 'JQ', 'Player1' ];
// let PLAYERS = JSON.parse( fs.readFileSync( 'players.json' ) );
let ROUND = createRound( DECKS[ 0 ] , PLAYERS )

function createRound( deck, players ) {
    let round = {};
    round.players = makePlayers( players );
    round.turn_order = shuffle( players );
    round.active_player = round.turn_order[ 0 ];
    round.deck = shuffle( makeDeck( deck.recipe ) );
    round.set_aside_face_down = [ round.deck.pop() ]; 
    round.set_aside_face_up = function() {
      if ( round.players.length === 2 ) {
        return round.deck.splice( round.deck.length - 3, 3 );
      } 
    }();
    deal( round.deck, round.players );
    return round
}

function makeDeck( recipe ) {
    let deck = []
    let id = 0
    recipe.forEach( function ( cardRecipe ) {
        let template = CARDS.find( function ( card ) {
            return card.name === cardRecipe.card
        } );
        for ( let i = 0; i < cardRecipe.quantity; i++ ) {
            id += 1;
            let card = Object.assign({}, template);
            card.id = id;
            deck.push(card);
        }
    } );
    return deck
}

function makePlayers( players ) {
  playerObjects = []
  players.forEach( function( player ) {
    playerObjects.push( { name: player, hand: [], played: [], in_round: true })
  } );
  return playerObjects;
}

function updateActivePlayer( round ) {
  let index = ROUND.turn_order.findIndex( function (player) {
    return player === ROUND.active_player;
  } ) + 1;
  let activePlayer;

  for ( let i = 0; i < round.turn_order.length; i++ ) {
    if ( ROUND.turn_order.length === index ) {
      index = 0;
    }

    if ( activePlayer === undefined && ROUND.players.find( function( player ) { return player.name === ROUND.turn_order[ index ] } ).in_round ) {
        activePlayer = ROUND.turn_order[ index ];
    } else { 
      index++;
    }
  }

  return activePlayer;
}

console.log( ROUND.turn_order )
console.log( ROUND.active_player, ROUND.players.find( player => player.name === ROUND.active_player).in_round )
ROUND.players[ 2 ].in_round = false 
ROUND.active_player = updateActivePlayer( ROUND )
console.log( ROUND.active_player, ROUND.players.find( player => player.name === ROUND.active_player).in_round )
ROUND.active_player = updateActivePlayer( ROUND )
console.log( ROUND.active_player, ROUND.players.find( player => player.name === ROUND.active_player).in_round )
ROUND.active_player = updateActivePlayer( ROUND )
console.log( ROUND.active_player, ROUND.players.find( player => player.name === ROUND.active_player).in_round );

function discard( player, cardName ) {
  let cardIndex = player.hand.findIndex( card => card.name === cardName );
  let cardDiscarded = player.hand.splice( cardIndex, 1 )[0];
  // cardDiscared.rule();
  player.played.push( cardDiscarded );
}

function draw( deck, player ) {
  player.hand.push( deck.pop() );
}

function deal( deck, players ) {
  players.forEach( function ( player ) {
    player.hand.push( deck.pop() );
  } )
} 

function randomInt( min, max ) {
  min = Math.ceil( min );
  max = Math.floor( max );
  return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

function shuffle( deck ) {
  for ( let i = 0; i < deck.length - 1; i++ ) {
    let j = randomInt( 0, deck.length - 1 );
    let temp =  deck[ i ];
    deck[ i ] = deck[ j ];
    deck[ j ] = temp;
  }
  return deck;
}