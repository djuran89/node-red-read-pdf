"use strict";
module.exports = function(RED) {
    const fs = require('fs');
    const path = require('path');
    const pdf = require("pdf-parse");
    const PDFParser = require("pdf2json");

    const readFile = (filePath) => {
        const isFileExist = fs.existsSync(filePath);
        const ext = path.extname(filePath).toLocaleLowerCase();
        if (!isFileExist) throw new Error("File don't exist.");
        if (ext !== ".pdf") throw new Error("File is not pdf.");

        return fs.readFileSync(filePath);
    };

    const runPDFParse = async (dataBuffer) => (await pdf(dataBuffer));

    const runPDF2JSON = async (dataBuffer) => {
        const pdfParser = new PDFParser();
        pdfParser.parseBuffer(dataBuffer);

        return new Promise((resolve, reject) => {
            pdfParser.on("pdfParser_dataReady", pdfData => {
                delete pdfData.Transcoder;
                resolve(JSON.parse(unescape(decodeURI(JSON.stringify(pdfData)))))
            });
            pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        });
    }

    const errorHandler = (err) => {
        let errMsg = err.message || err;
        if (errMsg.includes('Error: ')) errMsg = errMsg.split("Error: ")[1];
        if (errMsg.includes('Invalid XRef stream header')) errMsg = "File is not pdf.";

        return errMsg;

    }

    function output(config) {
        const node = this;
        RED.nodes.createNode(this, config);

        node.on('input', async function(msg) {
            try {
                const input = msg.payload;
                const filename = config.filename;
                const advance = config.advance;
                const isBuffer = Buffer.isBuffer(input);
                const dataBuffer = isBuffer ? input : readFile(filename, node);

                node.status({ fill: 'blue', shape: 'dot', text: "Converting..." });
                const pdfData = advance ? await runPDF2JSON(dataBuffer) : await runPDFParse(dataBuffer);
                
                msg.payload = pdfData;
                node.status({});
                node.send(msg);
            } catch (err) {
                const errMsg = errorHandler(err, node);
                node.status({ fill: 'red', shape: 'dot', text: errMsg });
                node.error(errMsg, msg);
            }
        });
    }

    RED.nodes.registerType("read-pdf", output);
};
