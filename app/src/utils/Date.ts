export default {

     monthNames: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
     ],
     dayNames: [
          "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
     ],

     years: Array.from({ length: 51 }, (_, i) => new Date().getFullYear() - i),

     daysOfMonth(year, month) {
          return new Date(year, month + 1, 0).getDate()
     },

     firstDay(year, month) {
          return new Date(year, month, 1).getDay()
     },

     isEqual(dateOne, dateTwo) {
          return this.isEqualAny(dateOne, dateTwo)
     },
     isEqualAny(selectedDate) {
          return Array.from(arguments)
               .slice(1)
               .map(date => date?.getTime())
               .includes(selectedDate.getTime());
     },

     within(selectedDate, startDate, endDate) {

          const dates = [
               startDate?.getTime(),
               endDate?.getTime(),
          ].sort();

          return selectedDate.getTime() < dates[1] && selectedDate.getTime() > dates[0];
     },

     rangeToText(start, end) {

          if (!start || !end) return "";

          return [
               start.getTime(),
               end.getTime(),
          ]
               .sort()
               .map(dateTime => new Date(dateTime).toLocaleDateString()).join(' - ');
     }
}