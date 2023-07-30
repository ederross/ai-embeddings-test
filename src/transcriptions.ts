require("dotenv").config();

import path from "node:path";

import axios from "axios";
import fs from "fs";

import FormData from "form-data";
const model = "whisper-1";

import { v4 as uuidv4 } from "uuid";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const filePath = path.resolve(__dirname, "../audios/teste.mp3");

const formData = new FormData();
formData.append("model", model);
formData.append("file", fs.createReadStream(filePath));

axios
  .post("https://api.openai.com/v1/audio/transcriptions", formData, {
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": `multipart/form-data; boundary=${formData.getBoundary}`,
    },
  })
  .then((response) => {
    const transcription = JSON.stringify(response.data);
    const uid = uuidv4();
    const outputFile = path.resolve(__dirname, `../tmp/${uid}.json`);
    fs.writeFile(outputFile, transcription, (err) => {
      if (err) {
        console.error("Erro ao gravar o arquivo:", err);
      } else {
        console.log("Transcrição gravada com sucesso!");
      }
    });
  })
  .catch((error) => console.log("errorrr", error));
