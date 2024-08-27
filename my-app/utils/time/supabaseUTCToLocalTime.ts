import { format } from "date-fns";

export default function supabaseUTCToLocalTime(dateParam: string) {
    const date = new Date(dateParam);
    const formattedDate = format(date, 'MMM dd, yyyy');
    return formattedDate;
}