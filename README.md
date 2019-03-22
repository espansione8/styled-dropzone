# StyledDropzone

A React component built on top of https://react-dropzone.js.org with the following features:

- CSS styling already included and easy to customize
- ready to POST to your API
- Multiple drop
- Auto Previews

### &lt;StyledDropzone />

| property    | type                 | default       | required | purpose                                                                                                                                                                                                    |
| ----------- | -------------------- | ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **postUrl** | string               |               | **Yes**  | API url to POST, use 'https://httpbin.org/post' as example                                                                                                                                                 |
| inputName   | string               | 'file2upload' | No       | Optional form data input name                                                                                                                                                                              |
| disabled    | [boolean&#124;null]  | null          | No       | Null means Dot will automatically determine if this button is disabled. Setting this to true will force the button to be disabled. Setting this to false will prevent the button from ever being disabled. |
| onClick     | [function&#124;null] | null          | No       | Optional callback function that is called after the internal onClick function is called. It is passed the React synthetic event                                                                            |
| **slide**   | number               |               | **Yes**  | There must be a matching &lt;Slide /> component with a matching index property. Example: `<Dot slide={0} />` will match `<Slide index={0} />`                                                              |
