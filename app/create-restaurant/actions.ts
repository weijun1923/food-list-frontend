// app/actions/upload-to-r2.ts
"use server";

interface R2PresignedPost {
  url: string;
  key: string;
  fields: R2PresignedFileds;
}

interface R2PresignedFileds {
  /** MIME type of the file to upload */
  "Content-Type": string;
  /** Object key under which to store the file */
  key: string;
  /** Base64‐encoded policy document */
  policy: string;
  /** AWS signature algorithm (always “AWS4-HMAC-SHA256”) */
  "x-amz-algorithm": string;
  /** Credential scope for signing the request */
  "x-amz-credential": string;
  /** ISO8601 timestamp when the signature was created */
  "x-amz-date": string;
  /** Signature string to authorize the upload */
  "x-amz-signature": string;
  /** Allow any additional form fields the upload might include */
  [field: string]: string;
}

export async function uploadFilesToR2(
  presignedList: R2PresignedPost[],
  files: File[]
) {
  if (presignedList.length !== files.length) {
    throw new Error("presignedList 與 files 長度不一致");
  }

  return Promise.all(
    presignedList.map(async (presigned, idx) => {
      const file = files[idx];

      // ① 建立 FormData
      const fd = new FormData(); // 建立容器 :contentReference[oaicite:1]{index=1}

      // ② 將簽名欄位逐一 append
      for (const [k, v] of Object.entries(presigned.fields)) {
        fd.append(k, v); // 必須全部帶上 :contentReference[oaicite:2]{index=2}
      }

      // ③ 再把檔案本體放入，欄位名固定為 "file"
      fd.append("file", file, file.name); // S3/R2 規範 :contentReference[oaicite:3]{index=3}

      // ④ 送出 POST
      const res = await fetch(presigned.url, { method: "PUT", body: fd });

      // ⑤ 判斷是否成功
      if (!res.ok) {
        // 建議同時檢查 ok 與 status :contentReference[oaicite:4]{index=4}
        const errorXml = await res.text(); // ← 把 R2 給的 XML 看清楚
        console.error("R2 error:", res.status, errorXml);
        throw new Error(`Upload failed: ${file.name}; status ${res.status}`);
      }

      return {
        key: presigned.fields.key, // 檔案路徑
        etag: res.headers.get("etag") ?? null, // S3/R2 回傳的 etag，可供驗證
      };
    })
  );
}
