# google-calendar-merge
Sync a google calendar into your primary google calendar   
  
This script makes use of tokens to only update most recent changes to your calendar.  
  
SETUP:  
0) Create a new google script in google docs and copy in the code.   
1) Create a google spreadsheet, and copy its id (found in the URL) where it says SPREADSHEET_ID.  
2) Add calendars (see lines 5-13 for examples).  
3) Include calendars in cals array (line 15)  
4) Update the start and end times appropriately  
5) That's it you're done!  
  
CURRENT KNOWN BUGS:  
for edited events, new events are created and old events with the old info are still there :|  
