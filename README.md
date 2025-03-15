# GuardFlow 🚀

An intelligent AI-driven system that monitors, analyzes, and protects your API traffic in real time—featuring a visual dashboard, advanced vulnerability scanning, proactive threat detection, and an AI chatbot for traffic summaries, scanning reports, and more.

<br>

## 1. Features

- **Real-time API Traffic Monitoring**: Gain deep insights into your API activity through an intuitive, user-friendly dashboard.

- **Comprehensive Dependency & Package Scanning**: Automatically analyze project dependencies and npm packages for vulnerabilities.
- **AI-Powered Insights & Recommendations**: Generate intelligent summaries, comparisons, and optimization strategies for your API traffic.
- **Proactive Threat & Vulnerability Detection** – Leverage AI to identify and mitigate security threats in real time.
- **Use Your Local/Any AI**, user can use gemini, openAI or their own offline AI model providing organization with options and security.

---

<br>

## 2. How We Ensure User Data Safety

Our system is designed for **maximum privacy and control**:

- **Self-Hosted Deployment** – Run the project **locally on your own servers** with full control over data flow.

- **Local Database & AI Processing** – All traffic analysis, vulnerability scans, and AI insights are **processed on your infrastructure**, ensuring **zero third-party access**.
- **No External Data Transfers** – Your API traffic, security logs, and AI interactions **stay within your environment**—nothing is sent outside your **servers, databases, or AI model**.

🔒 **Your data stays yours, always.**

---

<br>

## 3. Project Setup

Follow these steps to set up the project correctly.

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/aayushsingh7/GuardFlow.git
cd GuardFlow
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the project root and add the required variables.

```env
PORT = 4000

ORGANIZATION_ID = YOUR_ORGANIZATION_ID // (received after logging/register into the dashboard)

SECRET_KEY = YOUR_SECKET_KEY

DB_URL = YOUR_MONGODB_URL

NODE_ENV="development"

AI_PROVIDER = "gemini" // ("gemini", "openai", "custom")

AI_MODEL = AI_MODEL // ("gemini-2.0-flash", "local-ai", etc)

AI_API_KEY = YOUR_AI_API_KEY

```

### 4️⃣ (IMP) Setting Up Frontend & Getting ORGANIZATION_ID

#### 3.4.1. Navigate to dashboard folder & Install Dependencies

```sh
cd dashboard-template
npm install
```

#### 3.4.2. Start the development server

```sh
npm run dev
```

#### 3.4.3. Login/Register your organization

