import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(135deg, #4a2c17 0%, #7c4a2d 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 110,
        }}
      >
        ☕
      </div>
    ),
    { ...size }
  );
}
