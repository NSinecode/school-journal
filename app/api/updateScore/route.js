import { updateMessageAction } from "@/actions/messages-actions";
import { updateProfileAction } from "@/actions/profiles-actions";


export async function POST(req) {
    try {
  
      const { id, score, value, profile, isLiked, isDisliked } = await req.json();
      if (!id || value === undefined || !profile) {
        return new Response(JSON.stringify({ error: "Invalid request parameters" }), { status: 400 });
      }
  
      const postsLiked = profile.posts_liked || [];
      const postsDisliked = profile.posts_disliked || [];

      let newScore = score;
      let updatedLiked = [...postsLiked];
      let updatedDisliked = [...postsDisliked];
  
      if (!isLiked && !isDisliked) {
        newScore += value;
        if (value > 0) {
          updatedLiked.push(id);
        } else {
          updatedDisliked.push(id);
        }
      } else if (isLiked) {
        if (value > 0) {
          newScore -= 1;
          updatedLiked = updatedLiked.filter(pid => pid !== Number(id));
        } else {
          newScore -= 2;
          updatedLiked = updatedLiked.filter(pid => pid !== Number(id));
          updatedDisliked.push(id);
        }
      } else if (isDisliked) {
        if (value < 0) {
          newScore += 1;
          updatedDisliked = updatedDisliked.filter(pid => pid !== Number(id));
        } else {
          newScore += 2;
          updatedDisliked = updatedDisliked.filter(pid => pid !== Number(id));
          updatedLiked.push(id);
        }
      }
  
      await updateProfileAction(profile.userId, { posts_liked: updatedLiked, posts_disliked: updatedDisliked }, "/forum");
      const updatedPost = await updateMessageAction(id, { score: newScore });
  
      return new Response(JSON.stringify({ post: updatedPost }), { status: 200 });
    } catch (error) {
      console.error("Error updating score:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  };
