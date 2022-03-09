const AWS = require('aws-sdk');
const multer = require('multer');
const multers3 = require('multer-s3');
require('dotenv').config();

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId =  process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY


const s3 = new AWS.S3({
  region: region,
  secretAccessKey: secretAccessKey,
  accessKeyId: accessKeyId
});

// uploads file to s3

var upload = multer({
    storage: multers3({
      s3: s3,
      bucket: bucketName,
      contentType: multers3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        // console.log("This is done!!");
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        path = req.body.title
        let filetype = file.mimetype.split("/")
        console.log(filetype[-1])
        cb(null, `${path}/`+Date.now().toString() + '.' + filetype[filetype.length - 1])
      }
    })
  })

  exports.upload = upload

// getting images from s3.

// async function getImages(title){
//   try{
//     console.log(title)
//     const response = await s3.listObjectsV2({
//       Bucket: bucketName,
//       Prefix: `${title} /`
//     }).promise();
//     var href = this.request.httpRequest.endpoint.href;
//     console.log(href)
//     console.log(response.Contents);
//   }
//   catch (e){
//     console.log(e)
//   }
//   }
//   exports.getImages = getImages