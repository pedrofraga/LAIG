%%%%%%%%% CHECK MOVEMENT %%%%%%%%%%%

validMove(X,X, dr):-   %% down right
  	X > 0.

validMove(X,X, ul):- %% up left
	X < 0.

validMove(X1,X, dl):-  %% down left
	X1 =:= abs(X),
	X1 > 0,
	X < 0.

validMove(X1,X, ur):- %% up right
	X =:= abs(X1),
	X1 < 0,
	X > 0.

validMove(0,X, r):-  %% right
	X > 0.

validMove(0, X, l):-  %% left
	X < 0.

validMove(X,0, d):-   %% down
	X > 0.

validMove(X,0, u):-  %% up
	X < 0.


calculateLevel(Row,Col, Level):-
	DeltaRow is abs(6-Row),
	DeltaCol is abs(6-Col),
	Level is max(DeltaRow, DeltaCol).

searchVector(_,_,X,X,X1,dr,_):-
	X1 =:= X.

searchVector(CurrRow, CurrCol, DeltaRow, DeltaCol, It, dr, Board):-
	It1 is It + 1,
	It1 =< abs(DeltaRow),
	It1 =< abs(DeltaCol),
	NewCurrRow = CurrRow + 1,
	NewCurrCol = CurrCol + 1,
	getElem(NewCurrRow, NewCurrCol, Board, Elem),
	Elem =:= 0,
	searchVector(NewCurrRow, NewCurrCol, DeltaRow, DeltaCol, It1, dr, Board).

searchVector(_,_,X,X,X1,ul,_):-
	X1 =:= abs(X).
	
searchVector(CurrRow, CurrCol, DeltaRow, DeltaCol, It, ul, Board):-
	It1 is It + 1,
	It1 =< abs(DeltaRow),
	It1 =< abs(DeltaCol),
	NewCurrRow = CurrRow - 1,
	NewCurrCol = CurrCol - 1,
	getElem(NewCurrRow, NewCurrCol, Board, Elem),
	Elem =:= 0,
	searchVector(NewCurrRow, NewCurrCol, DeltaRow, DeltaCol, It1, ul, Board).

searchVector(_,_,X1,X,X1,dl,_):-
	X1 =:= abs(X).
		
searchVector(CurrRow, CurrCol, DeltaRow, DeltaCol, It, dl, Board):-
	It1 is It + 1,
	It1 =< abs(DeltaRow),
	It1 =< abs(DeltaCol),
	NewCurrRow = CurrRow + 1,
	NewCurrCol = CurrCol - 1,
	getElem(NewCurrRow, NewCurrCol, Board, Elem),
	Elem =:= 0,
	searchVector(NewCurrRow, NewCurrCol, DeltaRow, DeltaCol, It1, dl, Board).

searchVector(_,_,X1,X,X,ur,_):-
	X =:= abs(X1).

searchVector(CurrRow, CurrCol, DeltaRow, DeltaCol, It, ur, Board):-
	It1 is It + 1,
	It1 =< abs(DeltaRow),
	It1 =< abs(DeltaCol),
	NewCurrRow = CurrRow - 1,
	NewCurrCol = CurrCol + 1,
	getElem(NewCurrRow, NewCurrCol, Board, Elem),
	Elem =:= 0,
	searchVector(NewCurrRow, NewCurrCol, DeltaRow, DeltaCol, It1, ur, Board).
	
searchVector(_,_,0,X,X,r,_).

searchVector(CurrRow, CurrCol, DeltaRow, DeltaCol, It,  r, Board):-
	It1 is It + 1,
	It1 =< abs(DeltaCol),
	NewCurrCol = CurrCol + 1,
	getElem(CurrRow, NewCurrCol, Board, Elem),
	Elem =:= 0,
	searchVector(CurrRow, NewCurrCol, DeltaRow, DeltaCol, It1, r, Board).
	
searchVector(_,_,0,X1,X,l,_):-
	X =:= abs(X1).

searchVector(CurrRow, CurrCol, DeltaRow, DeltaCol, It, l, Board):-
	It1 is It + 1,
	It1 =< abs(DeltaCol),
	NewCurrCol = CurrCol - 1,
	getElem(CurrRow, NewCurrCol, Board, Elem),
	Elem =:= 0,
	searchVector(CurrRow, NewCurrCol, DeltaRow, DeltaCol, It1, l, Board).

searchVector(_,_,X,0,X,d,_).

searchVector(CurrRow, CurrCol, DeltaRow, DeltaCol, It, d, Board):-
	It1 is It + 1,
	It1 =< abs(DeltaRow),
	NewCurrRow = CurrRow + 1,
	getElem(NewCurrRow, CurrCol, Board, Elem),
	Elem =:= 0,
	searchVector(NewCurrRow, CurrCol, DeltaRow, DeltaCol, It1, d, Board).

