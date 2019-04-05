import React from 'react';
import Dropzone from 'react-dropzone';
// custom imports

// props list
//    maxSize
//    minSize
//    apiKey
//    apiUrl
//    customFormData
//    fileType
//    inputName
//    keepFiles
//    getFormData -> get 'formData'
//    getResData -> get 'uploadResponse'

const imageTypes = [
  'image/bmp',
  'image/gif',
  'image/vnd.microsoft.icon',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp'
]; // list of MIME types https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types

export default class DropzoneUpload extends React.Component {
  state = { previewFiles: [], uploadText: '', uploading: false };

  // Make sure to revoke the data uris to avoid memory leaks
  // clearPreviews = filesArray => {
  //   const cleanArray = [];
  //   filesArray.forEach(file => {
  //     URL.revokeObjectURL(file.preview);
  //     cleanArray.push(file);
  //   });
  //   this.setState({ previewFiles: cleanArray });
  // };

  onDropLog = acceptedFiles => {
    console.log(acceptedFiles);
  };

  onDrop = acceptedFiles => {
    //console.log(acceptedFiles);
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
    this.setState({ uploading: true });
    const apiUrl = this.props.apiUrl || 'https://httpbin.org/post'; // insert your API location
    const inputName = this.props.inputName || 'file2upload'; // insert multer name used in server
    const apiKey = this.props.apiKey || false; // insert apiKey if needed
    const customFormData = this.props.customFormData || false; // append formdata 'customFormData' if needed
    const keepFiles = this.props.keepFiles || false; // clear uplaoded files on success
    const getFormData = this.props.getFormData || false; // clear uplaoded files on success
    const getResData = this.props.getResData || false; // clear uplaoded files on success

    const formData = new FormData();
    if (apiKey) {
      formData.append('apiKey', apiKey);
    }
    if (customFormData) {
      //console.log('this.props.customFormData', this.props.customFormData);
      formData.append('customFormData', customFormData);
    }
    this.state.previewFiles.forEach(file => {
      formData.append(inputName, file);
    });
    try {
      if (getFormData) {
        this.props.getFormData('formData', formData);
      }
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });
      const resData = await response.json();
      // console.log('upload response:', response);
      // console.log('upload resData:', resData);
      if (response.status === 200) {
        if (keepFiles) {
          this.setState({ uploadText: 'Files Uploaded', uploading: false });
        } else {
          this.setState({
            previewFiles: [],
            uploadText: 'Files Uploaded',
            uploading: false
          });
        }
        // trigger parent redux action
        // if (reduxAction) {
        //   reduxAction(resData);
        // }
        if (getResData) {
          getResData('uploadResponse', resData);
        }
      } else {
        const errorList = [];
        resData.forEach(error => errorList.push(error.message));
        this.setState({ uploadText: errorList, uploading: false });
      }
    } catch (err) {
      // catches errors both in fetch and response.json
      console.error('upload error', err);
      this.setState({ uploadText: 'Upload Server Error', uploading: false });
    }
  };

  render() {
    //console.log('drop state', this.state);
    const maxSize = this.props.maxSize || 104857600; // 10485760 = 10MB - 5242880 = 5MB
    const minSize = this.props.minSize || 1; // 10485760 = 10MB - 5242880 = 5MB
    const currentArray = this.state.previewFiles;
    const thumbs = currentArray.map((file, index) => (
      <div key={file.name}>
        <div style={thumb}>
          <div style={thumbInner}>
            <img alt="thumb" src={file.preview || 'static/img/glyphicon-open-file.png'} style={img} />
          </div>
        </div>
        <p style={thumbtext}>{file.name}</p>
        <a onClick={() => this.removeOneFileFromArray(currentArray, index)} style={{ color: 'red', cursor: 'pointer' }}>
          remove
        </a>
      </div>
    ));

    return (
      <Dropzone accept={this.props.fileType || ''} maxSize={maxSize} minSize={minSize} multiple onDrop={this.onDrop}>
        {({ getRootProps, getInputProps, isDragActive, isDragReject, rejectedFiles }) => {
          const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;
          return (
            <span>
              <div {...getRootProps()} style={!isDragActive ? dropzoneAreaIdle : dropzoneAreaHot}>
                {isDragActive && !isDragReject && (
                  <span style={dropzoneText}>
                    <p>Drop it here!</p>
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
                {isDragReject && <h3 style={{ color: 'red' }}>Wrong file type!</h3>}
                {isFileTooLarge && <h2 style={{ color: 'red' }}>File is too large.</h2>}
                {this.state.uploadText !== '' && <h2 style={{ color: 'orange' }}>{this.state.uploadText}</h2>}
              </div>
              <div style={{ textAlign: 'center', paddingTop: 5 }}>
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