![](https://res.cloudinary.com/dvk80x6fi/image/upload/v1741943253/Screenshot_1148_snqlbo_24b7c0.png)

#### 3.4.4. Copy and Paste the `Organization ID` from your profile into the `.env` ORGANIZATION_ID.

![](https://res.cloudinary.com/dvk80x6fi/image/upload/v1741944444/profile_huwaoa.jpg)

---

## 3.1 Server Integration (Your Main Server)

To ensure seamless communication, install additional dependencies **on your main server**:

```sh
npm install socket.io-client snyk
```

### 4️⃣ Authenticate with Snyk

To enable security scanning, authenticate with **Snyk** (run below command in the terminal):

```sh
snyk auth
```

### 5️⃣ Add Required Code Snippets

To connect your server with the monitoring system, add the following code:

<details>
 <summary>Import Statements</summary>

```js
import { io } from "socket.io-client";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

</details>

 <!-- > For communicating realtime with the main server. -->

<details>
<summary>Socket.io client setup for realtime communication</summary>

```js
const socket = io("http://localhost:4000/");

socket.on("connect", () => {
  socket.emit("main_server_connected");
});

socket.on("perform_scan", async () => {
  let scanResults = await runSnykTest();
  socket.emit("scan_results", JSON.parse(scanResults.output));
});

// Middleware to track api requests
app.use((req, res, next) => {
  let pathComponents = req.url
    .slice(1)
    .split("/")
    .map((str) => {
      let isParams = str.indexOf("?");
      if (isParams == -1) {
        return str;
      } else {
        return str.slice(0, isParams);
      }
    });
  if (pathComponents[0] != "favicon.ico" && pathComponents[0] != "") {
    socket.emit("req_received", {
      pathComponents,
      route: req.url,
      method: req.method,
      time: Date.now(),
      requestIP: req.ip === "::1" ? "127.0.0.1" : req.ip,
    });
  }
  next();
});
```

</details>

<!-- > For scanning out any vulnerabilities in the user's project dependencies & npm packages (using synk) -->

<details>

<summary>Synk setup for project dependencies & npm packages scanning</summary>

```js
async function runSnykTest(directory = ".", options = {}) {
  const command = `snyk test ${directory} --json`;

  console.log(`Running Snyk test: ${command}`);

  try {
    const result = await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (stderr) {
          console.warn(`Snyk warnings: ${stderr}`);
        }

        let output = stdout;
        if (stdout) {
          try {
            const fullJson = JSON.parse(stdout);

            // Extract only essential information
            const filteredData = {
              vulnerabilitiesCount: fullJson.vulnerabilities?.length || 0,
              summary: fullJson.summary || {},
              packageName: fullJson.packageName || "",
              vulnerabilities:
                fullJson.vulnerabilities?.map((vuln) => ({
                  id: vuln.id,
                  title: vuln.title,
                  severity: vuln.severity,
                  packageName: vuln.packageName,
                  version: vuln.version,
                  fixedIn: vuln.fixedIn,
                })) || [],
            };

            output = JSON.stringify(filteredData, null, 2);
          } catch (parseError) {
            console.error(
              "Error parsing Snyk JSON output:",
              parseError.message
            );
          }
        }

        if (error) {
          resolve({
            success: true,
            vulnerabilities: true,
            output,
            exitCode: error.code,
          });
        } else {
          resolve({
            success: true,
            vulnerabilities: false,
            output,
          });
        }
      });
    });

    return result;
  } catch (error) {
    console.error("Failed to execute Snyk test:", error.message);
    throw new Error(`Snyk test failed: ${error.message}`);
  }
}
```

</details>

<!-- Ensure this snippet is added where your API requests are being processed. -->

<br>

## 3.2 Start Monitoring Your API (GuardFlow Server)

Once everything is set up, start the project with:

```sh
npm run start
```

<br>

## 3.3 Now start/refresh the dashboard (frontend application)

Please follow **Page Setup** point 4️⃣.

You’re now ready to **monitor, analyze, and secure your API traffic with AI-powered insights**! 🚀

---

<br>

## 4. API Endpoints

### 4.1. AI Services

<details>
<summary>Response Structure</summary>

````json
{
  "success": true,
  "message": "Summary fetched successfully",
  "data": "```md\n## 🚀 Traffic Insights\n- **Overall Pattern:** No traffic data provided.\n- **Anomalies Detected:** No traffic data provided.\n- **Hourly/Regional Trends:** No traffic data provided.\n\n## 🔍 Security Findings\n- **Total Vulnerabilities:** `20` vulnerabilities found.\n- **Critical Dependencies:**\n  - `axios@0.21.0`\n  - `body-parser@1.18.2`\n  - `lodash@4.17.20`\n  - `qs@6.5.1`\n  - `express@4.16.0`\n  - `cookie@0.3.1`\n  - `path-to-regexp@0.1.7`\n  - `send@0.16.0`\n  - `serve-static@1.13.0`\n- **Severity Breakdown:**\n  - High: Regular Expression Denial of Service (ReDoS), Cross-site Request Forgery (CSRF), Asymmetric Resource Consumption (Amplification), Code Injection, Prototype Poisoning\n  - Medium: Server-Side Request Forgery (SSRF), Cross-site Scripting (XSS), Open Redirect, Regular Expression Denial of Service (ReDoS)\n  - Low: Cross-site Scripting (XSS)\n- **Outdated Packages:**\n  - `axios@0.21.0` (fixed in >= 0.21.1)\n  - `body-parser@1.18.2` (fixed in >= 1.20.3)\n  - `cookie@0.3.1` (fixed in >= 0.7.0)\n  - `express@4.16.0` (fixed in >= 4.19.2)\n  - `lodash@4.17.20` (fixed in 4.17.21)\n  - `path-to-regexp@0.1.7` (fixed in >= 0.1.10)\n  - `qs@6.5.1` (fixed in >= 6.2.4, 6.3.3, 6.4.1, 6.5.3, 6.6.1, 6.7.3, 6.8.3, 6.9.7, 6.10.3)\n  - `send@0.16.0` (fixed in >= 0.19.0)\n  - `serve-static@1.13.0` (fixed in >= 1.16.0)\n\n## 🛠 Recommended Actions\n- Update dependencies to the specified fixed versions or later.\n```"
}
````

