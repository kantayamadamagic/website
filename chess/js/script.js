import { Chessboard, FEN, INPUT_EVENT_TYPE, COLOR } from "https://cdn.jsdelivr.net/npm/cm-chessboard@8.12.12/src/Chessboard.js";
import { Markers, MARKER_TYPE } from "https://cdn.jsdelivr.net/npm/cm-chessboard@8.12.12/src/extensions/markers/Markers.js";
import { Chess } from "https://cdn.jsdelivr.net/npm/chess.js@1.4.0/dist/esm/chess.js";

const chess = new Chess();
const board =new Chessboard(document .getElementById("board"), {
    position: FEN.start,
    assetsUrl: "https://cdn.jsdelivr.net/npm/cm-chessboard@8.12.12/assets/",
    extensions: [{class: Markers}],
});
const LAST_MOVE = {class: "marker-last-move", slice: "markerSquare"};
const status = document.getElementById("status");
const newGameButton = document.getElementById("new-game");
const tbody = document.getElementById("history-body");
const modal = document.getElementById("new-game-modal");
const startButton = document.getElementById("start-game");
tbody.innerHTML = "";
const pieceInfo = {
    p: { 
        symbol: {
            w: "♙", 
            b: "♟"
        },
        value: 1,
        order: 1 
    },
    n: { 
        symbol: {
            w: "♘", 
            b: "♞"
        },
        value: 3,
        order: 2 
    },
    b: { 
        symbol: {
            w: "♗", 
            b: "♝"
        },
        value: 3,
        order: 3 
    },
    r: { 
        symbol: {
            w: "♖", 
            b: "♜"
        },
        value: 5,
        order: 4 
    },
    q: { 
        symbol: {
            w: "♕", 
            b: "♛"
        },
        value: 9,
        order: 5 
    },
};
let humanColor = ""
let computerColor = "";
let difficulty = 0;
let capturedByWhite = [];
let capturedByBlack = [];

board.enableMoveInput(inputHandler); // This enables the move input

