const KJUR = require("jsrsasign");

export function generateSignature(
  sdkKey: string,
  sdkSecret: string,
  topic: string,
  role: number
) {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;
  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    version: 1,
    app_key: sdkKey,
    tpc: topic,
    role_type: role,
    session_key: topic,
    iat: iat,
    exp: exp,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const sdkJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);
  return sdkJWT;
}