searchVector(_,_,X1,0,X,u,_):-
	X =:= abs(X1).

searchVector(CurrRow, CurrCol, DeltaRow, DeltaCol, It, u, Board):-
	It1 is It + 1,
	It1 =< abs(DeltaRow),
	NewCurrRow = CurrRow - 1,
	getElem(NewCurrRow, CurrCol, Board, Elem),
	Elem =:= 0,
	searchVector(NewCurrRow, CurrCol, DeltaRow, DeltaCol, It1, u, Board).

validInput(CurrRow,CurrCol, DestRow, DestCol, Board):-
	between(0,12,DestRow),between(0,12,DestCol),
	((DestRow =:= 6, DestCol =:= 6) -> fail; 
	calculateLevel(CurrRow, CurrCol, CurrLevel),
	calculateLevel(DestRow, DestCol, DestLevel),
	CurrLevel > DestLevel,
	DeltaRow is DestRow - CurrRow,
	DeltaCol is DestCol - CurrCol,
	validMove(DeltaRow, DeltaCol, VecDirection),
	searchVector(CurrRow, CurrCol, DeltaRow, DeltaCol, 0, VecDirection, Board)).



validInput(_,_,_,_,_):-
	fail.


noMovement(CurrRow, CurrCol, DestRow, DestCol, Board):-
	calculateLevel(CurrRow, CurrCol, CurrLevel), %calculates the level of the piece in the current position
	calculateLevel(DestRow, DestCol, DestLevel), %calculates the level of destination
	CurrLevel > DestLevel,						 %compares the levels to check if its a valid move
	DeltaRow is DestRow - CurrRow,				
	DeltaCol is DestCol - CurrCol,
	validMove(DeltaRow, DeltaCol, VecDirection), %goes through all the direction vectors and sees if there is anything in the way
	searchVector(CurrRow, CurrCol, DeltaRow, DeltaCol, 0, VecDirection, Board), !,fail. 

noMovement(_,_,_,_,_):- true.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%% CHECK CAPTURE %%%%%%%%%%%%%%%%%%


checkCapture(PieceRow, PieceCol, Piece, Board, FinalBoard):- 	%check if any piece is captured after the movement in all directions
	checkCaptureU(PieceRow, PieceCol, Piece, Board, Board1),	%up
	checkCaptureD(PieceRow, PieceCol, Piece, Board1, Board2),	%down
	checkCaptureL(PieceRow, PieceCol, Piece, Board2, Board3),	%left
	checkCaptureR(PieceRow, PieceCol, Piece, Board3, Board4),	%right
	checkCaptureUL(PieceRow, PieceCol, Piece, Board4, Board5),	%up left
	checkCaptureUR(PieceRow, PieceCol, Piece, Board5, Board6),	%up right
	checkCaptureDL(PieceRow, PieceCol, Piece, Board6, Board7),	%down left
	checkCaptureDR(PieceRow, PieceCol, Piece, Board7, FinalBoard). %down right


