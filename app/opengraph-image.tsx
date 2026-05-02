import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "Zomaar Zomert";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const data = await readFile(
    join(process.cwd(), "public/assets/zz.jpg"),
    "base64",
  );
  const src = `data:image/jpeg;base64,${data}`;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#de350b",
      }}
    >
      <img src={src} width={500} height={500} alt="" />
    </div>,
    { ...size },
  );
}
