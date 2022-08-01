## About

Create node for node-red to parse pdf file.

## Install

Run the following command in the root directory of your Node-RED install:

````
npm i node-red-read-pdf
````

## Inputs
#### payload
Buffer object that corresponds to a pdf file or a filepath leading to a pdf file.	

## Outputs
#### payload
### Normal mode
Results of the parsing will be returned the object corresponding to a pages in the pdf.
```
{
    numpages: <number> Number of pages,
    numrender: <number> Number total page,
    info: {
        PDFFormatVersion: <string> PDFFormatVersion,
        IsAcroFormPresent: <bool> false,
        IsXFAPresent: <bool> false,
        Creator: <string> Creator,
        Producer: <string> Producer,
        CreationDate: <string> CreationDate
    },
    metadata: <unknown> null,
    text: <string> PDF content,
    version: <string> Version PDF
}
```

### Advance mode for
```
{
    "Meta": { 
        "PDFFormatVersion": <string> PDF foramt version, 
        "IsAcroFormPresent": <bool> false, 
        "IsXFAPresent": <bool> false, 
        "Author": <string> Author, 
        "Creator": <string> Creator, 
        "Producer": <string> Producer, 
        "CreationDate": <string> Date, 
        "Metadata": <object> {} 
    },
    "Pages": [
        {
            "Width": <number> Page width,
            "Height": <number> Page height,
            "HLines": <object[]> Horizontal lines,
            "VLines": <object[]> Vertical lines,
            "Fills": <object[]> Fills,
            "Texts": <object[]> PDF content,
            "Fields": <object[]> Fields,
            "Boxsets": <object[]> Boxsets,
        }
    ]
}
```# node-red-read-pdf
