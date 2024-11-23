import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";
// Create a single supabase client for interacting with your database
const supabaseUrl = "https://whkhxoqclrbwsapozcsx.supabase.co/";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Retrieve all the feedback from the database
app.get("/", async (req, res) => {
  const { data, error } = await supabase.from("07_feedback").select();

  if (error) {
    console.log(error.message);
  }

  return res.status(200).json({ sucess: true, data: data });
});

// Retrieve and summarize all feedback from the database
app.get("/summary", async (req, res) => {
  const { data, error } = await supabase
    .from("07_feedback")
    .select("rating, comments");

  if (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error retrieving feedback" });
  }

  // Create the prompt with all feedback concatenated
  const feedbackText = data
    .map((entry) => `Rating: ${entry.rating}\nComments: ${entry.comments}`)
    .join("\n\n");
  let summary = "";
  try {
    const gptPrompt = `Please summarize the following feedback stating the number of positive and negative reviews and how users describe the reviews:\n${feedbackText}`;
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: gptPrompt,
      max_tokens: 100, // Adjust max_tokens as needed
    });
    summary = response.choices[0].text.trim();
  } catch (error) {
    console.error("Error generating summary:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error generating summary" });
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
    is_anonymous = true;
  }

  const { data, error } = await supabase
    .from("07_feedback")
    .insert([{ user_id, rating, comments, is_anonymous }])
    .select();

  if (error) {
    console.log(error.message);
    return res.status(400).json({ sucess: false, msg: error.message });
  }
  const { data: activityData, error: activityError } = await supabase
    .from("03_activity_log")
    .insert([
      {
        activity_type: "Feedback Submitted",
        activity_description: comments,
        user_id,
      },
    ])
    .select();

  if (activityError) {
    console.log(activityError.message);
    return res.status(400).json({ sucess: false, msg: activityError.message });
  }

  if (user_id !== null) {
    const { data: pointsData, error: pointsError } = await supabase
      .from("14_user_points")
      .select("points_balance")
      .eq("user_id", user_id)
      .single();

    if (!pointsData) {
      // if usr doesnt already have data, insert
      const { error: insertError } = await supabase
        .from("14_user_points")
        .insert({
          user_id: user_id,
          points_balance: 5, // start with 5 points for a new user
        });

      if (insertError) {
        console.log(insertError.message);
        return res
          .status(400)
          .json({ sucess: false, msg: insertError.message });
      } else {
        console.log("New user points entry created.");
      }
    } else {
      // update points if user exists
      const newPointsBalance = pointsData.points_balance + 5;

      const { error: updateError } = await supabase
        .from("14_user_points")
        .update({ points_balance: newPointsBalance })
        .eq("user_id", user_id);

      if (updateError) {
        console.log(updateError.message);
        return res
          .status(400)
          .json({ sucess: false, msg: updateError.message });
      } else {
        console.log("Points balance updated.");
      }
    }
  }

  return res.status(200).json({ sucess: true, data: data });
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});
