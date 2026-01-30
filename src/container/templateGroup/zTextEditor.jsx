
import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function ZTextEditor({ content, onChange }) {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "blockquote", "code-block",
    "list", "bullet", "indent",
    "link", "image", "video",
    "color", "background", "align", "size", "script", "direction"
  ];

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={content}   
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="h-[200px]"
      />
    </div>
  );
}
