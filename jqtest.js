const fs = require('fs');

const CONFIG = JSON.parse( fs.readFileSync( 'round_config.json' ) );
const CARDS = JSON.parse(fs.readFileSync('cards.json'));
let ROUND = {}
let PLAYERS = JSON.parse( fs.readFileSync( 'players.json' ) );

console.log(  )

// console.log(CARDS)
// {
//   "whose_turn": "JQ",
//   "turn_order": [],
//   "deck": [],
//   "set_aside_face_up": [],
//   "set_aside_face_down": [],
//   "players": [
//     {
//       "name": "JQ",
//       "hand": [],
//       "played": []
//     },
//     {
//       "name": "Trav",
//       "hand": [],
//       "played": []
//     }
//   ]
// }

function makeDeck(recipe) {
    let deck = []
    let id = 0
    recipe.forEach(function (card_recipe) {
        let template = CARDS.find(function (card) {
            return card.name === card_recipe.card
        });
        for (let i=0; i < card_recipe.quantity; i++){
            id += 1;
            let card = Object.assign({}, template);
            card.id = id;
            deck.push(card);
        }
    })
    return deck
}

function makePlayers( players ) {
  playerObjects = []
  players.forEach( function( player ) {
    playerObjects.push( { name: player, hand: [], played: [], in_round: true })
  } );
  return playerObjects;
}

function createRound( round_config, players ) {
    let round = {};
    round.players = makePlayers( players );
    round.turn_order = shuffle( players );
    round.deck = shuffle( makeDeck(round_config.deck_recipe) );
    round.set_aside_face_down = [ round.deck.pop() ]; 
    round.set_aside_face_up = function() {
      if ( round.players.length === 2 ) {
        return round.deck.splice( round.deck.length - 3, 3 );
      } 
    }();
    deal( round.deck, round.players );
    return round
}

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

function saveRound(round) {
    fs.writeFileSync('myround.json', JSON.stringify(round));
}

fs.readFile('round_config.json', function (err, data) {
  if (err) throw err;
  round = createRound(JSON.parse(data), [ 'Trav', 'JQ' ]);
  saveRound(round);
});

function randomInt( min, max ) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle( deck ) {
  for ( let i = 0; i < deck.length - 1; i++ ) {
    let j = randomInt( 0, deck.length - 1 );
    let temp =  deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  return deck;
}