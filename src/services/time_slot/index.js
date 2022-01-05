/* eslint-disable no-undef */
const helper = global.helper;
const moment = helper.module.moment;

function validateSlotTime(start, end, slots, duration, interval) {
  const startTime = moment().utc().set({
    hour: start[0],
    minute: start[1]
  });
  const endTime = moment().utc().set({
    hour: end[0],
    minute: end[1]
  });
  const timeDiff = endTime.diff(startTime, 'minutes')
  const slotDiff = slots * (interval + duration)
  if (timeDiff < slotDiff) {

    throw `Give proper details.`
  }
}

function slotsday(start, end, slots, duration, interval, timezoneOffset) {
  let singleDaySlots = []

  const startTime = moment().utcOffset(timezoneOffset).set({
    hour: start[0],
    minute: start[1]
  });
  const endTime = moment().utcOffset(timezoneOffset).set({
    hour: end[0],
    minute: end[1]
  });

  let count = 0;
  while (startTime <= endTime && count < slots - 1) {
    const tempObj = {};
    tempObj.start = startTime.format('HH:mm')
    tempObj.end = startTime.add(duration, 'minutes').format('HH:mm')
    singleDaySlots.push(tempObj)
    startTime.add(interval, 'minutes').format('HH:mm')
    count++
  }
  singleDaySlots.push({
    start: startTime.format('HH:mm'),
    end: endTime.format('HH:mm')
  })

  return singleDaySlots
}
async function slotGenerator(payload) {

  let currentDate = moment().format("YYYY-MM-DD");

  let start = payload.startTime.split(':')
  let end = payload.endTime.split(':')
  let slots = +payload.slots
  let duration = +payload.duration
  let interval = +payload.interval
  let days = +payload.days
  let timezone = payload.timezone

  const timeSlots = [];
  const timezoneOffset = moment().tz(timezone).format('Z');


  validateSlotTime(start, end, slots, duration, interval);

  for (i = 1; i <= days; i++) {

    const slotsArr = slotsday(start, end, slots, duration, interval, timezoneOffset)
    timeSlots.push({
      date: currentDate,
      timezone,
      slots: slotsArr

    })

    currentDate = moment(currentDate).add(1, 'days').format("YYYY-MM-DD");


  }

  return timeSlots
}
module.exports = slotGenerator;