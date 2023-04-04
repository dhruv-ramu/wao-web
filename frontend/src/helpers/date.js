import day from 'dayjs';
import re from 'dayjs/plugin/relativeTime';

day.extend(re);

export function r(date) {
  return day(date).fromNow();
}