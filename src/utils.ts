export function formatAddress(address = "") {
  return address.slice(0, 6).concat("...", address.slice(-6));
}
export function zeroAddress() {
  return "0x0000000000000000000000000000000000000000";
}
