import { ImageResponse } from "next/og";

export const alt =
  "Val Containers — shipping containers for sale in Kenya";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0b09",
          padding: "72px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(239,233,222,0.035) 0px, rgba(239,233,222,0.035) 2px, transparent 2px, transparent 44px)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ width: "16px", height: "54px", background: "#f4511e" }} />
            <div style={{ width: "16px", height: "54px", background: "rgba(239,233,222,0.85)" }} />
            <div style={{ width: "16px", height: "54px", background: "rgba(239,233,222,0.35)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#efe9de", fontSize: "38px", fontWeight: 700, letterSpacing: "-1px" }}>
              VAL
            </div>
            <div style={{ color: "rgba(239,233,222,0.4)", fontSize: "14px", letterSpacing: "5px" }}>
              CONTAINERS
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#f4511e", fontSize: "17px", letterSpacing: "5px", textTransform: "uppercase" }}>
            Nairobi yard · Countrywide delivery
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "20px",
              color: "#efe9de",
              fontSize: "88px",
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-4px",
              maxWidth: "1000px",
            }}
          >
            <div>Every listing has</div>
            <div style={{ color: "#f4511e" }}>a published price.</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(239,233,222,0.16)",
            paddingTop: "24px",
            color: "rgba(239,233,222,0.5)",
            fontSize: "17px",
          }}
        >
          <span>Published prices · Condition notes · Inspect before you pay</span>
          <span>val-containers.vercel.app</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
