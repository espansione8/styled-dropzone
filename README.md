# StyledDropzone (Work In Progress)

A React component built on top of https://react-dropzone.js.org with the following features:

- CSS styling already included and easy to customize
- ready to POST to your API
- Multiple drop
- Upload confirm
- Review multidrop files and remove items before upload
- Auto Previews if dropped files are images
- auto block files within given sizes ( between numeric range fileMinSize and fileMaxSize )

![](dropzone.gif)

TO DOs:
 - update sample code with new props
 - update readme for new props:
 
maxSize -> 10485760 = 10MB - 5242880 = 5MB
minSize -> 10485760 = 10MB - 5242880 = 5MB
apiKey -> append 'apiKey' to formData
apiUrl -> api url destination
customFormData -> custom data to append
fileType -> accepted file types
inputName -> name for multer
keepFiles -> keep previews after upload
getFormData -> get 'formData'
getResData -> get 'uploadResponse'
  
 

To make it work get the source from https://github.com/espansione8/styled-dropzone/blob/master/StyledDropzone.js
and import it as component as shown in the sample code below:

```JSX
import React from 'react';
import StyledDropzone from '../components/StyledDropzone';

export default class extends React.Component {
  render() {
    return (
      <div>
        <StyledDropzone
          postUrl="https://httpbin.org/post"
          inputName="uploadFile"    // OPTIONAL
          fileMaxSize={10485760}    // OPTIONAL
          fileMinSize={1}           // OPTIONAL
          apiKey="superSecretKey123"// OPTIONAL
        />
      </div>
    );
  }
}
```

### &lt;StyledDropzone />

| property    | type   | default                    | required | purpose                                                                                                                                                |
| ----------- | ------ | -------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **postUrl** | string | 'https://httpbin.org/post' | **Yes**  | API url to POST, use 'https://httpbin.org/post' as example                                                                                             |
| inputName   | string | 'file2upload'              | No       | Optional form data input name                                                                                                                          |
| fileMaxSize | number | 10485760                   | No       | value in Bytes of file max size default is 10485760 Bytes (10MB)                                                                                       |
| fileMinSize | number | 1                          | No       | value in Bytes of file min size default is 1 Byte, no 0 Bytes files                                                                                    |
| apiKey      | string | false                      | No       | if used it will add to your form data body the key 'apiKey' with your apiKey value. Code example: `if (apiKey) { formData.append('apiKey', apiKey); }` |
