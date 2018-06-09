var round = round || {};

let bt_start_game = document.querySelector( "#start-game" );

bt_start_game.addEventListener( "click", () => {
  round = createRound( DECKS, PLAYERS );
  round.players.forEach(function (player, index) {
    initPlayer(player, index);
  })
  // localStorage.setItem( 'ROUND', round )
  bt_start_game.setAttribute( "display", "none" );
  takeTurn(round.active_player, round)
} );

function initPlayer(player, index) {
  let mytableua = document.querySelector('#tableua-p' + index); // #tableua-p0
  while (mytableua.firstChild) {
    mytableua.removeChild(mytableua.firstChild);
  }
  let myname = document.createElement('p');
  myname.innerHTML = player.name
  mytableua.appendChild(myname);
  createImg(player.hand[0], mytableua);
}

function createImg(card, tableua) {
  let myimg = document.createElement('img');
  myimg.src = card.img;
  myimg.id = 'img_' + card.id;
  myimg.classList.add('card');
  myimg.addEventListener('click', (mouseEvent) => {
    let activePlayer = round.players.filter(function (player) {
        return player.name == round.active_player;
    })[0];
    if (activePlayer.hand.includes(card)){
        activePlayer.hand.splice(activePlayer.hand.indexOf(card), 1);
        // tableua.removeChild(myimg)
        activePlayer.played.push(card);
        myimg.classList.add('reduced')
        playCard(card);
        // tableua.addChild(myimg)
    }
  } );
  tableua.appendChild(myimg);
}

function updateTableua() {
  round.players.forEach( p => p.played.forEach( c => {
      if ( c.name === "Princess" ) {
        p.in_round = false;
        p.played.push( p.hand.pop() );
      } 
    } ) );

  const playedCards = round.players.reduce( ( ( curr, next ) => {
    const cards = next.played.map( c => c.id )
    return curr.concat( cards ) ;
  } ), [] );
  playedCards.forEach( c => {
    const card = document.querySelector( '#img_' + c );
    card.classList.add( 'reduced' );
  } );

  // reduce not needed here, forEach maybe?
  const drawnCards = round.players.reduce( ( ( curr, next) => { 
    const cards = next.hand.filter( c => !document.querySelector( '#img_' + c.id ) );
    const index = round.players.findIndex( p => p.name === next.name )
    const tableua = document.querySelector('#tableua-p' + index );
    return curr.concat( cards.map( c => createImg( c, tableua ) ) );
  } ), [] );

  const cardsInHand = [];
  round.players.forEach( p => p.hand.forEach( c => {
    cardsInHand.push( document.querySelector( '#img_' + c.id ) );
  } ) );
  const movedCards = cardsInHand.filter( card => {
    const index = card.parentNode.id.slice( -1 );
    return round.players[ index ].hand.some( c => `img_${ c.id }` !== card.id );
  } );
  movedCards.forEach( card => {
    round.players.forEach( ( p, i ) => p.hand.forEach( c => {
      if ( `img_${ c.id }` === card.id ) {
        document.querySelector( '#tableua-p' + i ).appendChild( card );
      }
    } ) );
    // console.log( c, c.id, c.parentNode )
  } );

  // const movedCards = [];
  // const allCards = document.querySelectorAll( '.card' );
  // for ( const card in allCards ) {
  //   if ( allCards.hasOwnProperty( card ) ) {
  //       const index = allCards[ card ].parentNode.id.slice( -1 );
  //       console.log( allCards[ card ].id, round.players[ index ].hand[ 0 ].id )
  //       if ( round.players[ index ].hand.some( c => `img_${ c.id }` !== allCards[ card ].id) )
  //         movedCards.push( allCards[ card ] );
  //     }
  // }
  // console.log( movedCards );
}

function takeTurn(name, round) {
    // Look up player object from player name
    console.log( `It's ${ name }'s turn` );
    let player_idx = round.players.findIndex(function (player) {
        return player.name === name;
    })
    let player = round.players[player_idx];
    new_card = draw(round.deck, player);
    let mytableua = document.querySelector('#tableua-p' + player_idx); // #tableua-p0
    createImg(new_card, mytableua);
    // let myimg = document.createElement('img');
    // myimg.src = new_card.img;
    // myimg.id = 'img_' + new_card.id;
    // myimg.classList.add('card');
    // mytableua.appendChild(myimg);
}

function playCard(card) {
    console.log(`...they played a ${ card.name }` )
    card.action();
    updateTableua();
    endTurn( round );
}

function endTurn( round ) {
  const activePlayers = round.players.filter( p => p.in_round === true );

  if ( activePlayers.length === 1 ) {
        window.alert( `${ activePlayers[ 0 ].name } is the last player left in the game, they won!`)
  } else if ( round.deck.length === 0 ) {
    const winner = round.players.reduce( ( curr, next ) => {
      if ( curr.hand[ 0 ].rank > next.hand[ 0 ].rank ) return curr;
      else return next;
    } );
    window.alert( `${ winner.name } is the player left in the game with the highest ranking card, they won!` )
  } else {  
    round.active_player = updateActivePlayer( round );
    takeTurn( round.active_player, round );
  }
}

// }
