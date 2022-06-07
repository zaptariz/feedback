//required modules and packages
const router = require('express').Router();
const {adds} = require('../models/AddsModel');


//to create add
const createadds = async (req, res) => {
    try {
        
        let request = req.body
        let payload = {
            title: request.title ? request.title : "",
            content: request.content,
            starttime: request.starttime,
            endtime: request.endtime
        }
        
        await new adds(payload).save()
        return res.status(200).send('Add created successfully')
    }
    catch (error) {
        console.log(error.message)
        return res.status(400).json(error.message)
    }
}
//to show the adds
const showAdd = async (req, res) => {
    try {
        let date = new Date();
        let advertisements = await adds.find({
            //aggregation were used for checking the adds times
            'starttime': { $lte: date },
            'endtime': { $gte: date },
            is_active: true
        });
        //to check there 'advertisements' is empty or not
        if (advertisements.length == 0) {
            return res.status(200).json([{ title: 'There is no ads, Contact to show your ad here' }])
        }
        return res.status(200).json(advertisements)
    }
    catch (error) {
        return res.status(200).send(error.message)
    }
}
//Update the exisiting adds using the _id
const updateAdd = async (req, res) => {
    try {
        let params = req.params.id
        let payload = req.body
        console.log(params, " ", payload)
        let check_data = await adds.findOneAndUpdate({ _id: params }, payload)
        check_data+= JSON.stringify(check_data)
        if(check_data.length != 0)
            return res.status(200).json('update successfully')
        else 
            res.status(401).send('There is no add in the given ID')
    } catch (error) {
        return res.status(400).send(error.message)
    }
}
//delete the add 
const deleteAdd = async (req, res) => {
    try {
        if(req.body.title){
        let response = await adds.deleteOne({title:req.body.title})
        if(response.deletedCount == 0){
            res.status(404).send('There is no add in the name ')
        }
        else res.status(200).send(' add deleted successfully ')}
    } catch (error) {
        return res.send(error.message).status(400)
    }
}

//this is another method of export the modules
module.exports = {
    createadds,
    showAdd,
    updateAdd,
    deleteAdd
}