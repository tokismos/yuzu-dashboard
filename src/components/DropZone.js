import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactPlayer from "react-player";

const DropZone = ({ form, setForm, video }) => {
  const [files, setFiles] = useState([]);
  const [img, setImg] = useState("");

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
    accept: !video ? "image/*" : "video/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map(async (file) => {
          const tmp = { ...form };
          if (video) {
            tmp.videoURL = file;
          } else {
            tmp.imgURL = file;
          }
          console.log("formtmp ", file.name);
          setImg(URL.createObjectURL(file));
          setForm(tmp);
        })
      );
    },
  });

  const images = files.map((file) => (
    <div key={file?.name}>
      <div>
        {file.name}
        <img
          src={typeof form.imgURL !== "object" ? form.imgURL : img}
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
  const videoComponent = files.map((file) => (
    <div key={file?.name}>
      <div>
        <ReactPlayer url={img} controls={true} width="200px" height="200px" />
      </div>
    </div>
  ));

  return (
    <div
      style={{
        flexDirection: "row",
        display: "flex",
        width: "100%",
        height: "25%",
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: "50px",
      }}
    >
      <div {...getRootProps({ style: baseStyle })}>
        <input {...getInputProps()} />
        <p>Drop files here</p>
      </div>
      {video ? <div>{videoComponent}</div> : <div>{images}</div>}
    </div>
  );
};
export default DropZone;
