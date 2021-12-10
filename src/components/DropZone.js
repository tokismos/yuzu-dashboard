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
    height: "200px",
    width: "400px",
    marginRight: "20px",
  };
  const { getRootProps, getInputProps } = useDropzone({
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
    <div className="drag">
      <div {...getRootProps({ style: baseStyle })}>
        <input {...getInputProps()} />
        <p>Drop files here</p>
      </div>
      <div>{images}</div>
    </div>
  );
};
export default DropZone;
