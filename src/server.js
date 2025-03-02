import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import cloudinary from "cloudinary";
import { Server } from "socket.io";
import connectDB from "./database/connection.js";
dotenv.config();

connectDB();
const app = express();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
let scan_result = {};

app.get("/", (req, res) => {
  return res.json(scan_result);
});

const httpServer = createServer(app);
// const userSockets = new Map();

const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  },
});

let reqPerMin = 0;
let reqPerHour = 0;
let reqPerRoutes = new Map();
let min = 0;

io.on("connection", (socket) => {
  socket.on("setup", (details) => {
    console.log(details);
  });

  socket.on("req_received", (reqDetails) => {
    let mainRoute = reqDetails.pathComponents[0];
    reqPerMin++;
    reqPerHour++;
    reqPerRoutes.set(mainRoute, (reqPerRoutes.get(mainRoute) || 0) + 1);
  });

  socket.on("scan_requested", () => {
    socket.emit("perform_scan");
  });

  socket.on("scan_results", (results) => {
    console.log("scan result received by frontend", results);
    console.log(
      "-------------------------Scan Ended---------------------------------"
    );
    scan_result = results;
    socket.emit("push_scan_results", results);
  });

  socket.on("scan_ports_requested", () => {
    socket.emit("scan_ports");
  });

  socket.on("scan_ports_results", (result) => {
    socket.emit("port_scan_results_received", result);
  });

  function triggerPerMinute() {
    socket.emit("req_per_minute", {
      minute: `00:${min < 10 ? "0" + min : min}`,
      requests: reqPerMin,
    });

    reqPerMin = 0;
    min = min % 60;

    setTimeout(triggerPerMinute, 60000);
  }

  function triggerPerHour() {
    socket.emit("req_per_hour", {
      hour: "1 AM",
      requests: reqPerHour,
    });

    reqPerHour = 0;

    setTimeout(triggerPerHour, 3600000);
  }

  setTimeout(triggerPerMinute, 60000);
  setTimeout(triggerPerHour, 3600000);
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
