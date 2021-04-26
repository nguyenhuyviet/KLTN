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

export function showToast(toastSV, msg, status) {
    toastSV.show(
        '', msg,
        { "status": status });

}