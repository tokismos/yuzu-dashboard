import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

const DropZone = () => {
  const [files, setFiles] = useState([]);
  const baseStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    backgroundColor: "gray",
    color: "white",
    transition: "border .24s ease-in-out",
    height: "100%",
    width: "100%",
  };
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const images = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          src={file.preview}
          style={{
            width: "200px",
            height: "200px",
            objectFit: "contain",
          }}
          alt="preview"
        />
      </div>
    </div>
  ));

  return (
    <div
      style={{
        flexDirection: "row",
        display: "flex",
        width: "100%",
        height: "35%",
        alignItems: "center",
      }}
    >
      <div {...getRootProps({ style: baseStyle })}>
        <input {...getInputProps()} />
        <p>Drop files here</p>
      </div>
      <div>{images}</div>
    </div>
  );
};
export default DropZone;
