import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currHourTrafficData, setCurrHourTrafficData] = useState({
    hour: new Date().getHours(),
    breakdown: {},
    totalRequests: 0,
    trafficPerRoutes: {},
  });
  // For Home Page

  // request per min (with realtime updates)
  const [requestPerMin, setRequestPerMin] = useState([]);
  const [requestPerHour, setRequestPerHour] = useState([]);

  // Traffic Page
  const [requestOverFiveHours, setRequestOverFiveHours] = useState([]);
  const [routesRequests, setRoutesRequests] = useState([{ name: "", uv: "", value: "" }]);

  // const [curHourTraffic, setCurHourTraffic] = useState({});

  // organization
  const [organization, setOrganization] = useState({});

  const [verify, setVerify] = useState(false);

  const setRequestPerMinFunc = (data, type = "old") => {
    // console.log("setRequestPerMinFunc()", requestPerMin);
    if (type === "new") {
      // console.log("inside the new one");
      setRequestPerMin((oldData) => {
        console.log("insdie the setRequestOverFiveHours()", [...oldData.slice(data.length), ...data])
        return [...data.slice(oldData.length), ...oldData]
      });
    } else {
      setCurrHourTrafficData((oldData) => {
        // console.log(oldData.totalRequests, data.requests)
        let newBreakdown = { ...oldData.breakdown }; // Copy breakdown
        newBreakdown[data.minute] = data.requests;

        let newTrafficData = { ...oldData.trafficPerRoutes }; // Copy traffic per routes
        let trafficData = Object.entries(data.routesTraffic);

        for (let [route, methods] of trafficData) {
          for (let [method, count] of Object.entries(methods)) {
            newTrafficData[route] = {
              ...newTrafficData[route],
              [method]: (newTrafficData[route]?.[method] || 0) + count
            };
          }
        }


        return {
          ...oldData,
          totalRequests: oldData.totalRequests + data.requests, // Ensure new totalRequests value
          trafficPerRoutes: newTrafficData,
          breakdown: newBreakdown
        };
      });

      setRequestPerMin((oldData) => {
        let newData = [...oldData];
        if (newData.length > 60) {
          newData.shift();
        }
        newData.push({
          minute: data.time,
          requests: data.requests,
        });
        return newData;
      });


    }
  };

  const setRequestOverFiveHoursFunc = (data, type = "new") => {
    if (type == "new") {
      setRequestOverFiveHours((oldData) => {
        console.log("insdie the setRequestOverFiveHours()", [...oldData.slice(data.length), ...data])
        return [...data.slice(oldData.length), ...oldData]
      });
    } else {
      setRequestOverFiveHours((oldData) => {
        let newData = [...oldData];
        if (newData.length > 300) {
          newData.shift();
        }
        console.log("-------------- setRequestOverFiveHoursFunc() -----------------", data)
        newData.push({
          minute: data.time,
          requests: data.requests,
        });
        return newData;
      });
    }
  };

  const setRequestPerHourFunc = (data, type = "new") => {
    if (type == "new") {
      setRequestPerHour([...data])
    } else {
      setRequestPerHour((oldData) => {
        let newData = [...oldData];
        if (newData.length > 23) {
          newData.shift();
        }
        newData.push(data);
        return newData;
      });
    }
  };

  const setRoutesRequestsFunc = (data, type = "new") => {
    if (type == "new") {
      setRoutesRequests(data);
    } else {
      setRoutesRequests((oldData) => {
        let newData = [...oldData];
        console.log("setRoutesRequestsFunc()", data);

        for (let [route, methods] of Object.entries(data)) {
          let found = false;

          newData = newData.map((routeData) => {
            if (routeData.name === route) {
              found = true;
              return {
                ...routeData,
                uv: routeData.uv + methods.totalRequest,
                value: routeData.value + methods.totalRequest,
              };
            }
            return routeData;
          });

          // If the route was not found, add it as a new entry
          if (!found) {
            newData.push({
              name: route,
              uv: methods.totalRequest,
              value: methods.totalRequest,
            });
          }
        }

        return newData;
      });
    }
  };


  return (
    <AppContext.Provider
      value={{
        verify,
        setVerify,
        currHourTrafficData,
        setCurrHourTrafficData,
        organization,
        requestPerMin,
        routesRequests,
        setRequestPerMin,
        requestPerHour,
        setRequestPerHour,
        setOrganization,
        setRequestPerMinFunc,
        setRequestOverFiveHoursFunc,
        setRequestPerHourFunc,
        requestOverFiveHours,
        setRoutesRequestsFunc
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
