"use client";

import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";

interface TinyEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  height?: number;
  form?: {
    setValue: (field: string, value: any, options?: { shouldValidate: boolean }) => void;
  };
}

export default function TinyEditor({ value, onChange, height = 500, form }: TinyEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [editorHtml, setEditorHtml] = useState<string>(value || "");

  const apiKey =
    
    "f9vyr6bvjrdk58pm79uhtqx1lv47v10wdlzsrypaok84krev";

  useEffect(() => {
    if (value !== undefined) {
      setEditorHtml(value);
    }
  }, [value]);

  useEffect(() => {
    if (form && value !== undefined) {
      form.setValue("content", editorHtml, {
        shouldValidate: true,
      });
    }
  }, [editorHtml, form, value]);

  return (
    <Editor
      apiKey={apiKey}
      onInit={(_, editor) => {
        editorRef.current = editor;
      }}
      value={value === undefined ? undefined : editorHtml}
      onEditorChange={(content) => {
        if (value === undefined) {
          onChange?.(content);
        } else {
          setEditorHtml(content);
        }
      }}
      init={{
        height,
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        branding: false,
        promotion: false,
        image_title: true,
        automatic_uploads: true,
        file_picker_types: "image",
        images_upload_handler: async function (blobInfo) {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject("error while uploading");
            reader.readAsDataURL(blobInfo.blob());
          });
        },
      }}
    />
  );
}
