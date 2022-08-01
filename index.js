"use strict";
module.exports = function(RED) {
    const fs = require('fs');
    const pdf = require("pdf-parse");
    const PDFParser = require("pdf2json");

    const readFile = (filePath) => {
        const isFileExist = fs.existsSync(filePath);
        if (!isFileExist) throw new Error("File don't exist.");

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

    function output(config) {
        const node = this;
        RED.nodes.createNode(this, config);

        node.on('input', async function(msg) {
            try {
                const input = msg.payload;
                const filename = config.filename;
                const advance = config.advance;
                const isBuffer = Buffer.isBuffer(input);

                node.status({ fill: 'blue', shape: 'dot', text: "Reading file..." });
                const dataBuffer = isBuffer ? input : readFile(filename, node);

                node.status({ fill: 'blue', shape: 'dot', text: "Converting..." });
                const pdfData = advance ? await runPDF2JSON(dataBuffer) : await runPDFParse(dataBuffer);
                node.status({});

                msg.payload = pdfData;
                node.send(msg);
            } catch (err) {
                node.status({ fill: 'red', shape: 'dot', text: err.message });
                node.error(err.message, msg);
            }
        });
    }

    RED.nodes.registerType("read-pdf", output);
};
