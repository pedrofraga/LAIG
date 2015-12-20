clearScreen(0).

clearScreen(N):-
	nl,
	N1 is N-1,
	clearScreen(N1).

getChar(Answer):-
	get_char(Answer),
	get_char(_).

getInt(Answer):-
	get_code(TempA),
	Answer is TempA - 48.

cleanBuffer:-
	get_code(_).

pressEnterToContinue:-
	write('Press <Enter> to continue.'), nl,
	waitForEnter, !.

waitForEnter:-
	get_char(_).


%%% 1. element row; 2. element column; 3. matrix; 4. query element.
getElem(0, GetCol, [Head|_], Elem):-
	getElemAux(GetCol, Head, Elem).

getElem(GetRow, GetCol, [_|Tail], Elem):-
	GetRow > 0,
	GetRow1 is GetRow-1,
	getElem(GetRow1, GetCol, Tail, Elem).

%%% 1. element position; 2. list; 3. query element.
getElemAux(0, [ElemAtTheHead|_], ElemAtTheHead).
getElemAux(Pos, [_|RemainingElems], Elem):-
	Pos > 0,
	Pos1 is Pos-1,
	getElemAux(Pos1, RemainingElems, Elem).


%%% 1. element row; 2. element column; 3. element to use on replacement; 3. current matrix; 4. resultant matrix.
setPosElem(0, GetCol, NewElem, [RowHead|RemainingRows], [NewRowHead|RemainingRows]):-
	setPosElemAux(GetCol, NewElem, RowHead, NewRowHead).
setPosElem(GetRow, GetCol, NewElem, [RowHead|RemainingRows], [RowHead|ResultRemainingRows]):-
	GetRow > 0,
	GetRow1 is GetRow-1,
	setPosElem(GetRow1, GetCol, NewElem, RemainingRows, ResultRemainingRows).

%%% 1. position; 2. element to use on replacement; 3. current list; 4. resultant list.
setPosElemAux(0, Elem, [_|L], [Elem|L]).
setPosElemAux(I, Elem, [H|L], [H|ResL]):-
	I > 0,
	I1 is I-1,
	setPosElemAux(I1, Elem, L, ResL).





