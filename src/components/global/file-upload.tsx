"use client";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import { Dispatch, useState } from "react";

import supabaseBrowserClient from "@/lib/supabase/supabase-client";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import Tus from "@uppy/tus";
import { useRouter } from "next/navigation";

const folder = "";
const supabaseStorageURL = `https://prgbwpzcwoxdqzqzvhdh.supabase.co/storage/v1/upload/resumable`;

interface FileUploadProps {
  dispatch: Dispatch<{
    type: string;
    payload: any;
  }>;
}
export default function FileUpload({ dispatch }: FileUploadProps) {
  const router = useRouter();
  const [uppy] = useState(() =>
    new Uppy().use(Tus, {
      endpoint: supabaseStorageURL,
      async onBeforeRequest(req) {
        const supabase = supabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        req.setHeader("Authorization", `Bearer ${data.session?.access_token}`);
      },
      allowedMetaFields: [
        "bucketName",
        "objectName",
        "contentType",
        "cacheControl",
      ],
    }),
  );
  uppy.on("file-added", (file) => {
    const supabaseMetadata = {
      bucketName: "product_upload",
      objectName: folder ? `${folder}/${file.name}` : file.name,
      contentType: file.type,
    };

    file.meta = {
      ...file.meta,
      ...supabaseMetadata,
    };
  });

  uppy.on("complete", (result) => {
    console.log(
      "Upload complete! We’ve uploaded these files:",
      result.successful,
    );

    const posts = result.successful.map((post: any) => {
      return {
        name: post.name,
        image: `https://prgbwpzcwoxdqzqzvhdh.supabase.co/storage/v1/object/public/product_upload/${post.name}`,
      };
    });

    dispatch({ type: "SET_IMAGES", payload: posts });

    router.refresh();
  });

  return <Dashboard uppy={uppy} />;
}
