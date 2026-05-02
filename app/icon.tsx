import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
  const data = await readFile(
    join(process.cwd(), "public/assets/zz.jpg"),
    "base64",
  );
  const src = `data:image/jpeg;base64,${data}`;

  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <img src={src} width={size.width} height={size.height} alt="" />
    </div>,
    { ...size },
  );
}
