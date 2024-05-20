export default function countScheduleMeeting(calls = []) {
  const locations = [];
  calls.forEach((call) => {
    const location =
      typeof call?.location === "string" ? call?.location : call?.location?._id;
    if (!locations.includes(location) && call?.status === 7)
      locations.push(location);
  });
  return locations.length;
}