</details>

#### 4.1.1 **Get Traffic & Scan Summary**

> Provides a quick summary of traffic data and scans to check for anomalies and vulnerabilities.

```json
GET: "http://localhost:4000/api/v1/ai/traffic-summary?organizationID=${organizationID}&startTime=2025-03-05T00:00:00&endTime=2025-03-06T23:59:59"
```

#### 4.1.2 **Get Detailed Analysis of Traffic and Scan Results + AI Chat**

> Provides a detailed breakdown of traffic data, scan results, and an AI chatbot for better interactions and problem-solving.

```json
PUT: "http://localhost:4000/api/v1/ai/chat"
```

**Request Body:**

```json
{
  "userPrompt": "Give me detailed information about yesterday's users route",
  "organizationID": "your-organization-id"
}
```

<br>

### 4.2. API Traffic Service

#### 4.2.1 **Get Traffic Overview**

> Provides an overview of traffic data, including `hour`, `totalRequest`, and `breakdown`.

```json
GET: "http://localhost:4000/api/v1/traffic/overview?organizationID=organizationID&startTime=start_time&endTime=end_time"
```

<details>
<summary>Response Structure</summary>

```json
{
  "success": true,
  "message": "Traffic data fetched successfully",
  "data": [
    {
      "trafficOverview": [
        {
          "hour": 0,
          "totalRequests": 150,
          "breakdown": {
            "0": 122,
            "1": 232,
            ...
          }
        }
      ]
    }
  ]
}
```

</details>

#### 4.2.2 **Get Routes Traffic Overview**

> Provides the total number of requests received by each route in the given time period.

```json
GET: "http://localhost:4000/api/v1/traffic/routes-overview?organizationID=organizationID&startTime=start_time&endTime=end_time"
```

<details>
<summary>Response Output</summary>

```json
{
  "success": true,
  "message": "Routes traffic data fetched successfully",
  "data": [
    {
      "route": "products",
      "totalRequests": 50,
      "get": 35,
      "post": 8,
      "delete": 4,
      "put": 3
    },
    {
      "route": "checkout",
      "totalRequests": 45,
      "get": 30,
      "post": 10,
      ...
    }
  ]
}
```

</details>

#### 4.2.3 Get Route Detailed Traffic

> Provide a certain route's detailed data from duration startTime & endTime

```json
GET:"http://localhost:4000/api/v1/traffic/route?organizationID=organizationID&startTime=start_time&endTime=end_time&route=users"
```

  <details>
  <summary>Response Output</summary>

```json
{
  "success": true,
  "message": "Route traffic data fetched successfully",
  "data": [
    {
      "route": "users",
      "totalRequest": 80,
      "detailedData": [
        {
          "date": "2025-03-08",
          "totalRequest": 40,
          "get": 25,
          "post": 10,
          "delete": 3,
          "put": 2
        },
        {
          "date": "2025-03-08",
          "totalRequest": 40,
          "get": 10,
          "post": 3,
          "delete": 25,
          "put": 2
        }
        ...
      ]
    }
  ],
  "startTime": "2025-03-08T00:00:00"
}
```

  </details>

<br>

### 4.3. Scan Report Services

#### 4.3.1 Get Latest Scan Report

> Get latest scan report starting from startTime to endTime

```json
GET:"http://localhost:4000/api/v1/reports/latest-report?organizationID=ORGANIZATION_ID&startTime=START_TIME&endTime=END_TIME"
```

<details>
<summary>Response Structure</summary>

