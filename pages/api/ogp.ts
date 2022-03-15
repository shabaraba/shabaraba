import { NextApiRequest, NextApiResponse } from 'next'

// export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
//   if (req.method != 'POST') res.status(405)

//   const { id } = req.query;
//   const WIDTH = 1200 as const;
//   const HEIGHT = 630 as const;
//   const canvas = createCanvas(WIDTH, HEIGHT);
//   const ctx = canvas.getContext("2d");
//   registerFont(path.resolve("./fonts/NotoSansJP-Regular.otf"), {
//     family: "Noto",
//   });
//   ctx.fillStyle = "#FFF";
//   ctx.fillRect(0, 0, WIDTH, HEIGHT);
//   ctx.font = "60px ipagp";
//   ctx.fillStyle = "#000000";
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";
//   const text = "入力した文字は" + String(id) + "なのねん";
//   ctx.fillText(text, WIDTH / 2, HEIGHT / 2);
//   const buffer = canvas.toBuffer();
//   res.writeHead(200, {
//     "Content-Type": "image/png",
//     "Content-Length": buffer.length,
//   });
//   res.end(buffer, "binary");
// }

