export function ConvertMinutes(num) {
  let d = Math.floor(num / 1440); // 60*24
  let h = Math.floor((num - (d * 1440)) / 60);
  let m = Math.round(num % 60);


  return {
    day: d,
    hour: h,
    minute: m
  };

}

export function GetDiffDayMinute(dayOne, dayTwo) {
  var diffMs = (dayTwo - dayOne); // milliseconds between now & Christmas
  return Math.floor(diffMs / 60000)
}

export function showToast(toastSV, msg, status) {
  toastSV.show(
    '', msg,
    { "status": status });

}



export function checkFileType(fileName) {
  //file type extension
  let checkFileType = fileName.split('.').pop();
  if (checkFileType == ".txt") {
    return "text/plain";
  } 
  if (checkFileType == ".zip") {
    return "application/zip";
  }
  if (checkFileType == ".pdf") {
    return "application/pdf";
  }
  if (checkFileType == ".doc") {
    return "application/vnd.ms-word";
  }
  if (checkFileType == ".docx") {
    return "application/vnd.ms-word";
  }
  if (checkFileType == ".xls") {
    return "application/vnd.ms-excel";
  }
  if (checkFileType == ".png") {
    return "image/png";
  }
  if (checkFileType == ".jpg") {
    return "image/jpeg";
  }
  if (checkFileType == ".jpeg") {
    return "image/jpeg";
  }
  if (checkFileType == ".gif") {
    return "image/gif";
  }
  if (checkFileType == ".csv") {
    return "text/csv";
  }
}