const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);
io.on("connection", socket => {
    console.log("New client connected"), setInterval(
        () => getApiAndEmit(socket),
        10000
    );
    socket.on("disconnect", () => console.log("Client disconnected"));
});
const getApiAndEmit = async socket => {
    try {
        let bodyText = "grant_type=password&username=ikhsan&password=ikhsan95";
        const getToken = await axios({
            method: 'post',
            url: 'https://api.thinger.io/oauth/token',
            headers: {
                'Content-Type': 'application/json',
            },
            data: bodyText
        });
        let token = "Bearer " + getToken.data.access_token + "";
        const res = await axios({
            method: 'get',
            url: 'https://api.thinger.io/v2/users/ikhsan/devices/esp32/date',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '
            }
        });
        console.log(res.json());
        socket.emit("FromAPI", res);
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};
server.listen(port, () => console.log(`Listening on port ${port}`));
