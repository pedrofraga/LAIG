getSymbol(1, 'x '). %black
getSymbol(2, 'o '). %white
getSymbol(0, '  '). %empty
getSymbol(-1, 'N '). %empty center
getSymbol(3, 'X '). %black tower
getSymbol(4, 'O '). %white tower


getPlayerColor(blackPlayer, 1).
getPlayerColor(whitePlayer, 2).

getWinner('Black Player!', 3).
getWinner('White Player!', 4).
getWinner('Nobody! Its a Tie', -1).

reverseColor(1, 2).
reverseColor(2, 1).

switchPlayer(blackPlayer, whitePlayer).
switchPlayer(whitePlayer, blackPlayer).

getTower(1, 3).
getTower(2, 4).
