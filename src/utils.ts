export function createUUID(): string {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  s[19] = hexDigits.substr((s[19] as any & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  const uuid = s.join("");
  return uuid;
}

export function getAuthCodeFromLocation(location: string): string | undefined {
  const url = new URL(location);
  const params = url.search.substring(1).split("&");
  for (const param of params) {
    const [key, value] = param.split("=");
    if (key === "code") {
      return value;
    }
  }
}

export function decodeToken(str: string): { nonce: string } {
  str = str.split(".")[1];

  str = str.replace("/-/g", "+");
  str = str.replace("/_/g", "/");
  switch (str.length % 4) {
    case 0:
      break;
    case 2:
      str += "==";
      break;
    case 3:
      str += "=";
      break;
    default:
      throw new Error("Invalid token");
  }

  str = (str + "===").slice(0, str.length + (str.length % 4));
  str = str.replace(/-/g, "+").replace(/_/g, "/");

  str = decodeURIComponent(escape(atob(str)));

  return JSON.parse(str);
}