function makeMove(move){ //駒を動かすことに関連する動作全般
    const result = chess.move(move); //合法手判定+駒移動
    if(result.captured){ //キャプチャーの更新
        if(result.color === "w"){
            capturedByWhite.push(result.captured);
        } else {
            capturedByBlack.push(result.captured);
        }
        updateCaptured();
    }
    // UI更新
    board.setPosition(chess.fen());
    board.removeMarkers(LAST_MOVE);
    board.addMarker(LAST_MOVE, move.from);
    board.addMarker(LAST_MOVE, move.to);
    updateStatus();
    updateHistory();
    board.removeMarkers(MARKER_TYPE.dot);
    board.removeMarkers(MARKER_TYPE.bevel);

    if(chess.isGameOver()){ //ゲームオーバー判定
        gameOver();
        return;
    }
    if(chess.turn() === computerColor){ //次の番がコンピュータなら実行
        setTimeout(() => {
            computerMove();
        }, 300);
    }
}
function updateStatus(){ // Status欄更新
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
function updateHistory(){ //棋譜更新
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
function gameOver(){ //ゲームオーバー判定
    if(chess.isCheckmate()){
        if(chess.turn() === "w"){
            status.innerHTML = `<strong>Checkmate!</strong><br>Black wins.`;
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
function newGame(){ //New Game押したときの動作
    chess.reset();
    board.setPosition(chess.fen());
    board.removeMarkers();
    tbody.innerHTML = "";
    status.textContent = "White to move";
    try{
        board.enableMoveInput(inputHandler);
    } catch {}
}
async function computerMove(){ //コンピュータの手の動き
    try{
        let apiRate;
        switch (difficulty) {
            case 1:
                apiRate = 0.6;
                break;
            case 4:
                apiRate = 0.9;
                break;
            default:
                apiRate = 1.0;
        }
        if (Math.random() > apiRate) { //ランダムな一手
            const legalMoves = chess.moves({ verbose: true });
            const move = legalMoves[Math.floor(Math.random() * legalMoves.length)];
            makeMove({from: move.from, to: move.to, promotion: move.promotion});
            return;
        }
        const response = await fetch("https://chess-api.com/v1",{ //CessAPIから送られてくる一手
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fen: chess.fen(),
                depth: difficulty,
                variants: 5
            })
        });
        const data = await response.json();
        makeMove({from: data.from, to:data.to, promotion: data.promotion});
    } catch (error){
        console.error(error);
    }
}
function updateCaptured() { //キャプチャーの更新
    // ソート
    capturedByWhite.sort((a, b) => pieceInfo[a].order - pieceInfo[b].order);
    capturedByBlack.sort((a, b) => pieceInfo[a].order - pieceInfo[b].order);
    // 合計点
    const whiteScore = capturedByWhite.reduce((sum, piece) => sum + pieceInfo[piece].value, 0);
    const blackScore = capturedByBlack.reduce((sum, piece) => sum + pieceInfo[piece].value, 0);
    // 駒得（白基準）
    const scoreDiff = whiteScore - blackScore;
    let topPieces, bottomPieces;
    let topScore = "";
    let bottomScore = "";
    if (humanColor === "w") {
        // 上：黒が取った白駒
        topPieces = capturedByBlack
            .map(piece => pieceInfo[piece].symbol.w)
            .join(" ");
        // 下：白が取った黒駒
        bottomPieces = capturedByWhite
            .map(piece => pieceInfo[piece].symbol.b)
            .join(" ");
        if (scoreDiff > 0) {
            bottomScore = `+${scoreDiff}`;
        } else if (scoreDiff < 0) {
            topScore = `+${-scoreDiff}`;
        }
    } else {
        // 上：白が取った黒駒
        topPieces = capturedByWhite
            .map(piece => pieceInfo[piece].symbol.b)
            .join(" ");
        // 下：黒が取った白駒
        bottomPieces = capturedByBlack
            .map(piece => pieceInfo[piece].symbol.w)
            .join(" ");
        if (scoreDiff > 0) {
            topScore = `+${scoreDiff}`;
        } else if (scoreDiff < 0) {
            bottomScore = `+${-scoreDiff}`;
        }
    }
    document.getElementById("captured-top-pieces").textContent = topPieces;
    document.getElementById("captured-bottom-pieces").textContent = bottomPieces;
    document.getElementById("captured-top-score").textContent = topScore;
    document.getElementById("captured-bottom-score").textContent = bottomScore;
}
startButton.addEventListener("click", () => { //ダイアログのStart Gameを押したとき
    modal.style.display = "none";
    humanColor = document.querySelector('input[name="color"]:checked').value;
    if(humanColor === "random"){
        humanColor = Math.random() < 0.5 ? "w" : "b";
    }
    computerColor = humanColor === "w" ? "b" : "w";
    difficulty = Number(document.querySelector('input[name="difficulty"]:checked').value);
    if (humanColor === "w") {
        board.setOrientation(COLOR.white);
    } else {
        board.setOrientation(COLOR.black);
    }
    newGame();
    if(computerColor === "w"){
        computerMove();
    }
});
newGameButton.addEventListener("click", () => { //New Gameを押したとき
    modal.style.display = "flex";
    capturedByWhite = [];
    capturedByBlack = [];
    updateCaptured();
});

function inputHandler(event) { //盤面に触ったとき
    if(event.type === INPUT_EVENT_TYPE.moveInputStarted) { //駒を持ったとき
        if(chess.turn() === computerColor){
            return false;
        }
        if (chess.turn() === "w") {
            for (const tront of chess.moves({square: event.squareFrom, verbose: true})) { //動かせるマスにマーカー
                if (tront.captured !== undefined) {
                    board.addMarker(MARKER_TYPE.bevel, tront.to);
                } else {
                    board.addMarker(MARKER_TYPE.dot, tront.to);
                }
            }
            return event.piece.startsWith("w");
        } else {
            status.textContent ="Black to move";
            for (const tront of chess.moves({square: event.squareFrom, verbose: true})) { //動かせるマスにマーカー
                if (tront.captured !== undefined) {
                    board.addMarker(MARKER_TYPE.bevel, tront.to);
                } else {
                    board.addMarker(MARKER_TYPE.dot, tront.to);
                }
            }
            return event.piece.startsWith("b");
        }
    }
    if(event.type === INPUT_EVENT_TYPE.validateMoveInput) { //持った駒を置いた瞬間
        try {
            chess.move({from: event.squareFrom, to: event.squareTo, promotion: "q"}); //合法手判定
            chess.undo();
            return true;
        } catch (error) {
            return false;
        }
    }
    if(event.type === INPUT_EVENT_TYPE.moveInputFinished) { //持った駒を置いた後
        if(!event.legalMove){
            board.removeMarkers(MARKER_TYPE.dot);
            board.removeMarkers(MARKER_TYPE.bevel);
            return;
        }
        makeMove({from: event.squareFrom, to: event.squareTo, promotion: "q"});
    }
    if(event.type === INPUT_EVENT_TYPE.moveInputCanceled) { //駒の移動をやめたとき
        board.removeMarkers(MARKER_TYPE.dot);
        board.removeMarkers(MARKER_TYPE.bevel);
    }
}
