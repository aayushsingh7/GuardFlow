import AIService from "../services/ai.service.js";
import parseUserPrompt from "../utils/parseUserPrompt.js";
import ApiTrafficService from "../services/apiTraffic.service.js";
import ReportService from "../services/report.service.js";

class AIController {
  constructor() {
    this.aiService = new AIService();
    this.trafficService = new ApiTrafficService();
    this.reportService = new ReportService();
    this.getSummary = this.getSummary.bind(this);
    this.aiChat = this.aiChat.bind(this);
  }
  async getSummary(req, res) {
    try {
      const response = await this.aiService.getSummary(req.query);
      res.status(200).send({
        success: true,
        message: "Summary fetched successfully",
        data: response,
      });
    } catch (err) {
      res
        .status(500)
        .send({ success: false, message: "Internal Server Error" });
    }
  }
  async aiChat(req, res) {
    const { userPrompt, organizationID, hour, route } = req.body;
    try {
      // extract important keywords from user prompt;
      const parsedPrompt = await parseUserPrompt(`
user prompt: ${userPrompt}
today's date: ${new Date().toISOString().split("T")[0]}

`);
      // temperory for testing purposes
      // fetch the nesscary data required for the operation;
      if (
        this.trafficService[parsedPrompt.function] ||
        this.reportService[parsedPrompt.function]
      ) {
        let response;

        if (this.trafficService[parsedPrompt.function]) {
          response = await this.trafficService[parsedPrompt.function]({
            startTime: parsedPrompt.start_time,
            endTime: parsedPrompt.end_time,
            organizationID,
            hour: parsedPrompt.hour,
            route: parsedPrompt.route,
          });
        } else if (this.reportService[parsedPrompt.function]) {
          response = await this.reportService[parsedPrompt.function]({
            startTime: parsedPrompt.start_time,
            endTime: parsedPrompt.end_time,
            organizationID,
            hour,
          });
        }

        // generate a prompt
        const prompt = `
        ${userPrompt}
        
        startTime:${parsedPrompt.start_time}
        endTime:${parsedPrompt.end_time}
        
        Data:
        ${JSON.stringify(response)}

        ### breakdown feild in the data represent the request received in the i'th minute of i'th hour, if applicable use it.
        `;

        const aiResponse = await this.aiService.chatWithAI(prompt);
        res.status(200).send({
          success: true,
          message: "Data fetched successfully",
          data: aiResponse,
        });
      } else {
        res
          .status(400)
          .send({ success: false, message: "Bad Request, please try again" });
      }
    } catch (err) {

      res
        .status(500)
        .send({ success: false, message: "Internal Server Error" });
    }
  }
}

export default AIController;