```js
{
    "success": true,
    "message": "Report fetched successfully",
    "startTime": "2025-03-05T00:00:00",
    "endTime": "2025-03-13T23:59:59",
    "data": {
        "_id": "67c9a1c885941bd9ee5c1bda",
        "vulnerabilitiesCount": 20,
        "summary": "20 vulnerable dependency paths",
        "packageName": "",
        "vulnerabilities": [
            {
                "id": "SNYK-JS-AXIOS-1038255",
                "title": "Server-Side Request Forgery (SSRF)",
                "severity": "medium",
                "packageName": "axios",
                "version": "0.21.0",
                "fixedIn": [
                    "0.21.1"
                ],
                "_id": "67c9a1c885941bd9ee5c1bdb"
            },
            {
                "id": "SNYK-JS-QS-3153490",
                "title": "Prototype Poisoning",
                "severity": "high",
                "packageName": "qs",
                "version": "6.5.1",
                "fixedIn": [
                    "6.2.4",
                    "6.3.3",
                    "6.4.1",
                    "6.5.3",
                    "6.6.1",
                    "6.7.3",
                    "6.8.3",
                    "6.9.7",
                    "6.10.3"
                ],
                "_id": "67c9a1c885941bd9ee5c1beb"
            },
            ...
        ],
        "createdAt": "2025-03-06T13:23:20.458Z",
        "updatedAt": "2025-03-06T13:23:20.458Z",
        "__v": 0,
        "organization": "67c8709bc4fc2c40a1b53be2"
    }
}
```

</details>

#### 4.3.2 Get Scan Reports

> Get all the scan reports between startTime & endTime

```json
GET:"http://localhost:4000/api/v1/reports?organizationID=ORGANIZATION_ID&startTime=START_TIME&endTime=END_TIME"
```

<details>
<summary>Response Structure</summary>

```json
{
  "success": true,
  "message": "Reports fetched successfully",
  "startTime": "2025-03-05T00:00:00",
  "endTime": "2025-03-13T23:59:59",
  "data": [
    {
      "_id": "67d29ca91f44af8ca807d501",
      "organization": "67c8709bc4fc2c40a1b53be2",
      "vulnerabilitiesCount": 21,
      "summary": "21 vulnerable dependency paths",
      "packageName": "",
      "vulnerabilities": [
        {
          "id": "SNYK-JS-AXIOS-1038255",
          "title": "Server-Side Request Forgery (SSRF)",
          "severity": "medium",
          "packageName": "axios",
          "version": "0.21.0",
          "fixedIn": ["0.21.1"],
          "_id": "67d29ca91f44af8ca807d502"
        },
        {
          "id": "SNYK-JS-AXIOS-1579269",
          "title": "Regular Expression Denial of Service (ReDoS)",
          "severity": "high",
          "packageName": "axios",
          "version": "0.21.0",
          "fixedIn": ["0.21.3"],
          "_id": "67d29ca91f44af8ca807d503"
        },
        ... // remaining vulnerabilities
      ],
      "createdAt": "2025-03-13T08:51:53.089Z",
      "updatedAt": "2025-03-13T08:51:53.089Z",
      "__v": 0
    },
    {
      "_id": "67d1544fb523e1328a760497",
      "organization": "67c8709bc4fc2c40a1b53be2",
      "vulnerabilitiesCount": 21,
      "summary": "21 vulnerable dependency paths",
      "packageName": "",
      "vulnerabilities": [
        {
          "id": "SNYK-JS-AXIOS-1038255",
          "title": "Server-Side Request Forgery (SSRF)",
          "severity": "medium",
          "packageName": "axios",
          "version": "0.21.0",
          "fixedIn": ["0.21.1"],
          "_id": "67d1544fb523e1328a760498"
        },
        ... // remaining vulnerabilities
      ],
      "createdAt": "2025-03-12T09:30:55.703Z",
      "updatedAt": "2025-03-12T09:30:55.703Z",
      "__v": 0
    },
    ... // remaining data
  ]
}
```

</details>

<br>

## 5. Contributing

Contributions are welcome! Feel free to submit pull requests or open issues 🙌.
