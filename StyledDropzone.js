import React from 'react';
import Dropzone from 'react-dropzone';

const imageTypes = [
  'image/bmp',
  'image/gif',
  'image/vnd.microsoft.icon',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp'
]; // list of images MIME types

export default class StyledDropzone extends React.Component {
  state = { previewFiles: [], uploadText: '' };

  onDrop = acceptedFiles => {
    console.log(acceptedFiles);
    const filesArray = [];
    acceptedFiles.forEach(file => {
      let objPreview;
      if (imageTypes.includes(file.type)) {
        objPreview = Object.assign(file, {
          preview: URL.createObjectURL(file)
        });
      } else {
        objPreview = file;
      }
      filesArray.push(objPreview);
    });
    this.setState({ previewFiles: filesArray, uploadText: '' });
  };

  removeOneFileFromArray = (currentArray, index) => {
    currentArray.splice(index, 1);
    this.setState({ previewFiles: currentArray });
  };

  removeAllFilesFromArray = () => {
    this.setState({ previewFiles: [] });
  };

  handleDrop = async () => {
    const postUrl = this.props.postUrl || 'https://httpbin.org/post'; // insert your API location
    const inputName = this.props.inputName || 'file2upload'; // insert multer name used in server
    const apiKey = this.props.apiKey || false; // insert apiKey if needed
    const formData = new FormData();
    this.state.previewFiles.forEach(file => {
      formData.append(inputName, file);
    });
    // add Api Key to body
    if (apiKey) {
      formData.append('apiKey', apiKey);
    }
    try {
      const response = await fetch(postUrl, {
        method: 'POST',
        body: formData
      });
      const resData = await response.json();
      console.log(resData);
      alert(`files posted to: ${resData.url}`);
      if (resData) {
        this.setState({ previewFiles: [], uploadText: 'Files Uploaded!' });
      } else {
        this.setState({ uploadText: 'Upload Error' });
      }
    } catch (err) {
      // catches errors both in fetch and response.json
      console.error('upload error', err);
    }
  };

  render() {
    const currentArray = this.state.previewFiles;
    const fileMaxSize = this.props.fileMaxSize || 10485760;
    const fileMinSize = this.props.fileMinSize || 1;
    const thumbs = currentArray.map((file, index) => (
      <div key={file.name}>
        <div style={thumb}>
          <div style={thumbInner}>
            <img
              alt="thumb"
              src={
                file.preview ||
                'https://imgplaceholder.com/100x100/cccccc/757575/glyphicon-open-file'
              }
              style={img}
            />
          </div>
        </div>
        <p style={thumbtext}>{file.name}</p>
        <a
          onClick={() => this.removeOneFileFromArray(currentArray, index)}
          style={{ color: 'red', cursor: 'pointer' }}
        >
          remove
        </a>
      </div>
    ));
    return (
      <Dropzone
        maxSize={fileMaxSize}
        minSize={fileMinSize}
        multiple
        onDrop={this.onDrop}
      >
        {({
          getRootProps,
          getInputProps,
          isDragActive,
          isDragReject,
          rejectedFiles
        }) => {
          const isFileTooLarge =
            rejectedFiles.length > 0 && rejectedFiles[0].size > fileMaxSize;
          return (
            <span>
              <div
                {...getRootProps()}
                style={!isDragActive ? dropzoneAreaIdle : dropzoneAreaHot}
              >
                {isDragActive && !isDragReject && (
                  <span style={dropzoneText}>
                    <p>Drop it like it's hot!</p>
                  </span>
                )}
                <input {...getInputProps()} />
                {!isDragActive && currentArray.length <= 0 && (
                  <span>
                    <p>Click here or drop a file to upload!</p>
                  </span>
                )}
                {!isDragActive && currentArray.length > 0 && (
                  <span>
                    <p>choose Cancel or Upload</p>
                  </span>
                )}
                {isDragReject && (
                  <h2 style={{ color: 'red' }}>
                    File type not accepted, sorry!
                  </h2>
                )}
                {isFileTooLarge && (
                  <h2 style={{ color: 'red' }}>Too large files excluded.</h2>
                )}
                {this.state.uploadText !== '' && (
                  <h2 style={{ color: 'orange' }}>{this.state.uploadText}</h2>
                )}
              </div>
              <div style={{ textAlign: 'center', paddingTop: 5 }}>
                <div>
                  <button
                    disabled={currentArray.length <= 0}
                    onClick={this.removeAllFilesFromArray}
                  >
                    Cancel
                  </button>
                  <span> OR </span>
                  <button
                    disabled={currentArray.length <= 0}
                    onClick={this.handleDrop}
                  >
                    Upload
                  </button>
                </div>
                <aside style={thumbsContainer}>{thumbs}</aside>
              </div>
            </span>
          );
        }}
      </Dropzone>
    );
  }
}

/*Drop Zone CSS start*/
const dropzoneAreaIdle = {
  /*
  comment area
  */
  background: 'rgba(0, 0, 0, 0)',
  outline: 'none',
  padding: '30px',
  border: '2px dashed rgb(187, 186, 186)',
  borderRadius: '20%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  fontSize: '16px',
  textAlign: 'center'
};

const dropzoneAreaHot = {
  /*
  comment area
  */
  background: 'rgba(0, 0, 0, 0)',
  outline: 'none',
  padding: '30px',
  border: '2px dashed orange',
  borderRadius: '20%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  fontSize: '16px',
  textAlign: 'center'
};

const dropzoneText = {
  /*
  comment area
  */
  color: 'orange',
  zIndex: '-1'
};

const thumbsContainer = {
  display: 'flex',
  textAlign: 'center',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbtext = {
  overflowWrap: 'break-word',
  display: 'block',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

/*Drop Zone CSS end*/
