import express from "express";
import { createClient } from '@supabase/supabase-js'
import cors from "cors";

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://whkhxoqclrbwsapozcsx.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indoa2h4b3FjbHJid3NhcG96Y3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MjI2OTMsImV4cCI6MjA0NjQ5ODY5M30.r9sVK-h_VhWEaFcpbItsegw3C3ColewPJMqad1xJXkk';
const supabase = createClient(supabaseUrl, supabaseKey)


const app = express()
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Retrieve all the feedback from the database
app.get("/", async (req, res) => {

    const { data, error } = await supabase
        .from('07_feedback')
        .select()

    if (error) {
        console.log(error.message)
    }

    return res.status(200).json({ sucess: true, data: data });
})

// Insert new feedback row to the database
// Req.body = {
//    "user_id": 2, - id of user submitting the feedback
//    "rating": 1, - rating between 1-5
//    "comments": "comment for the product"
//    "is_anonymous": False - boolean, true if anonymous is selected
// }
app.post("/feedback", async (req, res) => {
    let user_id = req.body.user_id;
    const rating = req.body.rating;
    const comments = req.body.comments;
    let is_anonymous = req.body.is_anonymous;

    if (is_anonymous == undefined) {
        is_anonymous = false;
    }
    if (user_id == undefined) {
        user_id = null;
        is_anonymous = true
    }

    const { data, error } = await supabase
        .from('07_feedback')
        .insert([
            { user_id, rating, comments, is_anonymous },
        ])
        .select()

    if (error) {
        console.log(error.message)
    }

    //TODO: @Farhan add an entry to the rewards table for the user



    return res.status(200).json({ sucess: true, data: data });
})


app.listen(3000, () => {
    console.log("server running on port 3000");
})