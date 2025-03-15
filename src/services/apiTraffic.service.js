import ApiTraffic from "../models/apiTraffic.model.js";
import mongoose from "mongoose";

// YYYY-MM-DD
class ApiTrafficService {
  async addTraffic(trafficData) {
    try {
      const insertData = new ApiTraffic(trafficData);
      await insertData.save();
      return insertData;
    } catch (err) {
      throw err;
    }
  }
 
  async getTrafficOverview(query) {
    try {
      const { organizationID, startTime, endTime } = query;

      // Convert startTime and endTime to Date objects if they are strings
      const start = new Date(startTime);
      const end = new Date(endTime);
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      // Pipeline to aggregate traffic data by date and hour
      const pipeline = [
        // Match documents within the time range and for the specified organization
        {
          $match: {
            organization: new mongoose.Types.ObjectId(organizationID),
            createdAt: { $gte: start, $lte: end },
          },
        },
        // Add a date field (without time) for grouping
        {
          $addFields: {
            dateOnly: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
          },
        },
        // Group by date and hour
        {
          $group: {
            _id: {
              date: "$dateOnly",
              hour: "$hour",
            },
            totalRequests: { $sum: "$totalRequests" },
            breakdown: { $first: "$breakdown" },
          },
        },
        // Group again to structure data by date with an array of hourly data
        {
          $group: {
            _id: "$_id.date",
            trafficOverview: {
              $push: {
                hour: "$_id.hour",
                totalRequests: "$totalRequests",
                breakdown: "$breakdown",
              },
            },
          },
        },
        // Sort the trafficOverview array by hour
        {
          $addFields: {
            trafficOverview: {
              $sortArray: {
                input: "$trafficOverview",
                sortBy: { hour: 1 },
              },
            },
          },
        },
        // Format the final output
        {
          $project: {
            _id: 0,
            date: "$_id",
            trafficOverview: 1,
          },
        },
        // Sort by date
        {
          $sort: { date: 1 },
        },
      ];

      // Execute the aggregation pipeline
      const result = await ApiTraffic.aggregate(pipeline);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async getHourTraffic(query) {
    const { startTime, endTime, organizationID, hour } = query;
    const start = new Date(startTime);
    const end = new Date(endTime);
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);
    try {
      let data = await ApiTraffic.findOne({
        organization: organizationID,
        hour: hour,
        createdAt: { $gte: start, $lte: end },
      }).select("oranization hour breakdown createdAt totalRequests");
      return data;
    } catch (err) {
      throw err;
    }
    // fetches all routes traffic
  }
  async getRouteTraffic(query) {
    const { organizationID, startTime, endTime, route } = query;

    try {
      // Convert startTime and endTime to Date objects if they are strings
      const start = new Date(startTime);
      const end = new Date(endTime);
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      // Pipeline to aggregate traffic data for the main route and all sub-routes
      const pipeline = [
        // Match documents within the time range and for the specified organization
        {
          $match: {
            organization: new mongoose.Types.ObjectId(organizationID),
            createdAt: { $gte: start, $lte: end },
          },
        },
        // Project and convert trafficPerRoutes to an array of key-value pairs
        {
          $project: {
            createdAt: 1,
            routeEntries: { $objectToArray: "$trafficPerRoutes" },
          },
        },
        // Unwind the array to create a document for each route
        {
          $unwind: "$routeEntries",
        },
        // Match only routes that start with the specified route pattern
        {
          $match: {
            "routeEntries.k": { $regex: new RegExp(`^${route}($|/)`, "i") },
          },
        },
        // Add a date field (without time) for grouping
        {
          $addFields: {
            dateOnly: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            subRoute: "$routeEntries.k",
          },
        },
        // Group by date and specific sub-route to get detailed metrics
        {
          $group: {
            _id: {
              date: "$dateOnly",
              subRoute: "$subRoute",
            },
            totalRequest: {
              $sum: { $ifNull: ["$routeEntries.v.totalRequest", 0] },
            },
            get: { $sum: { $ifNull: ["$routeEntries.v.GET", 0] } },
            post: { $sum: { $ifNull: ["$routeEntries.v.POST", 0] } },
            delete: { $sum: { $ifNull: ["$routeEntries.v.DELETE", 0] } },
            put: { $sum: { $ifNull: ["$routeEntries.v.PUT", 0] } },
          },
        },
        // Group again to organize by sub-route
        {
          $group: {
            _id: "$_id.subRoute",
            subRoute: { $first: "$_id.subRoute" },
            totalRequest: { $sum: "$totalRequest" },
            totalGet: { $sum: "$get" },
            totalPost: { $sum: "$post" },
            totalDelete: { $sum: "$delete" },
            totalPut: { $sum: "$put" },
            dailyData: {
              $push: {
                date: "$_id.date",
                totalRequest: "$totalRequest",
                get: "$get",
                post: "$post",
                delete: "$delete",
                put: "$put",
              },
            },
          },
        },
        // Now group all sub-routes together for the main route
        {
          $group: {
            _id: null,
            mainRoute: { $first: { $literal: route } },
            totalRequest: { $sum: "$totalRequest" },
            totalGet: { $sum: "$totalGet" },
            totalPost: { $sum: "$totalPost" },
            totalPut: { $sum: "$totalPut" },
            totalDelete: { $sum: "$totalDelete" },
            subRoutes: {
              $push: {
                route: "$subRoute",
                totalRequest: "$totalRequest",
                totalGet: "$totalGet",
                totalPost: "$totalPost",
                totalPut: "$totalPut",
                totalDelete: "$totalDelete",
                dailyData: "$dailyData",
              },
            },
            allDailyData: { $push: "$dailyData" },
          },
        },
        // Unwind and regroup the daily data to get consolidated daily metrics
        {
          $project: {
            _id: 0,
            mainRoute: 1,
            totalRequest: 1,
            totalGet: 1,
            totalPost: 1,
            totalPut: 1,
            totalDelete: 1,
            subRoutes: 1,
            allDailyData: {
              $reduce: {
                input: "$allDailyData",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            },
          },
        },
        // Process the consolidated daily data
        {
          $addFields: {
            dateMap: {
              $arrayToObject: {
                $map: {
                  input: "$allDailyData",
                  as: "day",
                  in: [
                    "$$day.date",
                    {
                      totalRequest: "$$day.totalRequest",
                      get: "$$day.get",
                      post: "$$day.post",
                      delete: "$$day.delete",
                      put: "$$day.put",
                    },
                  ],
                },
              },
            },
          },
        },
        // Convert back to array and format final output
        {
          $project: {
            mainRoute: 1,
            totalRequest: 1,
            totalGet: 1,
            totalPost: 1,
            totalPut: 1,
            totalDelete: 1,
            subRoutes: 1,
            dailyAggregate: {
              $map: {
                input: { $objectToArray: "$dateMap" },
                as: "entry",
                in: {
                  date: "$$entry.k",
                  metrics: "$$entry.v",
                },
              },
            },
          },
        },
        // Sort the daily data by date
        {
          $addFields: {
            dailyAggregate: {
              $sortArray: {
                input: "$dailyAggregate",
                sortBy: { date: 1 },
              },
            },
          },
        },
      ];

      // Execute the aggregation pipeline
      const result = await ApiTraffic.aggregate(pipeline);

      // If no data found, return empty result with the route
      if (result.length === 0) {
        return [
          {
            mainRoute: route,
            totalRequest: 0,
            totalGet: 0,
            totalPost: 0,
            totalPut: 0,
            totalDelete: 0,
            subRoutes: [],
            dailyAggregate: [],
          },
        ];
      }

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getWeekTrafficOverview(query) {
    const { organizationID, startTime, endTime } = query;

    try {
      // Convert startTime and endTime to Date objects
      const start = new Date(startTime);
      const end = new Date(endTime);
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      // Pipeline to aggregate weekly traffic data by route with daily breakdown
      const pipeline = [
        // Match documents within the time range and for the specified organization
        {
          $match: {
            organization: new mongoose.Types.ObjectId(organizationID),
            createdAt: { $gte: start, $lte: end },
          },
        },
        // Add day of week field (1-7, where 1 is Monday)
        {
          $addFields: {
            dayOfWeek: { $dayOfWeek: "$createdAt" },
            // Convert MongoDB's dayOfWeek (1-7 where 1 is Sunday) to ISO format (1-7 where 1 is Monday)
            isoDayOfWeek: {
              $let: {
                vars: {
                  dow: { $dayOfWeek: "$createdAt" },
                },
                in: {
                  $cond: [
                    { $eq: ["$$dow", 1] }, // If Sunday (1 in MongoDB)
                    7, // Set to 7 (Sunday in ISO)
                    { $subtract: ["$$dow", 1] }, // Otherwise subtract 1
                  ],
                },
              },
            },
          },
        },
        // Convert trafficPerRoutes Map to array for processing
        {
          $project: {
            isoDayOfWeek: 1,
            routesEntries: { $objectToArray: "$trafficPerRoutes" },
          },
        },
        // Unwind the array to get one document per route
        {
          $unwind: "$routesEntries",
        },
        // Group by route and day of week
        {
          $group: {
            _id: {
              route: "$routesEntries.k",
              dayOfWeek: "$isoDayOfWeek",
            },
            totalRequests: { $sum: "$routesEntries.v" },
          },
        },
        // Group by route to create the breakdown structure
        {
          $group: {
            _id: "$_id.route",
            totalRequestThisWeek: { $sum: "$totalRequests" },
            breakdown: {
              $push: {
                day: "$_id.dayOfWeek",
                totalRequest: "$totalRequests",
              },
            },
          },
        },
        // Format the final output
        {
          $project: {
            _id: 0,
            route: "$_id",
            totalRequestThisWeek: 1,
            breakdown: 1,
          },
        },
        // Sort by most traffic
        {
          $sort: { totalRequestThisWeek: -1 },
        },
      ];

      // Execute the aggregation pipeline
      let result = await ApiTraffic.aggregate(pipeline);

      // Ensure all days are represented in breakdown (even days with 0 requests)
      result = result.map((routeData) => {
        // Create a map of existing days
        const daysMap = {};
        routeData.breakdown.forEach((day) => {
          daysMap[day.day] = day.totalRequest;
        });

        // Create a complete breakdown with all 7 days
        const completeBreakdown = [];
        for (let i = 1; i <= 7; i++) {
          completeBreakdown.push({
            day: i,
            totalRequest: daysMap[i] || 0,
          });
        }

        // Sort by day
        completeBreakdown.sort((a, b) => a.day - b.day);

        return {
          ...routeData,
          breakdown: completeBreakdown,
        };
      });

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getRoutesTraffic(query) {
    const { organizationID, startTime, endTime } = query;

    try {
      // Convert startTime and endTime to Date objects if they are strings
      const start = new Date(startTime);
      const end = new Date(endTime);
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      // Pipeline to aggregate traffic data by routes with method breakdown
      const pipeline = [
        // Match documents within the time range and for the specified organization
        {
          $match: {
            organization: new mongoose.Types.ObjectId(organizationID),
            createdAt: { $gte: start, $lte: end },
          },
        },
        // Unwind the trafficPerRoutes Map to get individual route entries
        {
          $project: {
            routesEntries: { $objectToArray: "$trafficPerRoutes" },
          },
        },
        // Unwind the array to get one document per route
        {
          $unwind: "$routesEntries",
        },
        // Add a field to extract the main route (everything before the first slash or the whole string)
        {
          $addFields: {
            mainRoute: {
              $cond: {
                if: { $gte: [{ $indexOfCP: ["$routesEntries.k", "/"] }, 0] },
                then: {
                  $arrayElemAt: [{ $split: ["$routesEntries.k", "/"] }, 0],
                },
                else: "$routesEntries.k",
              },
            },
            fullRoute: "$routesEntries.k",
          },
        },
        // Group by mainRoute to aggregate the data
        {
          $group: {
            _id: "$mainRoute",
            routes: { $addToSet: "$fullRoute" },
            routeData: { $push: "$routesEntries.v" },
          },
        },
        // Process the route data to extract HTTP method information
        {
          $project: {
            _id: 0,
            mainRoute: "$_id",
            routes: 1,
            totalRequests: {
              $sum: {
                $map: {
                  input: "$routeData",
                  as: "data",
                  in: "$$data.totalRequest",
                },
              },
            },
            get: {
              $sum: {
                $map: {
                  input: "$routeData",
                  as: "data",
                  in: "$$data.GET",
                },
              },
            },
            post: {
              $sum: {
                $map: {
                  input: "$routeData",
                  as: "data",
                  in: "$$data.POST",
                },
              },
            },
            delete: {
              $sum: {
                $map: {
                  input: "$routeData",
                  as: "data",
                  in: "$$data.DELETE",
                },
              },
            },
            put: {
              $sum: {
                $map: {
                  input: "$routeData",
                  as: "data",
                  in: "$$data.PUT",
                },
              },
            },
          },
        },
        // Sort by most traffic to least
        {
          $sort: { totalRequests: -1 },
        },
      ];

      // Execute the aggregation pipeline
      const result = await ApiTraffic.aggregate(pipeline);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default ApiTrafficService;
