

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%% Instructions: %%%%%%%%%%%%%%%%%%%
%%% TO START THE GAME USE: startMorelli. %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


gameExampleEnd(K) :-
	K =
	[
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
	[0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
	[0, 0, 0, 1, 2, 2, 1, 2, 1, 0, 0, 0, 0],
	[0, 2, 0, 1, 2, 2, -1, 1, 1, 0, 2, 0, 0],
	[0, 2, 0, 1, 2, 2, 2, 1, 1, 0, 2, 0, 0],
	[0, 0, 2, 2, 2, 2, 2, 2, 1, 0, 1, 0, 0],
	[0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 0, 0, 0],
	[0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	].


gameExampleStart(K) :-
	K =
	[
	[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 2],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ]
	].



gameExampleMiddle(K) :-
	K =
	[
	[1, 0, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2 ],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 0, 2, 0, 0, 2, 0, 0, 0, 2, 0, 2 ],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 2],
	[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 2 ],
	[1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 ],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
	[0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 2 ]
	].
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%        BOARD DRAWING        %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%--Creating a New Line--%%%%

addLine(_, Max, Max, _).  %stop condition

addLine([H|T], 0, BoardSize, [Y|Z]):-		%adds the first line with random piece
	fillFirstLine(H, 0, BoardSize, [Y|Z]),
	addLine(T, 1, BoardSize, [Y|Z]). 

addLine([H|_], I, BoardSize, [Y|Z]):-		%adds the last line which is the reverse of the first
	I+1=:=BoardSize,
	fillLastLine(H, 0, BoardSize, [Y|Z]).

addLine([H|T], I, BoardSize, [Y|Z]):-		%fills the middle lines
	I1 is I+1,
	firstPiece(H, 0, BoardSize),
	addLine(T, I1, BoardSize, [Y|Z]). 

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%%%--Fills Line--%%%%%%%%%
fillFirstLine(_, A,A,_). %stop condition

fillFirstLine([H|T], I, BoardSize, [Y|Z]):-
	I1 is I+1,
	random(1, 3, H1),
	H = H1,
	reverseColor(H2,H1),
	Y = H2,
	fillFirstLine(T, I1, BoardSize, Z).

fillLastLine(_, A,A, _). %stop condition

fillLastLine([H|T], I, BoardSize, [Y|Z]):-
	I1 is I+1,
	H = Y,
	fillLastLine(T, I1, BoardSize, Z).

firstPiece([H|T], _, BoardSize):- 
	random(1,3,First),
	H = First,
	fillLine(T, 1, BoardSize, First).

fillLine(_, Max, Max, _).

fillLine([H|_], I,BoardSize, First):- 
	I+1=:=BoardSize,
	reverseColor(Last, First),
	H = Last.

fillLine([H|T], I, BoardSize, First):-
	I1 is I+1,
	H = 0,
	fillLine(T, I1, BoardSize, First).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%%--Prints Line--%%%%%%%%%

printLine([]):-
	write('|').

printLine([H|T]):-
	write('|'),
	write(' '),
	getSymbol(H, X),
	write(X),
	write(' '),
	printLine(T).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%%%%Prints Divisors%%%%%%%

printDivisor([]):-
	write('|').

printDivisor([_|T]):- 
	write('|'),
	write('----'),
	printDivisor(T).

printFirstDivisor(A,A):- 
	write('|'),nl.

printFirstDivisor(I, BoardSize):-
	I1 is I+1,
	write('|'),
	write('----'),
	printFirstDivisor(I1, BoardSize).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%Prints Vertical Indice%%%%%

printIndiceV(I):-
	I1 is I+1,
	I1 < 11,
	write(' '),
	write(I).

printIndiceV(I):-
	I1 is I+1,
	I1 > 10,
	write(I).


%%%Prints Horizontal Indice %%%%

printIndice(A,A):- 
	nl.

printIndice(I,BoardSize):-
	I < 11,
	I1 is I+1,
	write('    '),
	write(I),
	printIndice(I1, BoardSize).

printIndice(I,BoardSize):-
	I > 10,
	I1 is I+1,
	write('   '),
	write(I),
	printIndice(I1, BoardSize).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%%% Prints Board %%%%%%%%%%

printGameZone([], _). %stop condition

printGameZone([H|T], I):-
	printIndiceV(I), %prints vertical indice
	printLine(H), nl, 
	write('  '),
	printDivisor(H), nl,
	I1 is I+1,
	printGameZone(T, I1).

printMorelli(Board, I, BoardSize):-
	printIndice(0,BoardSize), %prints horizontal indice
	write('  '),
	printFirstDivisor(0, BoardSize), %prints first divisor
	printGameZone(Board, I).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%%--Main Function--%%%%%%%
startMorelli:- %I is zero, S is board size
	mainMenu.

startDrawingBoard(_, BoardSize, Board):-
	addLine(Board1, 0, BoardSize, _),
	setPosElem(6, 6, -1, Board1, Board).

