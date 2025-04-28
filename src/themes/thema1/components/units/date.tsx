import { formatInTimeZone } from 'date-fns-tz'

export default function Date({ date }: { date: Date }) {

  const dateTz = formatInTimeZone(date, 'Asia/Tokyo', 'LLLL d, yyyy');

  return <time dateTime={dateTz}>{dateTz}</time>
}
