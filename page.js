


let bt_start_game = document.querySelector( "#start-game" );

bt_start_game.addEventListener( "click", () => {
  let round = JSON.stringify( createRound( DECKS[ 0 ].recipe, PLAYERS ) );
  localStorage.setItem( 'ROUND', round )
  bt_start_game.setAttribute( "display", "none" );
} );
  