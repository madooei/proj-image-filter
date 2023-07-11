import fs from "fs";
import Jimp from "jimp";
import { URL } from "url";
import { DEBUG } from "../server.js";
import ApiError from "./ApiError.js";

// isValidUrl
// helper function to check if a url is valid
// returns true if the input is a valid url and false otherwise
// INPUTS
//    inputURL: string - a publicly accessible url
// RETURNS
//    boolean indicating fi the inputURL is valid or not
export function isValidUrl(inputURL) {
  try {
    new URL(inputURL);
    return true;
  } catch (err) {
    DEBUG && console.log("🚀 ~ file: util.js:19 ~ isValidUrl ~ err:", err);
    return false;
  }
}

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath =
        "tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, (img) => {
          resolve(outpath);
        });
    } catch (error) {
      DEBUG &&
        console.log(
          "🚀 ~ file: util.js:47 ~ filterImageFromURL ~ error:",
          error
        );
      reject(new ApiError(422, "The image could not be processed!"));
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
  for (let file of files) {
    DEBUG &&
      console.log("🚀 ~ file: util.js:63 ~ deleteLocalFiles ~ file:", file);
    fs.unlinkSync(file);
  }
}
