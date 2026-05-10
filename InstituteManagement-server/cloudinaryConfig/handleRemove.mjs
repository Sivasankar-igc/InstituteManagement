import { v2 as cloudinary } from "cloudinary"
import cloudinaryConfig from "./config.mjs"

cloudinary.config(cloudinaryConfig)

export default (pdfURLs) => {

    pdfURLs.forEach(pdfURL => {
        let publicId = pdfURL.split("/")[7];

        cloudinary.uploader.destroy(publicId, { resource_type: "raw" }, function (error, result) {

            if (error) {
                console.log('Error deleting pdf:', error);
            } else {
                console.log(result)
            }
        });
    })
}