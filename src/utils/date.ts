import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// calculates age from date of birth string "YYYY-MM-DD"
export const calculateAge = (dob: string): number => {
  return dayjs().diff(dayjs(dob), "year");
};

// formats date for display
export const formatDate = (date: string): string => {
  return dayjs(date).format("DD MMM YYYY");
};

// relative time — "2 hours ago"
export const timeAgo = (date: string): string => {
  return dayjs(date).fromNow();
};

// formats date for API — "YYYY-MM-DD"
export const toApiDate = (date: Date): string => {
  return dayjs(date).format("YYYY-MM-DD");
};