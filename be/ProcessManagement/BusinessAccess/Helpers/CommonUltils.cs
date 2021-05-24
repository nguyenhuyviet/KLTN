using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessAccess.Helpers
{
    public static class CommonUltils
    {

        public static int GetDiffDayMinute(DateTime? dayOne, DateTime? dayTwo)
        {
            if (dayOne == null || dayTwo == null)
            {
                return 0;
            }
            else
            {
                DateTime date1 = dayOne ?? DateTime.Now;
                DateTime date2 = dayTwo ?? DateTime.Now;
                TimeSpan diffMs = date2 - date1; // milliseconds between now & Christmas
                return (int)Math.Floor(diffMs.TotalMinutes);
            }
        }
    }
}