%%%%%% PLAYER VS. PLAYER %%%%%%%
playGamePvP(Board,Player):-
	write(Board),
	nl,
	nl,
	nl,
	startDrawingBoard(0,13, Board),!,
	write(Board),
	%gameExampleStart(Board),
	startGame(Board, Player).

startGame(Board,Player):-
	getPlayerColor(Player, Piece), 
	checkEnd(Board, 1, 1, 13, Piece),
	getPlayerInput(Board,Player).

gameOver(Board):- 
	clearScreen(40),
	getElem(6,6, Board, Elem),
	getWinner(Winner, Elem),
	write('GAME OVER'),nl,	
	write('The winner is: '), write(Winner),nl,nl,
	printMorelli(Board, 0, 13),
	startMorelli.

getPlayerInput(Board,Player):-
	printMorelli(Board, 0, 13),
	printMessage(Player),
	getPieceCoords(Board, Player, CurrRow, CurrCol),
	getDestCoords(Board, Player, CurrRow, CurrCol, _, _).



getPieceCoords(Board, Player, CurrRow, CurrCol):-
	write('Piece row? (example: 1.)'), nl,
	read(CurrRow),cleanBuffer,nl,
	write('Piece col? (example: 1.)'), nl,
	read(CurrCol),cleanBuffer, nl,
	getElem(CurrRow, CurrCol, Board, Piece),
	getPlayerColor(Player, Piece).

getPieceCoords(Board,Player,_,_):-
	write('ERROR!! That is not your piece! Try again.'),nl,nl,
	startGame(Board, Player).


getDestCoords(Board, Player, CurrRow, CurrCol, DestRow, DestCol):-
	write('Destination row? (example: 1.)'), nl,
	read(DestRow),nl,
	write('Destination col? (example: 1.)'), nl,
	read(DestCol),nl,
	validInput(CurrRow, CurrCol, DestRow, DestCol, Board),
	getPlayerColor(Player, Piece),
	setPosElem(DestRow, DestCol, Piece, Board, Board1),
	setPosElem(CurrRow, CurrCol, 0, Board1, Board2),
	checkCapture(DestRow, DestCol, Piece, Board2, Board3),
	checkCenter(DestRow, DestCol, Piece, Board3, Board4),
	switchPlayer(NextPlayer, Player),
	startGame(Board4, NextPlayer).
	

getDestCoords(Board, Player, _, _, _, _):- 
	write('Not a valid move! Try again.'), nl,nl,
	startGame(Board, Player).



printMessage(Player):-
	Player == blackPlayer, write('Black Player turn: '),nl.

printMessage(Player):-
	Player == whitePlayer, write('White Player turn: '),nl.


%%%%%% PLAYER VS. BOT %%%%%%%

playGamePvB(Board,Player):-
	startDrawingBoard(0,13, Board),!,
	%gameExampleEnd(Board),
	startGamePvB(Board, Player).

startGamePvB(Board, Player):-
	getPlayerColor(Player, Piece), 
	checkEnd(Board, 1, 1, 13, Piece),
	getInput(Board,Player).

getInput(Board,Player):-
	getPlayerColor(Player, Piece),
	checkEnd(Board, 1, 1, 13, Piece),
	printMorelli(Board, 0, 13),
	printMessage(Player),
	getPieceCoordsPvB(Board, Player, CurrRow, CurrCol),
	getDestCoordsPvB(Board, Player, CurrRow, CurrCol, _, _).


getDestCoordsPvB(Board, Player, CurrRow, CurrCol, DestRow, DestCol):-
	write('Destination row? (example: 1.)'), nl,
	read(DestRow),nl,
	write('Destination col? (example: 1.)'), nl,
	read(DestCol),nl,
	validInput(CurrRow, CurrCol, DestRow, DestCol, Board),
	getPlayerColor(Player, Piece),
	setPosElem(DestRow, DestCol, Piece, Board, Board1),
	setPosElem(CurrRow, CurrCol, 0, Board1, Board2),
	checkCapture(DestRow, DestCol, Piece, Board2, Board3),
	checkCenter(DestRow, DestCol, Piece, Board3, Board4),
	switchPlayer(NextPlayer, Player),
	getBot(Board4,NextPlayer).

getDestCoordsPvB(Board, Player, _, _, _, _):- 
	write('Not a valid move! Try again.'), nl,nl,
	getInput(Board, Player).


getPieceCoordsPvB(Board, Player, CurrRow, CurrCol):-
	write('Piece row? (example: 1.)'), nl,
	read(CurrRow),cleanBuffer,nl,
	write('Piece col? (example: 1.)'), nl,
	read(CurrCol),cleanBuffer, nl,
	getElem(CurrRow, CurrCol, Board, Piece),
	getPlayerColor(Player, Piece).

getPieceCoordsPvB(Board,Player,_,_):-
	write('ERROR!! That is not your piece! Try again.'),nl,nl,
	getInput(Board, Player).


