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
  // async getTrafficOverview(query) {
  //   const { organizationID, startTime, endTime } = query;

  //   try {
  //     // Convert startTime and endTime to Date objects if they are strings
  //     const start = new Date(startTime);
  //     const end = new Date(endTime);

  //     // Pipeline to aggregate traffic data by date and hour
  //     const pipeline = [
  //       // Match documents within the time range and for the specified organization
  //       {
  //         $match: {
  //           organization: new mongoose.Types.ObjectId(organizationID),
  //           createdAt: { $gte: start, $lte: end },
  //         },
  //       },
  //       // Add a date field (without time) for grouping
  //       {
  //         $addFields: {
  //           dateOnly: {
  //             $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
  //           },
  //         },
  //       },
  //       // Group by date and hour
  //       {
  //         $group: {
  //           _id: {
  //             date: "$dateOnly",
  //             hour: "$hour",
  //           },
  //           totalRequests: { $sum: "$totalRequests" },
  //           breakdown: { $first: "$breakdown" },
  //           trafficPerRoutes: { $first: "$trafficPerRoutes" },
  //         },
  //       },
  //       // Group again to structure data by date with an array of hourly data
  //       {
  //         $group: {
  //           _id: "$_id.date",
  //           trafficOverview: {
  //             $push: {
  //               hour: "$_id.hour",
  //               totalRequests: "$totalRequests",
  //               breakdown: "$breakdown",
  //               trafficPerRoutes: "$trafficPerRoutes",
  //             },
  //           },
  //         },
  //       },
  //       // Format the final output
  //       {
  //         $project: {
  //           _id: 0,
  //           date: "$_id",
  //           trafficOverview: 1,
  //         },
  //       },
  //       // Sort by date
  //       {
  //         $sort: { date: 1 },
  //       },
  //     ];

  //     // Execute the aggregation pipeline
  //     const result = await ApiTraffic.aggregate(pipeline);
  //     return result;
  //   } catch (err) {
  //     throw err;
  //   }
  // }
  // async getTrafficOverview(query) {
  //   const { organizationID, startTime, endTime } = query;

  //   try {
  //     // Convert startTime and endTime to Date objects if they are strings
  //     const start = new Date(startTime);
  //     const end = new Date(endTime);

  //     // Pipeline to aggregate traffic data by date and hour
  //     const pipeline = [
  //       // Match documents within the time range and for the specified organization
  //       {
  //         $match: {
  //           organization: new mongoose.Types.ObjectId(organizationID),
  //           createdAt: { $gte: start, $lte: end },
  //         },
  //       },
  //       // Add a date field (without time) for grouping
  //       {
  //         $addFields: {
  //           dateOnly: {
  //             $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
  //           },
  //         },
  //       },
  //       // Group by date and hour
  //       {
  //         $group: {
  //           _id: {
  //             date: "$dateOnly",
  //             hour: "$hour",
  //           },
  //           totalRequests: { $sum: "$totalRequests" },
  //           breakdown: { $first: "$breakdown" },
  //         },
  //       },
  //       // Group again to structure data by date with an array of hourly data
  //       {
  //         $group: {
  //           _id: "$_id.date",
  //           trafficOverview: {
  //             $push: {
  //               hour: "$_id.hour",
  //               totalRequests: "$totalRequests",
  //               breakdown: "$breakdown",
  //             },
  //           },
  //         },
  //       },
  //       // Format the final output
  //       {
  //         $project: {
  //           _id: 0,
  //           date: "$_id",
  //           trafficOverview: 1,
  //         },
  //       },
  //       // Sort by date
  //       {
  //         $sort: { date: 1 },
  //       },
  //     ];

  //     // Execute the aggregation pipeline
  //     const result = await ApiTraffic.aggregate(pipeline);
  //     return result;
  //   } catch (err) {
  //     throw err;
  //   }
  // }
  // async getTrafficOverview(query) {
  //   const { organizationID, startTime, endTime } = query;
  //   try {
  //     // Convert startTime and endTime to Date objects if they are strings
  //     const start = new Date(startTime);
  //     const end = new Date(endTime);

  //     // Pipeline to aggregate traffic data by date and hour
  //     const pipeline = [
  //       // Match documents within the time range and for the specified organization
  //       {
  //         $match: {
  //           organization: new mongoose.Types.ObjectId(organizationID),
  //           createdAt: { $gte: start, $lte: end },
  //         },
  //       },
  //       // Add a date field (without time) for grouping
  //       {
  //         $addFields: {
  //           dateOnly: {
  //             $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
  //           },
  //         },
  //       },
  //       // Group by date and hour
  //       {
  //         $group: {
  //           _id: {
  //             date: "$dateOnly",
  //             hour: "$hour",
  //           },
  //           totalRequests: { $sum: "$totalRequests" },
  //           breakdown: { $first: "$breakdown" },
  //         },
  //       },
  //       // Group again to structure data by date with an array of hourly data
  //       {
  //         $group: {
  //           _id: "$_id.date",
  //           trafficOverview: {
  //             $push: {
  //               hour: "$_id.hour",
  //               totalRequests: "$totalRequests",
  //               breakdown: "$breakdown",
  //             },
  //           },
  //         },
  //       },
  //       // Format the final output
  //       {
  //         $project: {
  //           _id: 0,
  //           date: "$_id",
  //           trafficOverview: 1,
  //         },
  //       },
  //       // Sort by date
  //       {
  //         $sort: { date: 1 },
  //       },
  //     ];

  //     // Execute the aggregation pipeline
  //     const result = await ApiTraffic.aggregate(pipeline);
  //     return result;
  //   } catch (err) {
  //     throw err;
  //   }
  // }
  async getTrafficOverview(query) {
    try {
      const { organizationID, startTime, endTime } = query;

      // Convert startTime and endTime to Date objects if they are strings
      const start = new Date(startTime);
      const end = new Date(endTime);

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
  // async getRoutesTraffic(query) {
  //   const { organizationID, startTime, endTime } = query;

  //   try {
  //     // Convert startTime and endTime to Date objects if they are strings
  //     const start = new Date(startTime);
  //     const end = new Date(endTime);

  //     // Pipeline to aggregate traffic data by routes
  //     const pipeline = [
  //       // Match documents within the time range and for the specified organization
  //       {
  //         $match: {
  //           organization: new mongoose.Types.ObjectId(organizationID),
  //           createdAt: { $gte: start, $lte: end },
  //         },
  //       },
  //       // Unwind the trafficPerRoutes Map to get individual route entries
  //       {
  //         $project: {
  //           routesEntries: { $objectToArray: "$trafficPerRoutes" },
  //         },
  //       },
  //       // Unwind the array to get one document per route
  //       {
  //         $unwind: "$routesEntries",
  //       },
  //       // Group by route to sum up the requests
  //       {
  //         $group: {
  //           _id: "$routesEntries.k",
  //           totalRequests: { $sum: "$routesEntries.v" },
  //         },
  //       },
  //       // Format the final output
  //       {
  //         $project: {
  //           _id: 0,
  //           route: "$_id",
  //           totalRequests: 1,
  //         },
  //       },
  //       // Sort by most traffic to least
  //       {
  //         $sort: { totalRequests: -1 },
  //       },
  //     ];

  //     // Execute the aggregation pipeline
  //     const result = await ApiTraffic.aggregate(pipeline);
  //     return result;
  //   } catch (err) {
  //     throw err;
  //   }
  // }
  // async getRouteTraffic(query) {
  //   const { organizationID, startTime, endTime, route } = query;

  //   try {
  //     // Convert startTime and endTime to Date objects if they are strings
  //     const start = new Date(startTime);
  //     const end = new Date(endTime);

  //     // Pipeline to aggregate traffic data for a specific route by date
  //     const pipeline = [
  //       // Match documents within the time range and for the specified organization
  //       {
  //         $match: {
  //           organization: new mongoose.Types.ObjectId(organizationID),
  //           createdAt: { $gte: start, $lte: end },
  //           [`trafficPerRoutes.${route}`]: { $exists: true },
  //         },
  //       },
  //       // Add a date field (without time) for grouping
  //       {
  //         $addFields: {
  //           dateOnly: {
  //             $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
  //           },
  //         },
  //       },
  //       // Group by date to sum up the requests for each day
  //       {
  //         $group: {
  //           _id: "$dateOnly",
  //           totalRequest: {
  //             $sum: { $ifNull: [`$trafficPerRoutes.${route}`, 0] },
  //           },
  //           createdAt: { $first: "$createdAt" },
  //         },
  //       },
  //       // Group all results together to create the structure
  //       {
  //         $group: {
  //           _id: null,
  //           route: { $first: { $literal: route } },
  //           totalRequest: { $sum: "$totalRequest" },
  //           detailedData: {
  //             $push: {
  //               date: "$_id",
  //               totalRequest: "$totalRequest",
  //             },
  //           },
  //         },
  //       },
  //       // Format the final output
  //       {
  //         $project: {
  //           _id: 0,
  //           route: 1,
  //           totalRequest: 1,
  //           detailedData: 1,
  //         },
  //       },
  //     ];

  //     // Execute the aggregation pipeline
  //     const result = await ApiTraffic.aggregate(pipeline);

  //     // If no data found, return empty result with the route
  //     if (result.length === 0) {
  //       return [
  //         {
  //           route,
  //           totalRequest: 0,
  //           detailedData: [],
  //         },
  //       ];
  //     }

  //     return result;
  //   } catch (err) {
  //     throw err;
  //   }
  // }
  async getRouteTraffic(query) {
    const { organizationID, startTime, endTime, route } = query;
  
    try {
      // Convert startTime and endTime to Date objects if they are strings
      const start = new Date(startTime);
      const end = new Date(endTime);
  
      // Pipeline to aggregate traffic data for a specific route by date with method breakdown
      const pipeline = [
        // Match documents within the time range and for the specified organization
        {
          $match: {
            organization: new mongoose.Types.ObjectId(organizationID),
            createdAt: { $gte: start, $lte: end },
            [`trafficPerRoutes.${route}`]: { $exists: true },
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
        // Group by date to sum up the requests for each day
        {
          $group: {
            _id: "$dateOnly",
            totalRequest: {
              $sum: { $getField: { field: "totalRequest", input: { $ifNull: [`$trafficPerRoutes.${route}`, {}] } } },
            },
            get: {
              $sum: { $getField: { field: "GET", input: { $ifNull: [`$trafficPerRoutes.${route}`, {}] } } },
            },
            post: {
              $sum: { $getField: { field: "POST", input: { $ifNull: [`$trafficPerRoutes.${route}`, {}] } } },
            },
            delete: {
              $sum: { $getField: { field: "DELETE", input: { $ifNull: [`$trafficPerRoutes.${route}`, {}] } } },
            },
            put: {
              $sum: { $getField: { field: "PUT", input: { $ifNull: [`$trafficPerRoutes.${route}`, {}] } } },
            },
            createdAt: { $first: "$createdAt" },
          },
        },
        // Group all results together to create the structure
        {
          $group: {
            _id: null,
            route: { $first: { $literal: route } },
            totalRequest: { $sum: "$totalRequest" },
            detailedData: {
              $push: {
                date: "$_id",
                totalRequest: "$totalRequest",
                get: "$get",
                post: "$post",
                delete: "$delete",
                put: "$put"
              },
            },
          },
        },
        // Format the final output
        {
          $project: {
            _id: 0,
            route: 1,
            totalRequest: 1,
            detailedData: 1,
          },
        },
      ];
  
      // Execute the aggregation pipeline
      const result = await ApiTraffic.aggregate(pipeline);
  
      // If no data found, return empty result with the route
      if (result.length === 0) {
        return [
          {
            route,
            totalRequest: 0,
            detailedData: [],
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
        // Group by route to aggregate the data
        {
          $group: {
            _id: "$routesEntries.k",
            routeData: { $push: "$routesEntries.v" },
          },
        },
        // Process the route data to extract HTTP method information
        {
          $project: {
            _id: 0,
            route: "$_id",
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

/*

[{hour:1, organizationID:1, breakdown:{"1":230, "2":'150'}}
]

*/
