import React, { Component } from "react";
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import styles from "./SongsUploadBox.module.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginMediaPreview from "filepond-plugin-media-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Message from "../Message/Message";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginMediaPreview
);

// Our app
class SongsUploadBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      message: null,
    };
  }

  handleOnUpload(error, res) {
    if (error) {
      console.log("Error Occured");
    } else {
      console.log(res);
      // this.state.files.push(res.info.fileName);
      // this.setState({ message: res.message });
    }
  }

  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

  render() {
    console.log(this.state.files);
    return (
      <div className={styles.uploadbox}>
        {/* Pass FilePond properties as attributes */}
        <FilePond
          ref={(ref) => (this.pond = ref)}
          files={this.state.files}
          allowMultiple={true}
          maxFiles={5}
          name={"singlesong"}
          allowReorder={true}
          instantUpload={false}
          labelIdle={
            'Drag & Drop your Songs or <span class="filepond--label-action"> Browse </span>'
          }
          server={"/user/uploadsong"}
          oninit={() => this.handleInit()}
          onupdatefiles={(fileItems) => {
            this.setState({
              files: fileItems.map((fileItem) => fileItem.file),
            });
          }}
          onprocessfile={(error, res) => {
            this.handleOnUpload(error, res);
          }}
        ></FilePond>
        {this.state.message ? <Message message={this.state.message} /> : null}
      </div>
    );
  }
}

export default SongsUploadBox;