getBot(Board, Player):-
	getPlayerColor(Player, Piece),
	checkEnd(Board, 1, 1, 13, Piece),
	validMoves(0, 0, 13, Piece, Board, _).

validMoves(A, Max, Max, Piece, Board, ListOfMoves):-
	A2 is A + 1,

	validMoves(A2, 0, Max, Piece, Board, ListOfMoves).

	
validMoves(A, B, Max, Piece, Board, ListOfMoves):-
	B2 is B + 1,

	getElem(A, B, Board, Elem),
	((Elem \= Piece) -> validMoves(A, B2, Max, Piece, Board, ListOfMoves);
							findall([DestRow,DestCol], validInput(A, B , DestRow, DestCol, Board),Bag), append([A,B], Bag, Res), length(Res, SizeRes),
							(SizeRes > 2 -> append(ListOfMoves, [Res], List), validMoves(A, B2, Max, Piece, Board, List); 
								validMoves(A, B2, Max, Piece, Board, ListOfMoves))).


validMoves(Max2, Max, Max, Piece, Board, ListOfMoves):-	
	Max2 is Max - 1,
	getPlayerColor(Player, Piece),nl,
	getRandomPlay(Board, ListOfMoves, Player).


getRandomPlay(Board, ListOfMoves, Player):-
	getPlayerColor(Player, Piece),

	length(ListOfMoves, LengthList),
	LL is LengthList + 1,nl,
	random(1, LL, Pos),
	nth0(Pos, ListOfMoves, List), %random between 0 and Length of the list
	nth0(0, List, PieceRow),
	nth0(1, List, PieceCol),

	CurrRow is PieceRow,
	CurrCol is PieceCol,

	length(List, LengthList2),
	LL2 is LengthList2 + 1,nl,
	random(2, LL2, PosDest), %random between 2 and Length of the list
	nth0(PosDest, List, Play), 
	nth0(0, Play, DRow),
	nth0(1, Play, DCol),

	DestRow is DRow,
	DestCol is DCol,

	setPosElem(DestRow, DestCol, Piece, Board, Board1),
	setPosElem(CurrRow, CurrCol, 0, Board1, Board2),
	checkCapture(DestRow, DestCol, Piece, Board2, Board3),
	checkCenter(DestRow, DestCol, Piece, Board3, Board4),
	switchPlayer(NextPlayer, Player),
	getInput(Board4, NextPlayer).


validMoves(A, Max, Max, Piece, Board, ListOfMoves, Board4, X0, Y0, XF, YF):-
	A2 is A + 1,

	validMoves(A2, 0, Max, Piece, Board, ListOfMoves, Board4, X0, Y0, XF, YF).

	
validMoves(A, B, Max, Piece, Board, ListOfMoves, Board4, X0, Y0, XF, YF):-
	B2 is B + 1,

	getElem(A, B, Board, Elem),
	((Elem \= Piece) -> validMoves(A, B2, Max, Piece, Board, ListOfMoves, Board4, X0, Y0, XF, YF);
							findall([DestRow,DestCol], validInput(A, B , DestRow, DestCol, Board),Bag), append([A,B], Bag, Res), length(Res, SizeRes),
							(SizeRes > 2 -> append(ListOfMoves, [Res], List), validMoves(A, B2, Max, Piece, Board, List, Board4, X0, Y0, XF, YF); 
								validMoves(A, B2, Max, Piece, Board, ListOfMoves, Board4, X0, Y0, XF, YF))).


validMoves(Max2, Max, Max, Piece, Board, ListOfMoves, Board4, X0, Y0, XF, YF):-	
	Max2 is Max - 1,
	getPlayerColor(Player, Piece),nl,
	getRandomPlay(Board, ListOfMoves, Player, Board4, X0, Y0, XF, YF).

getRandomPlay(Board, ListOfMoves, Player, Board4, X0, Y0, XF, YF):-
	getPlayerColor(Player, Piece),
	length(ListOfMoves, LengthList),
	LL is LengthList + 1,nl,
	random(1, LL, Pos),
	nth0(Pos, ListOfMoves, List), %random between 0 and Length of the list
	nth0(0, List, PieceRow),
	nth0(1, List, PieceCol),

	CurrRow is PieceRow,
	CurrCol is PieceCol,

	length(List, LengthList2),
	LL2 is LengthList2 + 1,nl,
	random(2, LL2, PosDest), %random between 2 and Length of the list
	nth0(PosDest, List, Play), 
	nth0(0, Play, DRow),
	nth0(1, Play, DCol),

	DestRow is DRow,
	DestCol is DCol,

	X0 is CurrCol,
	Y0 is CurrRow,
	XF is DestCol,
	YF is DestRow,

	setPosElem(DestRow, DestCol, Piece, Board, Board1),
	setPosElem(CurrRow, CurrCol, 0, Board1, Board2),
	checkCapture(DestRow, DestCol, Piece, Board2, Board3),
	checkCenter(DestRow, DestCol, Piece, Board3, Board4).
