import { formatInTimeZone } from 'date-fns-tz'

export default function Date({ dateString }: { dateString: string }) {
  // console.log(dateString)
  const date = formatInTimeZone(dateString, 'Asia/Tokyo', 'LLLL d, yyyy')
  // const date = parseISO(dateString)
  // console.log(date)
  return <time dateTime={dateString}>{date}</time>
}