checkCaptureU(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow - 1,
	CheckCol is PieceCol, 
	getElem(CheckRow, CheckCol, Board, CheckPiece),
	reverseColor(Piece, CheckPiece), 
	checkCaptureU2(CheckRow, CheckCol, CheckPiece, Board, Board1).

checkCaptureU(_, _, _, Board, Board1):- 
	getElem(6,6, Board, GetPiece),
	setPosElem(6, 6, GetPiece, Board, Board1).
	

checkCaptureU(_, _, _, _,_).

checkCaptureU2(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow - 1,
	CheckCol is PieceCol, 
	getElem(CheckRow, CheckCol, Board, CheckPiece), 
	reverseColor(Piece, CheckPiece),  
	setPosElem(PieceRow, PieceCol, CheckPiece, Board, TempBoard),
	checkCenter(PieceRow, PieceCol, CheckPiece, TempBoard, Board1).
	
checkCaptureU2(_, _, _, _,_):-
	fail.


checkCaptureD(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow + 1,
	CheckCol is PieceCol, 
	getElem(CheckRow, CheckCol, Board, CheckPiece),
	reverseColor(Piece, CheckPiece), 
	checkCaptureD2(CheckRow, CheckCol, CheckPiece, Board, Board1).

checkCaptureD(_, _, _, Board, Board1):- 
	getElem(6,6, Board, GetPiece),
	setPosElem(6, 6, GetPiece, Board, Board1).
	

checkCaptureD(_, _, _, _,_).

checkCaptureD2(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow + 1,
	CheckCol is PieceCol, 
	getElem(CheckRow, CheckCol, Board, CheckPiece), 
	reverseColor(Piece, CheckPiece),  
	setPosElem(PieceRow, PieceCol, CheckPiece, Board, TempBoard),
	checkCenter(PieceRow, PieceCol, CheckPiece, TempBoard, Board1).
	
checkCaptureD2(_, _, _, _,_):-
	fail.


checkCaptureL(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow,
	CheckCol is PieceCol-1, 
	getElem(CheckRow, CheckCol, Board, CheckPiece),
	reverseColor(Piece, CheckPiece), 
	checkCaptureL2(CheckRow, CheckCol, CheckPiece, Board, Board1).

checkCaptureL(_, _, _, Board, Board1):- 
	getElem(6,6, Board, GetPiece),
	setPosElem(6, 6, GetPiece, Board, Board1).
	

checkCaptureL(_, _, _, _,_).

checkCaptureL2(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow,
	CheckCol is PieceCol - 1, 
	getElem(CheckRow, CheckCol, Board, CheckPiece), 
	reverseColor(Piece, CheckPiece),  
	setPosElem(PieceRow, PieceCol, CheckPiece, Board, TempBoard),
	checkCenter(PieceRow, PieceCol, CheckPiece, TempBoard, Board1).
	
checkCaptureL2(_, _, _, _,_):-
	fail.


checkCaptureR(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow,
	CheckCol is PieceCol+1, 
	getElem(CheckRow, CheckCol, Board, CheckPiece),
	reverseColor(Piece, CheckPiece), 
	checkCaptureR2(CheckRow, CheckCol, CheckPiece, Board, Board1).

checkCaptureR(_, _, _, Board, Board1):- 
	getElem(6,6, Board, GetPiece),
	setPosElem(6, 6, GetPiece, Board, Board1).
	

checkCaptureR(_, _, _, _,_).

checkCaptureR2(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow,
	CheckCol is PieceCol + 1, 
	getElem(CheckRow, CheckCol, Board, CheckPiece), 
	reverseColor(Piece, CheckPiece),  
	setPosElem(PieceRow, PieceCol, CheckPiece, Board, TempBoard),
	checkCenter(PieceRow, PieceCol, CheckPiece, TempBoard, Board1).
	
checkCaptureR2(_, _, _, _,_):-
	fail.


checkCaptureUL(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow - 1,
	CheckCol is PieceCol - 1, 
	getElem(CheckRow, CheckCol, Board, CheckPiece),
	reverseColor(Piece, CheckPiece), 
	checkCaptureUL2(CheckRow, CheckCol, CheckPiece, Board, Board1).

checkCaptureUL(_, _, _, Board, Board1):- 
	getElem(6,6, Board, GetPiece),
	setPosElem(6, 6, GetPiece, Board, Board1).
	

checkCaptureUL(_, _, _, _,_).

checkCaptureUL2(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow - 1,
	CheckCol is PieceCol - 1, 
	getElem(CheckRow, CheckCol, Board, CheckPiece), 
	reverseColor(Piece, CheckPiece),  
	setPosElem(PieceRow, PieceCol, CheckPiece, Board, TempBoard),
	checkCenter(PieceRow, PieceCol, CheckPiece, TempBoard, Board1).
	
checkCaptureUL2(_, _, _, _,_):-
	fail.


checkCaptureUR(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow - 1,
	CheckCol is PieceCol + 1, 
	getElem(CheckRow, CheckCol, Board, CheckPiece),
	reverseColor(Piece, CheckPiece), 
	checkCaptureUR2(CheckRow, CheckCol, CheckPiece, Board, Board1).

checkCaptureUR(_, _, _, Board, Board1):-
	getElem(6,6, Board, GetPiece),
	setPosElem(6, 6, GetPiece, Board, Board1).
	

checkCaptureUR(_, _, _, _,_).

checkCaptureUR2(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow - 1,
	CheckCol is PieceCol + 1, 
	getElem(CheckRow, CheckCol, Board, CheckPiece), 
	reverseColor(Piece, CheckPiece),  
	setPosElem(PieceRow, PieceCol, CheckPiece, Board, TempBoard),
	checkCenter(PieceRow, PieceCol, CheckPiece, TempBoard, Board1).
	
checkCaptureUR2(_, _, _, _,_):-
	fail.


checkCaptureDL(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow + 1,
	CheckCol is PieceCol - 1, 
	getElem(CheckRow, CheckCol, Board, CheckPiece),
	reverseColor(Piece, CheckPiece), 
	checkCaptureDL2(CheckRow, CheckCol, CheckPiece, Board, Board1).

checkCaptureDL(_, _, _, Board, Board1):- 
	getElem(6,6, Board, GetPiece),
	setPosElem(6, 6, GetPiece, Board, Board1).
	

checkCaptureDL(_, _, _, _,_).
checkCaptureDL2(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow + 1,
	CheckCol is PieceCol - 1, 
	getElem(CheckRow, CheckCol, Board, CheckPiece), 
	reverseColor(Piece, CheckPiece),  
	setPosElem(PieceRow, PieceCol, CheckPiece, Board, TempBoard),
	checkCenter(PieceRow, PieceCol, CheckPiece, TempBoard, Board1).
	
checkCaptureDL2(_, _, _, _,_):-
	fail.


checkCaptureDR(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow + 1,
	CheckCol is PieceCol + 1, 
	getElem(CheckRow, CheckCol, Board, CheckPiece),
	reverseColor(Piece, CheckPiece), 
	checkCaptureDR2(CheckRow, CheckCol, CheckPiece, Board, Board1).

checkCaptureDR(_, _, _, Board, Board1):- 
	getElem(6,6, Board, GetPiece),
	setPosElem(6, 6, GetPiece, Board, Board1).
	

checkCaptureDR(_, _, _, _,_).

checkCaptureDR2(PieceRow, PieceCol, Piece, Board, Board1):-
	CheckRow is PieceRow + 1,
	CheckCol is PieceCol + 1, 
	getElem(CheckRow, CheckCol, Board, CheckPiece), 
	reverseColor(Piece, CheckPiece),  
	setPosElem(PieceRow, PieceCol, CheckPiece, Board, TempBoard),
	checkCenter(PieceRow, PieceCol, CheckPiece, TempBoard, Board1).
	
checkCaptureDR2(_, _, _, _,_):-
	fail.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%% CHECK IF CENTER IS CAPTURED %%%%%%%%%


checkCenter(DestRow, DestCol, Piece, Board, Board1):-
	DeltaRow is 6 - DestRow,
	DeltaCol is 6 - DestCol,

	P1RowAux is 6 - abs(DeltaRow),
	P1ColAux is 6 - abs(DeltaCol),

	((P1RowAux =:= DestRow, P1ColAux =:= DestCol) -> P1Row is 6 - DeltaRow, P1Col is 6 - DeltaCol;
													P1Row is P1RowAux, P1Col is P1ColAux),
	
	getElem(P1Row, P1Col, Board, P1),
	write(P1Row), write(','), write(P1Col), write(': '), write(P1),nl,nl,
	P1 =:= Piece,

	P2Row is 6 + DeltaCol,
	P2Col is 6 - DeltaRow,

	getElem(P2Row, P2Col, Board, P2),
	write(P2Row), write(','), write(P2Col), write(': '), write(P2),nl,nl,
	P2 =:= Piece,


	P3Row is 6 - DeltaCol,
	P3Col is 6 + DeltaRow,

	getElem(P3Row, P3Col, Board, P3),
	write(P3Row), write(','), write(P3Col), write(': '), write(P3),nl,nl,
	P3 =:= Piece,

	getTower(Piece, Tower),

	setPosElem(6, 6, Tower, Board, Board1).

checkCenter(_,_,_,Board,Board1):-
	getElem(6,6, Board, GetPiece),
	setPosElem(6, 6, GetPiece, Board, Board1).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%% CHECK IF THE GAME ENDS %%%%%%%%%%

%goes through all the pieces and checks if there is any move in any direction 

checkEnd(Board, Row, Max, Max, Piece, Answer):-
	Row2 is Row + 1, 
	(Row2 < 13 -> Row2 =< Max, checkEnd(Board, Row2, 1, Max, Piece, Answer); 
	gameOver(Board, Answer)). %if the predicate goes through all the board is because there is no moves left, the game end


checkEnd(Board, Row, Col, Max, Piece, Answer):-
	RowPlus is Row + 1,
	RowMinus is Row - 1,
	ColPlus is Col + 1,
	ColMinus is Col - 1,

	getElem(Row, Col, Board, Elem),
	(Elem \= Piece -> checkEnd(Board, Row, ColPlus, Max, Piece, Answer);


	noMovement(Row, Col, RowPlus, Col, Board), 
	noMovement(Row, Col, RowMinus, Col, Board), 
	noMovement(Row, Col, Row, ColPlus, Board), 
	noMovement(Row, Col, Row, ColMinus, Board), 
	noMovement(Row, Col, RowPlus, ColPlus, Board), 
	noMovement(Row, Col, RowPlus, ColMinus, Board), 
	noMovement(Row, Col, RowMinus, ColPlus, Board), 
	noMovement(Row, Col, RowMinus, ColMinus, Board), 
	
	checkEnd(Board, Row, ColPlus, Max, Piece, Answer)).


checkEnd(_,_,_,_,_, Msg) :- Msg == win.
checkEnd(_,_,_,_,_,_) :- fail.


gameOver(_, Answer) :- Answer = win.