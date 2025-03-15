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
      const start = new Date(startTime);
      const end = new Date(endTime);
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);
      const pipeline = [
        {
          $match: {
            organization: new mongoose.Types.ObjectId(organizationID),
            createdAt: { $gte: start, $lte: end },
          },
        },

        {
          $addFields: {
            dateOnly: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
          },
        },

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

        {
          $project: {
            _id: 0,
            date: "$_id",
            trafficOverview: 1,
          },
        },

        {
          $sort: { date: 1 },
        },
      ];
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
  }
  async getRouteTraffic(query) {
    const { organizationID, startTime, endTime, route } = query;

    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      const pipeline = [
        {
          $match: {
            organization: new mongoose.Types.ObjectId(organizationID),
            createdAt: { $gte: start, $lte: end },
          },
        },

        {
          $project: {
            createdAt: 1,
            routeEntries: { $objectToArray: "$trafficPerRoutes" },
          },
        },

        {
          $unwind: "$routeEntries",
        },

        {
          $match: {
            "routeEntries.k": { $regex: new RegExp(`^${route}($|/)`, "i") },
          },
        },

        {
          $addFields: {
            dateOnly: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            subRoute: "$routeEntries.k",
          },
        },

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

      const result = await ApiTraffic.aggregate(pipeline);

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
      const start = new Date(startTime);
      const end = new Date(endTime);
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      const pipeline = [
        {
          $match: {
            organization: new mongoose.Types.ObjectId(organizationID),
            createdAt: { $gte: start, $lte: end },
          },
        },

        {
          $addFields: {
            dayOfWeek: { $dayOfWeek: "$createdAt" },

            isoDayOfWeek: {
              $let: {
                vars: {
                  dow: { $dayOfWeek: "$createdAt" },
                },
                in: {
                  $cond: [
                    { $eq: ["$$dow", 1] },
                    7,
                    { $subtract: ["$$dow", 1] },
                  ],
                },
              },
            },
          },
        },

        {
          $project: {
            isoDayOfWeek: 1,
            routesEntries: { $objectToArray: "$trafficPerRoutes" },
          },
        },

        {
          $unwind: "$routesEntries",
        },

        {
          $group: {
            _id: {
              route: "$routesEntries.k",
              dayOfWeek: "$isoDayOfWeek",
            },
            totalRequests: { $sum: "$routesEntries.v" },
          },
        },

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

        {
          $project: {
            _id: 0,
            route: "$_id",
            totalRequestThisWeek: 1,
            breakdown: 1,
          },
        },

        {
          $sort: { totalRequestThisWeek: -1 },
        },
      ];

      let result = await ApiTraffic.aggregate(pipeline);
      result = result.map((routeData) => {
        const daysMap = {};
        routeData.breakdown.forEach((day) => {
          daysMap[day.day] = day.totalRequest;
        });
        const completeBreakdown = [];
        for (let i = 1; i <= 7; i++) {
          completeBreakdown.push({
            day: i,
            totalRequest: daysMap[i] || 0,
          });
        }
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
      const start = new Date(startTime);
      const end = new Date(endTime);
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      const pipeline = [
        {
          $match: {
            organization: new mongoose.Types.ObjectId(organizationID),
            createdAt: { $gte: start, $lte: end },
          },
        },

        {
          $project: {
            routesEntries: { $objectToArray: "$trafficPerRoutes" },
          },
        },

        {
          $unwind: "$routesEntries",
        },

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

        {
          $group: {
            _id: "$mainRoute",
            routes: { $addToSet: "$fullRoute" },
            routeData: { $push: "$routesEntries.v" },
          },
        },

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
        {
          $sort: { totalRequests: -1 },
        },
      ];
      const result = await ApiTraffic.aggregate(pipeline);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default ApiTrafficService;
