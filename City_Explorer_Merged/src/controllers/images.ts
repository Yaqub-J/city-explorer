// import upload from '../config/multer'; // Importing your multer configuration
// const cloudinary = require('cloudinary').v2;

// const uploadImages = async (req: any, res: any): Promise<any> => {
// //   return new Promise((resolve, reject) => {

//     // const fieldName = req.body.imageType
//     // upload.single('file')(req, res, async (err: any) => {
    
//     //   if (!req.files|| req.file.length === 0) {
//     //     return reject({ message: 'No images provided' });
//     //   }

//       try {
//         // const uploadResults = await Promise.all(
//         // //   req.files.map(async (file: any) => {
//         //     const result = await cloudinary.uploader.upload(req.files.path, {
//         //       folder: req.body.imageType || 'general',
//         //     });
//         //     return {
//         //       url: result.secure_url,
//         //       public_id: result.public_id,
//         //     };
//         // //   })
//         // );
//         const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//             folder: req.body.imageType || 'general', // Use 'imageType' from the request body to determine folder
//         });
        
//         return {
//             url: uploadResult.secure_url,
//             public_id: uploadResult.public_id,
//         };

//         // resolve(uploadResults);
//       } catch (error: any) {
//         return res.status(500).send({ message: error.message });
//       }
//     // });
// //   });
// };

// export default uploadImages;
