function main() {
  var tz = "Asia/Tokyo"
  var day = new Date();
  if(day.getHours() >= 17){
    // 17時過ぎの場合は、翌日
    day.setDate(day.getDate() + 1)
  }
  var dayData = getCalendarOfDay(PropertiesService.getScriptProperties().getProperty("calendarID"), day);
  var events = [];
  for(var i = 0; i < dayData.length; i++)
  {
    var d = dayData[i];
    // 現在時刻以降のイベントを表示(時刻が17時以降なら、すべて表示)
    if(day.getHours() >= 17 || d.getStartTime().getHours() > day.getHours()){
      var t = d.getTitle();
      var mark = "";
      var time = "";
      var title = "";
      if(["■", "◇", "◆"].indexOf(t.charAt(0)) >= 0)
      {
        mark =  t.charAt(0);
        t = t.slice(1);
      }else{
        mark = "　"
      }
      time = Utilities.formatDate(d.getStartTime(), tz, "HH:mm");
      events.push({
        mark: mark,
        time: time,
        title: t.length <= 18 ? t.substr(0, 17) : t.substr(0, 16) + "…" 
      });
    }
  }
  // 出力処理
  Logger.log(Utilities.formatDate(day, tz, "YYYY-MM-dd"));
  Logger.log(events);
  if(events.length > 0){
    t = ["morning", "morning", "noon", "evening"];
    var template = HtmlService.createTemplateFromFile(t[Math.floor(day.getHours() / 6)]);
    template.events = events;
    var text = template.evaluate().getContent()
    Logger.log(text);
    Logger.log(text.length + "文字");
    // Tweet
    var data = {
      "status": text
    };
    
    var res = Twitter.api("statuses/update", data);
  }
}

function getCalendarOfDay(id, day) {
  var calendar = CalendarApp.getCalendarById(id);
  return calendar.getEventsForDay(day);
}
