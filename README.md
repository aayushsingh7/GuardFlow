## 🔱Project Setup

### 1. Add the following code in sequence in your server's file.

```js
const socket = io("http://localhost:4000/");

socket.on("connect", () => {
  socket.emit("setup", {
    credentials: {
      username: process.env.ORGANIZATION_USERNAME,
      accessKey: process.env.ORGANIZATION_ACCESS_KEY,
    },
    routes: ["users", "documents", "stories", "tickets"],
    averageTraffic: 3400,
    generalLogFile: fs.readFileSync(filePath, "utf-8"),
    uploadDataToCloud: true,
  });
});

socket.on("perform_scan", async () => {
  let scanResults = await runSnykTest();
  clearInterval(interval);
  socket.emit("scan_results", scanResults);
});
```

> For Performing Vulnerability Scan on Project Dependencies & Open Source Packages using **Snyk**
```js
async function runSnykTest(directory = ".", options = {}) {
  //   // Build command with options
  //   const jsonOutput = options.json ? "--json" : "";
  //   const severityLevel = options.severity
  //     ? `--severity-threshold=${options.severity}`
  //     : "";
  //   const additionalArgs = options.args || "";

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
