function getStartAndEndTime() {
  const today = new Date();

  // Format YYYY-MM-DD
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  // Construct start and end times
  const startTime = `${year}-${month}-${day}T00:00:00`;
  const endTime = `${year}-${month}-${day}T23:59:59`;

  return { startTime, endTime };
}

export default getStartAndEndTime;
