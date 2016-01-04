%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%          INTERFACE 	      %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


mainMenu:-
	printMainMenu,
	getChar(Answer),
	(
		Answer = '1' -> gameMenu, mainMenu;
		Answer = '2' -> helpMenu, mainMenu;
		Answer = '3' -> aboutMenu, mainMenu;
		Answer = '4';

		nl,
		write('Error: invalid input.'), nl,
		pressEnterToContinue, nl,
		mainMenu
	).

printMainMenu:-
	clearScreen(20),
	write('---------------------------------'), nl,
	write('              MORELLI            '), nl,
	write('      Created by Richard Moxham  '), nl,
	write('---------------------------------'), nl,
	write('                                 '), nl,
	write('    1. Start Game                '), nl,
	write('    2. Rules                     '), nl,
	write('    3. About                     '), nl,
	write('    4. Quit                      '), nl,
	write('---------------------------------'), nl,
	write('Choose an option:'), nl,
	write('                                 '), nl.

gameMenu:-
	printGameMenu,
	getChar(Answer),
	(
		Answer = '1' -> startPvsP, gameMenu;
		Answer = '2' -> startPvsB, gameMenu;
		Answer = '3' -> startBvsB, gameMenu;
		Answer = '4' -> mainMenu;

		nl,
		write('Error: invalid input.'), nl,
		pressEnterToContinue, nl,
		gameMenu

	).

startPvsP:-
	clearScreen(40), !,
	playGamePvP(_, blackPlayer).

startPvsB:-
	clearScreen(40), !,
	playGamePvB(_,blackPlayer).


startBvsB:-
	write('Not available. Wait for next update!'),nl,
		pressEnterToContinue.




printGameMenu:-
	clearScreen(40),
	write('---------------------------------'), nl,
	write('             GAME MENU           '), nl,
	write('---------------------------------'), nl,
	write('                                 '), nl,
	write('    1. Player Vs. Player         '), nl,
	write('    2. Player Vs. Bot            '), nl,
	write('    3. Bot Vs. Bot               '), nl,
	write('    4. Return                    '), nl,
	write('---------------------------------'), nl,
	write('Choose an option:'), nl,
	write('                                 '), nl.


helpMenu:-
	clearScreen(40),
	write('---------------------------------------------'), nl,
	write('                   HELP MENU                 '), nl,
	write('---------------------------------------------'), nl,
	write('Moving a Piece:                              '), nl,nl,
	write('To move a piece you have to choose a house   '), nl,
	write('that belongs to a level closer to the center.'), nl,
	write('You can only go through the center if its   '), nl,
	write('empty, and you cannot stop there.            '), nl,
	write('There cannot be any pieces in your way.      '), nl,nl,nl,
	write('Capturing a Piece:                           '), nl,nl,
	write('To capture a piece of the other team you have'), nl,
	write('to surround it in any direction with two pieces.'), nl,nl,nl,
	write('Capturing the center:                        '), nl,
	write('To capture the center you have to make a square'), nl,
	write('surrounding the center.                      '), nl,nl,nl,
	write('End of game:                                 '), nl,nl,
	write('The game ends when there is no more moves the'), nl,
	write('player that has the center captured, wins.   '), nl,
	write('---------------------------------------------'), nl,



	pressEnterToContinue.


aboutMenu:-
	clearScreen(40),
	write('---------------------------------'), nl,
	write('           ABOUT THE GAME        '), nl,
	write('---------------------------------'), nl,
	write('                                 '), nl,
	write(' Authors:                        '), nl,
	write('  Francisco Rodrigues            '), nl,
	write('  Marta Lopes                    '), nl,
	write('                                 '), nl,
	write('---------------------------------'), nl,

	pressEnterToContinue.
	


playGame:-
	clearScreen(40),
	startDrawingBoard(0,13),

	pressEnterToContinue, !.
	