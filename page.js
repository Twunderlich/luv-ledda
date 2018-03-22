
let bt_start_game = document.querySelector( "#start-game" );
console.log( bt_start_game )
bt_start_game.addEventListener( "click", () => {
  let round = JSON.stringify( createRound() );
  localStorage.setItem( 'ROUND', round )
  bt_start_game.setAttribute( "display", "none" );
  console.log( JSON.parse( localStorage.getItem( 'ROUND' ) ) );
} );
  
function createRound() {
  return { round: 'test' };
}