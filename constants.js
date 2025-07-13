export const FILE_TYPE_OPTIONS = [
  {
    value: "all",
    label: "모든 형식",
    extensions: [],
  },
  {
    value: "image",
    label: "이미지 (JPG, PNG, GIF 등)",
    extensions: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff", "ico"],
  },
  {
    value: "pdf",
    label: "PDF",
    extensions: ["pdf"],
  },
  {
    value: "doc",
    label: "문서 (DOC, TXT 등)",
    extensions: ["doc", "docx", "txt", "rtf", "odt", "md", "tex"],
  },
  {
    value: "spreadsheet",
    label: "스프레드시트 (XLS, CSV 등)",
    extensions: ["xls", "xlsx", "csv", "ods", "tsv"],
  },
  {
    value: "presentation",
    label: "프레젠테이션 (PPT 등)",
    extensions: ["ppt", "pptx", "odp", "key"],
  },
  {
    value: "video",
    label: "영상 (MP4, AVI 등)",
    extensions: ["mp4", "mov", "avi", "mkv", "webm", "wmv", "flv", "mpeg"],
  },
  {
    value: "audio",
    label: "음성 (MP3 등)",
    extensions: ["mp3", "wav", "m4a", "aac", "flac", "ogg"],
  },
  {
    value: "archive",
    label: "압축 파일 (ZIP 등)",
    extensions: ["zip", "rar", "7z", "tar", "gz", "bz2", "xz", "iso"],
  },
  {
    value: "code",
    label: "코드 파일 (JS, HTML 등)",
    extensions: [
      "js",
      "ts",
      "jsx",
      "tsx",
      "html",
      "css",
      "scss",
      "sass",
      "json",
      "yaml",
      "yml",
      "py",
      "java",
      "c",
      "cpp",
      "cs",
    ],
  },
];
