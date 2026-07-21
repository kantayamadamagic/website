import { Chessboard, FEN, INPUT_EVENT_TYPE } from "https://cdn.jsdelivr.net/npm/cm-chessboard@8.12.12/src/Chessboard.js";
import { Markers, MARKER_TYPE } from "https://cdn.jsdelivr.net/npm/cm-chessboard@8.12.12/src/extensions/markers/Markers.js";
import { Chess } from "https://cdn.jsdelivr.net/npm/chess.js@1.4.0/dist/esm/chess.js";

const chess = new Chess();
const board =new Chessboard(document .getElementById("board"), {
    position: FEN.start,
    assetsUrl: "https://cdn.jsdelivr.net/npm/cm-chessboard@8.12.12/assets/",
    extensions: [{class: Markers}],
});
const status = document.getElementById("status");
const newGameButton = document.getElementById("new-game");
const tbody = document.getElementById("history-body");
tbody.innerHTML = "";
const whitePieceMap = {
    p:"♙",
    n:"♘",
    b:"♗",
    r:"♖",
    q:"♕"
}
const blackPieceMap = {
    p:"♟",
    n:"♞",
    b:"♝",
    r:"♜",
    q:"♛"
}
board.enableMoveInput(inputHandler); // This enables the move input

function makeMove(move){
    chess.move(move);
    board.setPosition(chess.fen());
    updateStatus();
    updateHistory();
    board.removeMarkers();
    if(chess.isGameOver()){
        gameOver();
        return;
    }
    if(chess.turn() === "b"){
        setTimeout(() => {
            computerMove();
        }, 300);
    }
}
function updateStatus(){
    if(chess.turn() === "w"){
        status.textContent = "White to move";
        if(chess.isCheck()){
            status.innerHTML = "White to move<br><strong>Check!</strong>"
        }
    } else {
        status.textContent = "Black to move";
        if(chess.isCheck()){
            status.innerHTML = "Black to move<br><strong>Check!</strong>"
        }
    }
}
function updateHistory(){
    const history = chess.history({ verbose: true });
    tbody.innerHTML = "";
    for (let i = 0; i < history.length; i += 2) {
        const moveNumber = i / 2 + 1;
        const white = history[i]?.san ?? "";
        const black = history[i + 1]?.san ?? "";
        const row = document.createElement("tr");
        row.innerHTML = `<td>${moveNumber}</td><td>${white}</td><td>${black}</td>`;
        tbody.appendChild(row);
    }
}
function gameOver(){
    if(chess.isCheckmate()){
        if(chess.turn() === "w"){
            status.innerHTML = `<strong>Checkmate!</strong><br>White wins.`;
        } else {
            status.innerHTML = `<strong>Checkmate!</strong><br>White wins.`;
        }
    } else if (chess.isStalemate()){
        status.textContent ="Draw by stalemate";
    } else if (chess.isThreefoldRepetition()){
        status.textContent ="Draw by threefold repetition";
    } else if (chess.isInsufficientMaterial()){
        status.textContent ="Draw by insufficient material";
    } else if (chess.isDraw()) {
        status.textContent ="Draw";
    }
    board.disableMoveInput();
}
function newGame(){
    chess.reset();
    board.setPosition(chess.fen());
    board.removeMarkers();
    tbody.innerHTML = "";
    status.textContent = "White to move";
    try{
        board.enableMoveInput(inputHandler);
    } catch {}
}
function computerMove(){
    const moves = chess.moves({verbose: true});
    const move = moves[Math.random()*moves.length];
    makeMove(move);
}

newGameButton.addEventListener("click", newGame);

function inputHandler(event) {
    if(event.type === INPUT_EVENT_TYPE.moveInputStarted) {
        if (chess.turn() === "w") {
            for (const tront of chess.moves({square: event.squareFrom, verbose: true})) {
                if (tront.captured !== undefined) {
                    board.addMarker(MARKER_TYPE.bevel, tront.to);
                } else {
                    board.addMarker(MARKER_TYPE.dot, tront.to);
                }
            }
            return event.piece.startsWith("w");
        } else {
            status.textContent ="Black to move";
            for (const tront of chess.moves({square: event.squareFrom, verbose: true})) {
                if (tront.captured !== undefined) {
                    board.addMarker(MARKER_TYPE.bevel, tront.to);
                } else {
                    board.addMarker(MARKER_TYPE.dot, tront.to);
                }
            }
            return event.piece.startsWith("b");
        }
    }
    if(event.type === INPUT_EVENT_TYPE.validateMoveInput) {
        try {
            chess.move({from: event.squareFrom, to: event.squareTo, promotion: "q"});
            chess.undo();
            return true;
        } catch (error) {
            return false;
        }
    }
    if(event.type === INPUT_EVENT_TYPE.moveInputFinished) {
        if(!event.legalMove){
            board.removeMarkers();
            return;
        }
        makeMove({from: event.squareFrom, to: event.squareTo, promotion: "q"});
    }
    if(event.type === INPUT_EVENT_TYPE.moveInputCanceled) {
        board.removeMarkers();
    }
}
