var round = round || {}


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
        playCard(card);
        activePlayer.played.push(card);
        myimg.classList.add('reduced')
        // tableua.addChild(myimg)
    }
  })
  tableua.appendChild(myimg);
}

function takeTurn(name, round) {
    // Look up player object from player name
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
    console.log('you played card ' + card.name)
    card.action();
}

// function passTheTurn(round) {

// }
