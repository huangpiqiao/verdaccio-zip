import dayjs from "dayjs";

export function anyAwait(pms) {
  if (!pms || !pms.then) throw new Error("anyAwait:参数必须是promise");
  return pms.then((res) => [null, res]).catch((err) => [err, null]);
}

export function checkRoot(p = "") {
  return !!p && p !== "/";
}

export function getDay(days = 7){
  return new Array(days).fill('').map((item,idx)=>{
    return dayjs(new Date()).subtract(idx, 'day').format('YYYY-MM-DD')
  })
}