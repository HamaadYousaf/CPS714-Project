import express from "express";
import { createClient } from '@supabase/supabase-js'
import cors from "cors";
import  OpenAI  from "openai";
// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://whkhxoqclrbwsapozcsx.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indoa2h4b3FjbHJid3NhcG96Y3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MjI2OTMsImV4cCI6MjA0NjQ5ODY5M30.r9sVK-h_VhWEaFcpbItsegw3C3ColewPJMqad1xJXkk';
const supabase = createClient(supabaseUrl, supabaseKey)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

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

  // Retrieve and summarize all feedback from the database
  app.get("/summary", async (req, res) => {
    const { data, error } = await supabase
      .from('07_feedback')
      .select('rating, comments');
  
    if (error) {
      console.log(error.message);
      return res.status(500).json({ success: false, message: "Error retrieving feedback" });
    }
  
    // Create the prompt with all feedback concatenated
    const feedbackText = data.map(entry => `Rating: ${entry.rating}\nComments: ${entry.comments}`).join('\n\n');
    let summary = '';
    try {
      const gptPrompt = `Please summarize the following feedback stating the number of positive and negative reviews and how users describe the reviews:\n${feedbackText}`;
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: gptPrompt,
        max_tokens: 100,  // Adjust max_tokens as needed
      });
      summary = response.choices[0].text.trim();
    } catch (error) {
      console.error('Error generating summary:', error.message);
      return res.status(500).json({ success: false, message: "Error generating summary" });
    }
  
    // Return the summary along with the original data
    return res.status(200).json({ success: true, data: data, summary: summary });
  });
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

    // Everytime a review is submitted, add 5 points for the user in the database
    if (user_id !== null) {
      const { data: rewardData, error: rewardError } = await supabase
          .from('rewards')
          .select('points')
          .eq('user_id', user_id)
          .single();

      if (rewardError && rewardError.code !== 'PGRST116') {
          console.log(rewardError.message);
      } else {
          const newPoints = (rewardData?.points || 0) + 5;

          const { error: updateError } = await supabase
              .from('rewards')
              .update({ points: newPoints })
              .eq('user_id', user_id);

          if (updateError) {
              console.log(updateError.message);
          }
      }
  }


    return res.status(200).json({ sucess: true, data: data });
})


app.listen(3000, () => {
    console.log("server running on port 3000");
})
