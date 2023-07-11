import express from "express";
import {
  isValidUrl,
  filterImageFromURL,
  deleteLocalFiles,
} from "./util/util.js";
import ApiError from "./util/ApiError.js";
import path from "path";

// Toggle this flag to print console.log messages
export const DEBUG = true;

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the express.json middleware for post requests
app.use(express.json());

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

/**************************************************************************** */

app.get("/filteredimage", async (req, res, next) => {
  let filteredImagePath = "";
  try {
    const { image_url } = req.query;

    if (!image_url || !isValidUrl(image_url)) {
      throw new ApiError(
        400,
        "Provide a valid `image_url`: URL of a publicly accessible image"
      );
    }

    filteredImagePath = await filterImageFromURL(image_url);
    DEBUG &&
      console.log(
        "🚀 ~ file: server.js:52 ~ app.get ~ filteredImagePath:",
        filteredImagePath
      );

    res.sendFile(path.resolve(filteredImagePath), (err) => {
      if (err) {
        next(new ApiError(500, err.message));
      }
    });
  } catch (err) {
    next(err);
  } finally {
    DEBUG &&
      console.log(
        "🚀 ~ file: server.js:66 ~ app.get ~ Clean up files in finally block.."
      );
    res.on("finish", async () => {
      if (filteredImagePath) {
        await deleteLocalFiles([path.resolve(filteredImagePath)]);
      }
    });
  }
});

//! END @TODO1

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

// Error handling middleware functionality
app.use((error, request, response, next) => {
  DEBUG && console.log("🚀 ~ file: server.js:86 ~ app.use ~ error:", error);
  const code = error.status || 500;
  response.status(code).json({
    status: code,
    message: error.message || `Internal Server Error!`,
  });
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
