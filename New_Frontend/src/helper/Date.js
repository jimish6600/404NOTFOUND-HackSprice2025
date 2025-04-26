import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';  // Correct function from date-fns-tz

const convertUTCToIST = (utcDateStr) => {
  try {
    const timeZone = 'Asia/Kolkata'; // IST timezone

    // Step 1: Convert the UTC string to a Date object
    const dateObj = new Date(utcDateStr);

    // Check if the dateObj is valid
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date format");
    }

    // Step 2: Convert UTC time to IST using toZonedTime
    const zonedTime = toZonedTime(dateObj, timeZone);

    // Step 3: Format the date in a readable format for IST
    const formattedDate = format(zonedTime, 'dd MMMM yyyy, hh:mm a');

    return formattedDate;
  } catch (error) {
    console.error("Date conversion error:", error.message);
    return "Invalid Date";
  }
};

export default convertUTCToIST;
