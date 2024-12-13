const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { SerialPort, ReadlineParser } = require("serialport");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Arduinoのシリアルポート設定
const port = new SerialPort({
	path: "/dev/tty.usbmodem1301", // 適切なポート名に変更
	baudRate: 115200, // ボーレート
});

// 処理を改行で分割する
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

app.use(express.static("public")); // 静的ファイルを配信

// シリアルポートからデータを受信してブラウザに送信
parser.on("data", (data) => {
	console.log("Data:", data);

	const coords = data.toString().trim();

	// データをブラウザに送信
	io.emit("joystickData", coords);
});

// サーバー起動
server.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});
