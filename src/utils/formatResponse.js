const formatResponse = (response) => {
  console.log(
    "---------------------------------Response recived insdie formatResponse---------------------------",
    response
  );
  let newRes = "";
  if (response.startsWith("```")) {
    newRes = response.slice(3, -4);
  }
  if (newRes.startsWith("json")) {
    newRes = newRes.slice(4);
  }
  if (newRes.startsWith("javascript")) {
    newRes = newRes.slice(10);
  }
  return newRes == "" ? response : JSON.parse(newRes);
};

export default formatResponse;
