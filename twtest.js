const fs = require( 'fs' );

const DECKS = JSON.parse( fs.readFileSync( 'decks.json' ) );
const CARDS = JSON.parse( fs.readFileSync('cards.json' ) );
let PLAYERS = [ 'Trav', 'JQ' ];
// let PLAYERS = JSON.parse( fs.readFileSync( 'players.json' ) );
let ROUND = createRound( DECKS[ 0 ] , PLAYERS )
console.log( ROUND )

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