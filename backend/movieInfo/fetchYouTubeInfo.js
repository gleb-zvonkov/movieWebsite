
/**
 * Fetches the YouTube video ID for a given search query.
 * - Constructs a YouTube search URL from the query.
 * - Makes a GET request to fetch the HTML of the search results page.
 * - Extracts the video ID from the HTML using a simple string search.
 * 
 * Note: This method is a hacky workaround and may break if YouTube changes their page structure.
 */

import axios from "axios";

export async function getYoutubeId(searchQuery) {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    searchQuery
  )}`; // construct the Youtube search URL with encode movieName
  const response = await axios.get(searchUrl); //make a get request to the url using axious
  const html = response.data; //get the html from the response

  // very hacky way of getting the youtube video id
  const matchIndex = html.indexOf('"videoRenderer"'); //find the index of video render this is close to the youtube video id
  const videoId = html.substring(matchIndex + 28, matchIndex + 39); //get the youtube video id

  return videoId; //return the video id
}
