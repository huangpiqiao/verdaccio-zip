export function anyAwait(pms) {
  if (!pms || !pms.then) throw new Error("anyAwait:参数必须是promise");
  return pms.then((res) => [null, res]).catch((err) => [err, null]);
}
