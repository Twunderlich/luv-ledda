var round = round || {};

let DECKS = {
    "name": "Love Letter",
    "recipe": [
    {
      "card": "Guard",
      "quantity": 5,
    },
    {
      "card": "Priest",
      "quantity": 2,
    },
    {
      "card": "Baron",
      "quantity": 2,
    },
    {
      "card": "Handmaid",
      "quantity": 2,
    },
    {
      "card": "Prince",
      "quantity": 2,
    },
    {
      "card": "King",
      "quantity": 1,
    },
    {
      "card": "Countess",
      "quantity": 1,
    },
    {
      "card": "Princess",
      "quantity": 1,
    }
  ]
};

let CARDS = [
  {
    "rank": 1,
    "name": "Guard",
    "img": "img/Love_Letter_Card_Guard.jpg", // TODO REMOVE ME??? (or move image from above down to this structure)
    "rule": "Guess a player's hand; if correct the player is out.",
    "action": () => {
      let targetPlayerName;
      let targetPlayer;
      let discarded ={ name };
      do {
        targetPlayerName = window.prompt( 'Select a player' );
        targetPlayer = round.players.filter( player => player.name === targetPlayerName )[ 0 ];
        if ( targetPlayer.played.length !== 0 ) {
          discarded = targetPlayer.played[ targetPlayer.played.length - 1 ];
        } else discarded = '';
      } while ( discarded.name === "Handmaid");

      let targetCard;
      do {
        targetCard = window.prompt( 'Select a Card other than "Guard"' );
      } while ( targetCard.toLowerCase() === "guard" );

      if ( targetPlayer.hand.some( card => card.name === targetCard ) ) {
        const card = targetPlayer.hand.pop();
        targetPlayer.played.push( card );
        targetPlayer.in_round = false;
      }
    }
  },
  {
    "rank": 2,
    "name": "Priest",
    "img": "img/Love_Letter_Card_Priest.jpg",
    "rule": "Choose another player: Look at their hand."
  },
  {
    "rank": 3,
    "name": "Baron",
    "img": "img/Love_Letter_Card_Baron.jpg",
    "rule": "Choose another player: Compare hands; player with lower value is out."
  },
  {
    "rank": 4,
    "name": "Handmaid",
    "img": "img/Love_Letter_Card_Handmaid.jpg",
    "rule": "Until next turn, ignore all effects from other player's cards."
  },
  {
    "rank": 5,
    "name": "Prince",
    "img": "img/Love_Letter_Card_Prince.jpg",
    "rule": "Choose any player: They discard their hand and draw new card."
  },
  {
    "rank": 6,
    "name": "King",
    "img": "img/Love_Letter_Card_King.jpg",
    "rule": "Choose another player: Trade hands with them"
  },
  {
    "rank": 7,
    "name": "Countess",
    "img": "img/Love_Letter_Card_Countess.jpg",
    "rule": "if you have this card and 'King' or 'Prince': You must discard this card."
  },
  {
    "rank": 8,
    "name": "Princess",
    "img": "img/Love_Letter_Card_Princess.jpg",
    "rule": "If this card is discarded: you are out."
  }
];
let PLAYERS = [ 'Trav', 'JQ', 'Player1' ];
// let PLAYERS = JSON.parse( fs.readFileSync( 'players.json' ) );

function createRound( deck, players ) {
    // let round = {};
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
    round.getPlayerByName = name => round.players.filter( player => player.name === name )[ 0 ];
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
 let playersInRound = round.players.filter( player => player.in_round === true );
 playersInRound = playersInRound.concat( playersInRound );
 let activePlayerIndex = playersInRound.findIndex( player => player.name === round.active_player );
 let activePlayer = playersInRound[ activePlayerIndex + 1 ].name;
 return activePlayer;
}

function discard( player, cardName ) {
  let cardIndex = player.hand.findIndex( card => card.name === cardName );
  let cardDiscarded = player.hand.splice( cardIndex, 1 )[0];
  // cardDiscared.rule();
  player.played.push( cardDiscarded );
}

function draw( deck, player ) {
  let card = deck.pop()
  player.hand.push( card );
  return card;
}

function deal( deck, players ) {
  players.forEach(function (player) {
    draw(deck, player);
  })
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
