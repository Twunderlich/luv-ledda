const fs = require('fs');
;
var CARDS = JSON.parse(fs.readFileSync('cards.json'));
var ROUND = {}

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
    var deck = []
    var id = 0
    recipe.forEach(function (card_recipe) {
        var template = CARDS.find(function (card) {
            return card.name === card_recipe.card
        });
        for (var i=0; i < card_recipe.quantity; i++){
            id += 1;
            var card = Object.assign({}, template);
            card.id = id;
            deck.push(card);
        }
    })
    return deck
}

function createRound(round_config) {
    var round = {};
    round.deck = makeDeck(round_config.deck_recipe)
    //round.players = makePlayers(round_config.players) 
    return round
}

function saveRound(round) {
    fs.writeFileSync('myround.json', JSON.stringify(round));
}

fs.readFile('round_config.json', function (err, data) {
  if (err) throw err;
  round = createRound(JSON.parse(data));
  saveRound(round);
});

function randomInt( min, max ) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle( deck ) {
  for ( var i = 0; i < deck.length - 1; i++ ) {
    var j = randomInt( 0, deck.length - 1 );
    var temp =  deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  return deck;
}