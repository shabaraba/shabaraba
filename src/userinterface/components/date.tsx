import { formatInTimeZone } from 'date-fns-tz'

export default function Date({ dateString }: { dateString: string }) {

  const date = formatInTimeZone(dateString, 'Asia/Tokyo', 'LLLL d, yyyy')
  // const date = parseISO(dateString)

  return <time dateTime={dateString}>{date}</time>
}
