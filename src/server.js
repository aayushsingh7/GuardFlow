import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import cloudinary from "cloudinary";
import { Server } from "socket.io";
import connectDB from "./database/connection.js";
import apiRoutes from "./routes/apiTraffic.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import ReportService from "./services/report.service.js";
import reportRoutes from "./routes/report.routes.js";
import ApiTrafficService from "./services/apiTraffic.service.js";
import orgRoutes from "./routes/organization.routes.js";
dotenv.config();

connectDB();
const app = express();
const reportService = new ReportService();
const apiTrafficService = new ApiTrafficService();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use("/api/v1/traffic", apiRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/orgs", orgRoutes);
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

function getCurrentHour() {
  return new Date().getHours() % 24;
}

function getCurrentMinute() {
  return new Date().getMinutes() % 60;
}

console.log(getCurrentMinute());

let reqPerMin = {};
let reqPerMinCount = 0;
let reqPerRoutes = new Map();
let routesReqPerMin = new Map();
let curMinute = getCurrentMinute();
let curHour = getCurrentHour();
let interval = false;

io.on("connection", (socket) => {
  socket.emit("auth", process.env.ORGANIZATION_ID);
  // socket.on("setup", (details) => {
  //   // console.log(details);
  //   authDetails = details;
  //   console.log(authDetails);
  // });
  // monitor api request
  // socket.on("req_received", (reqDetails) => {
  //   let mainRoute = reqDetails.pathComponents[0];
  //   let method = reqDetails.method;
  //   reqPerMinCount++;
  //   // reqPerRoutes.set(mainRoute, (reqPerRoutes.get(mainRoute) || 0) + 1);
  //  if(method == "GET") {
  //   reqPerRoutes.set(mainRoute, {
  //     totalRequest:(reqPerRoutes.get(mainRoute).totalRequest || 0 ) + 1,
  //  })
  //  }else if(method:"")
  //   console.log(`New request recieve on ${curMinute}: ${reqPerMinCount}`);
  // });

  socket.on("req_received", (reqDetails) => {
    let mainRoute = reqDetails.pathComponents[0] || "/";
    let method = reqDetails.method;
    reqPerMinCount++;

    // Ensure the route exists in the Map before updating
    if (!reqPerRoutes.has(mainRoute)) {
      reqPerRoutes.set(mainRoute, {
        totalRequest: 0,
        GET: 0,
        POST: 0,
        DELETE: 0,
        PUT: 0,
      });
    }

    if (!routesReqPerMin.has(mainRoute)) {
      routesReqPerMin.set(mainRoute, {
        totalRequest: 0,
        GET: 0,
        POST: 0,
        DELETE: 0,
        PUT: 0,
      });
    }

    // Get the existing data for the route
    let routeData = reqPerRoutes.get(mainRoute);
    let routeDataPerMin = routesReqPerMin.get(mainRoute);

    // Update total request count and specific method count
    routeData.totalRequest += 1;
    routeDataPerMin.totalRequest += 1;

    if (method in routeData) {
      routeData[method] += 1;
    }

    if (method in routeDataPerMin) {
      routeDataPerMin[method] += 1;
    }

    // Save updated data back to the Map
    reqPerRoutes.set(mainRoute, routeData);
    console.log(routeDataPerMin);
    routesReqPerMin.set(mainRoute, routeDataPerMin);

    // console.log(
    //   `New request received on ${curMinute}: ${reqPerMinCount}`,
    //   reqPerRoutes
    // );
    // console.log("This is Object.fromEntries", Object.fromEntries(reqPerRoutes));
  });

  // request packages & dependencies scan
  socket.on("scan_requested", () => {
    socket.emit("perform_scan");
  });

  // scan results
  socket.on("scan_results", async (results) => {
    scan_result = results;
    socket.emit("push_scan_results", results);
    let data = {
      organization: process.env.ORGANIZATION_ID,
      ...results,
    };
    // console.log(data);
    await reportService.saveScanReport(data);
  });

  // request open & closed port scanning
  socket.on("scan_ports_requested", () => {
    socket.emit("scan_ports");
  });
  // open & closed scan port results
  socket.on("scan_ports_results", (result) => {
    socket.emit("port_scan_results_received", result);
  });
});

function triggerPerMinute(socket) {
  console.log("function triggger of minite ", curMinute);
  socket.emit("req_per_minute", {
    time: `${curHour < 10 ? `0${curHour}` : curHour}:${
      curMinute < 10 ? "0" + curMinute : curMinute
    }`,
    requests: reqPerMinCount || 10,
    minute: curMinute,
    hour: curHour,
    routesTraffic: Object.fromEntries(routesReqPerMin),
  });

  reqPerMin[curMinute++] = reqPerMinCount;
  reqPerMinCount = 0;
  if (curMinute > 59) {
    // empty the reqPerMin object & curMinute to 0 (start of new hour)
    triggerPerHour(socket);
  }

  routesReqPerMin = new Map();
  // setTimeout(triggerPerMinute, 60000);
}

function formatHour(hour) {
  const period = hour < 12 ? "AM" : "PM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour} ${period}`;
}

async function triggerPerHour(socket) {
  let totalRequestPerHour = Object.values(reqPerMin).reduce(
    (sum, cur) => sum + cur,
    0
  );
  const trafficSummary = {
    organization: process.env.ORGANIZATION_ID,
    hour: curHour,
    totalRequests: totalRequestPerHour,
    breakdown: reqPerMin,
    trafficPerRoutes: Object.fromEntries(reqPerRoutes),
  };

  console.log(trafficSummary, reqPerRoutes);
  socket.emit("req_per_hour", {
    hour: formatHour(curHour),
    requests: totalRequestPerHour,
  });

  reqPerMin = {};
  reqPerRoutes = new Map();
  curMinute = curMinute % 60;
  curHour = (curHour + 1) % 24;
  await apiTrafficService.addTraffic(trafficSummary);
}

let intervalStarted = false;
if (!intervalStarted) {
  intervalStarted = true;
  setInterval(() => {
    triggerPerMinute(io);
  }, 60000);
}

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
