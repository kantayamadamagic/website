import { Chessboard, FEN, INPUT_EVENT_TYPE } from "https://cdn.jsdelivr.net/npm/cm-chessboard@8.12.12/src/Chessboard.js";
import { Markers, MARKER_TYPE } from "https://cdn.jsdelivr.net/npm/cm-chessboard@8.12.12/src/extensions/markers/Markers.js";
import { Chess } from "https://cdn.jsdelivr.net/npm/chess.js@1.4.0/dist/esm/chess.js";

const chess = new Chess();
const board =new Chessboard(document .getElementById("board"), {
    position: FEN.start,
    assetsUrl: "https://cdn.jsdelivr.net/npm/cm-chessboard@8.12.12/assets/",
    extensions: [{class: Markers}],
});

board.enableMoveInput(inputHandler); // This enables the move input
let pendingMove = null;

function inputHandler(event) {
    if(event.type === INPUT_EVENT_TYPE.moveInputStarted) {
        if (chess.turn() === "w") {
            console.log(chess.moves({square: event.squareFrom, verbose: true}));
            for (const tront of chess.moves({square: event.squareFrom, verbose: true})) {
                if (tront.captured !== undefined) {
                    board.addMarker(MARKER_TYPE.bevel, tront.to);
                } else {
                    board.addMarker(MARKER_TYPE.dot, tront.to);
                }
            }
            return event.piece.startsWith("w");
        } else {
            console.log(chess.moves({square: event.squareFrom, verbose: true}));
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
            pendingMove = {from: event.squareFrom, to: event.squareTo};
            chess.move(pendingMove);
            console.log("合法な手です。");
            return true;
        } catch (error) {
            console.log("不正な手です。");
            return false;
        }
    }
    if(event.type === INPUT_EVENT_TYPE.moveInputFinished) {
        board.removeMarkers();
        board.addMarker(MARKER_TYPE.square, pendingMove.from, {color: "rgba(255, 255, 0, 0.5)"});
        board.addMarker(MARKER_TYPE.square, pendingMove.to, {color: "rgba(255, 255, 0, 0.5)"});
    }
}
