const foodpartnerModel = require('../models/foodpartner.model');


async function getFoodPartnerById(req, res) {
   
        const foosPartnerId = req.params.id;


        const foodPartner = await foodpartnerModel.findById(foosPartnerId)

        if (!foodPartner) {
            return res.status(404).json({ message: 'Food Partner not found' });
        }   

        res.status(200).json({
            message: 'Food Partner fetched successfully',
             foodPartner
        });


}


module.exports = {
    getFoodPartnerById,
};