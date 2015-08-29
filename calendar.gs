/**
 * Sync all the calendars in the list
 */
function syncCalendars() {
  // for each calendar you would like copied to your primary calendar: include the line
  // var calendar_name = { calId: "", title: "", color: #};
  // the calId can be found by going to the calendar's settings
  // the title is the text that appears in the square brackets prepending the calendar event
  // color of the event on the primary calendar
  // for example:
  //      var smite = { calId: "abcdefg@group.calendar.google.com", title: "sMITe", color: 4};
  //      var ats = { calId: "abcdefg@gmail.com", title: "ATS", color: 3};
  //      var cals = [smite, ats]; 
  
  var cals = []; //insert calendar_names in the array (the variable names (see above for example))
  for(var i = 0; i < cals.length; i+=1) {
    syncCalendar(i+1, cals[i].calId, cals[i].title, cals[i].color);
  }
}

function readFromSheet(index) {
  var token = SpreadsheetApp.openById("SPREADSHEET_ID").getSheetByName("Sheet1").getRange(index, 1).getValue();
  return token;
}

function writeToSheet(string, index) {
  var token = SpreadsheetApp.openById("SPREADSHEET_ID").getSheetByName("Sheet1").getRange(index, 1).setValue(string);
}

/**
 * Clear all events created by the calendar already, and reads them.
 * For more information on using Calendar events, see
 * https://developers.google.com/apps-script/class_calendarevent.
 */
function syncCalendar(index, otherCalId, title, color) {
  var start = new Date(); 
  var end = new Date("June 1, 2015 00:00:00 PDT"); 
  var syncToken = readFromSheet(index);
  
  var events;
  var nextPageToken;
  do {    
    if (syncToken.length == 0) {
      events = Calendar.Events.list(otherCalId, {
        showDeleted: false,
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        pageToken: nextPageToken
      });
    } else {
      events = Calendar.Events.list(otherCalId, {
        syncToken: syncToken
      });
    }
    
    for(var i = 0; i < events.items.length; i++) {
        copyEvent(title, events.items[i], color);
    }
    
    nextPageToken = events.nextPageToken;
  } while (nextPageToken != null);
  //write next sync token
  writeToSheet(events.nextSyncToken, index);
  
};

/**
 * Copies the calendar event
 * @param {CalendarEvent} eventToCopy event that is being copied
 * @param {String} title header for the event
 */
function copyEvent(title, eventToCopy, color) { 
  var calendarId = 'primary';  
  var header = "[" + title + "] ";
  
  Logger.log(eventToCopy + " " + eventToCopy.summary + " " + eventToCopy.start + " " + eventToCopy.end);
  var event;
  if (eventToCopy != null && eventToCopy.start != null) {
      if ((eventToCopy.start.dateTime != null)) {
        event = {
          summary: header.concat(eventToCopy.summary),
          location: eventToCopy.location,
          description: eventToCopy.description,
          start: eventToCopy.start,
          end: eventToCopy.end,
          colorId: color,
          recurrence: eventToCopy.recurrence
        };
      }
    else if (eventToCopy.start.date != null){
      event = {
        summary: header.concat(eventToCopy.summary),
        location: eventToCopy.location,
        description: eventToCopy.description,
        start: eventToCopy.start,
        end: eventToCopy.end,
        colorId: color,
        recurrence: eventToCopy.recurrence
      };
    }
  event = Calendar.Events.insert(event, calendarId);
  }
};
