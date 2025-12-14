const ImageKit = require("imagekit");

const imageKit = new ImageKit({ 
    publicKey: process.env.IMAGEKIT_Public_Key,
    privateKey: process.env.IMAGEKIT_Private_Key,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file,fileName) {
    const result = await imageKit.upload({
        file: file, //required
        fileName: fileName, //required
    });
    return result;
}


module.exports = {
    uploadFile,
};