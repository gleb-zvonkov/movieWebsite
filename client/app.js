//Import the functions for fetching tmdb information
import {fetchMovie, searchMovieByTitle, getMovieByTitle, fetchTrendingMovies, fetchTopRatedMovies,fetchTopRatedMoviesPage, getStreamingService} from './javaScriptFunctions/tmdbFetchFunctions.js';
import{getStartPageMovies, getRecommendedMovies, searchYouTube} from './javaScriptFunctions/ApiCalls.js';


/************************************************************************************/
//below are function for creating the div with backdrop image, title, star rating 


//This functions creates one movie item 
//The arguments are the movie data since it need the backdrop path
//Its also a divId, wich is the unique identifier for the video  
async function createMovieDiv(movieData, divId){
        const resultGrid = document.getElementById('result-grid');  //get the grid
        let movieListItem = document.createElement('div'); //for each movie list create a div
        const providerImageUrl = await getSteamingServiceImage(movieData.id);
        movieListItem.innerHTML =`
            <div class = "movie-item-container">
                <div class = "movie-item">
                     <img class= "backdrop_image" src = "https://image.tmdb.org/t/p/original/${movieData.backdrop_path}">   
                     <h1 class="title">${movieData.title} </h1>
                     <h2 class="stars">  </h2>
                     ${providerImageUrl ? `<img class="provider-image" src="${providerImageUrl}" >` : ''}  
                     ${providerImageUrl ? `<img class="justWatchLogo" src="StreamingServiceLogos/JustWatch-logo-large.png" alt="Logo">` : ''}
                     <div class = "hover-video" id="player${divId}"></div>     
                </div>
            </div> `;
      
        addStarRating(movieData.vote_average, movieListItem.querySelector('.stars') );
        resultGrid.appendChild(movieListItem); //add it to the grid
}

//This function intakes a tmdbid for a movie
// It returns a url to the streaming service image where that movie is available
async function getSteamingServiceImage(tmdbid){
    const providerName = await getStreamingService(tmdbid);
    const providerImageMap = {     // Mapping between provider names and image URLs
    'Netflix': 'StreamingServiceLogos/netflix.png',
    'Crave': 'StreamingServiceLogos/crave.png',
    'Amazon Prime Video': 'StreamingServiceLogos/prime.png',
    'Disney Plus': 'StreamingServiceLogos/disney.png',
    'Criterion Channel': 'StreamingServiceLogos/criterion.png',
    'Apple TV Plus': 'StreamingServiceLogos/apple.png',
    'Paramount Plus': 'StreamingServiceLogos/paramount.png'};
    const providerImageUrl = providerImageMap[providerName] || '';
    return providerImageUrl;
}

//This function adds intakes a rating and a div
//From the rating it creates a number of star and places them on the div
function addStarRating(rating, starsDiv){
    const rawRating = (rating / 10) * 4;
    const roundedRating = Math.round(rawRating * 2) / 2;
    starsDiv.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        if (i < Math.floor(roundedRating)) { // Full star
            starsDiv.innerHTML += '★';
        } else if (i === Math.floor(roundedRating) && roundedRating % 1 >= 0.5) { // Half star
            starsDiv.innerHTML += '☆'; // Half star 
        } 
    } 
}
/************************************************************************************/

 


/************************************************************************************/
//below are function for creating the youtube player 

var allLikedMovies = [];  //array that contains the tmdb id of the movies for witch the trailer was watched

//This function create a yotube video players and returns it
//Its passed the divId wich corresponds to the identifier of the unique player div
//Its also passed the youtube id of the youtube video we are creating the palyer for
//When the player is loaded the function onPlayerReady is triggered 
//This explained how YT.player works: https://developers.google.com/youtube/player_parameters 
async function createPlayer(divId ,youtubeId) {  
    return new YT.Player(`player${divId}`, {   //return a new player 
        videoId: youtubeId,
        playerVars: {
            'controls': 0, // Hide video controls
            'rel': 0, // Disable related videos at the end
            'start': 10, // make it start 2 seconds in
            'mute': 0, // Mute the video
            'origin': 'http://localhost:5501',
        }, 
        events: {
            'onReady': onPlayerReady.bind(null, divId)   //when the video is ready 
        }
    });
}

//This function enables the autoplay when a cursor enters the youtube player
//It also adds to the list of watchedTrailers everytime cursor enters the youtube player
//This function modifies the global allLikedMovies 
function onPlayerReady(divId, event) {   
    const player = event.target; //get the player itself 
    const playerDiv = document.getElementById(`player${divId}`); //get the player div 
    playerDiv.addEventListener('mouseenter', function () {  //when the mouse enters the div
      player.playVideo(); // Start playing the video
      /*************  here we assume that the divId is the tmdbId **************/
      if (!allLikedMovies.includes(divId)) {  //if not already in the watched trailer array
        allLikedMovies.push(divId);  // add it to the watched trailers
      }
    });
    playerDiv.addEventListener('mouseleave', function () {  // when the mouse exits the div 
        player.pauseVideo(); // Pause the video when the mouse exits
    });
}

/************************************************************************************/




/************************************************************************************/
//Below are functions for creating multiple divs and youtube players 

//This function displays a single movie using its tmdbID
async function displayMovieUsingTmdbId(tmdbId){
    var movieData = await fetchMovie(tmdbId);   // get the movie data from tmdbId
    await createMovieDiv(movieData,tmdbId); // create the div with the image
    var searchQuery = `${movieData.title} ${movieData.release_date.substring(0, 4)} trailer`; //make the search query the movie title followed by its release year
    var youtubeId = await searchYouTube(searchQuery); //get the youtube id of the trailer
    createPlayer(tmdbId, youtubeId) //create the youtube player
    //Add streaming service info 
}

//This function displays a single movie using it movie data
async function displayMovieUsingMovieData(movieData){   
    await createMovieDiv(movieData,movieData.id); // create the div with the image
    var searchQuery = `${movieData.title} ${movieData.release_date.substring(0, 4)} trailer`; //make the search query the movie title followed by its release year
    var youtubeId = await searchYouTube(searchQuery); //get the youtube id of the trailer
    createPlayer(movieData.id, youtubeId) //create the youtube player
}

//This function displays multiple movies using there data
async function displayMoviesUsingMovieData(moviesData){
    const parsedObject = JSON.parse(moviesData);
    for (let i = 0; i < parsedObject.length; i++) {
        let data = parsedObject[i];
        displayMovieUsingMovieData(data);
    }
}

// This function displays multiple movies using there tmdbIDs
async function displayMoviesUsingTmdbIds(ids){
    for (const id of ids) {   //for each id 
        await displayMovieUsingTmdbId(id); // display the movie usings its TmdbId
    } 
}
/************************************************************************************/





/*****************************************************************************/
/* Below are functions that cause the starting page and recommended movies functions to be called  */

async function displayMoviesRecommended(){
     let moviesRecommended = await getRecommendedMovies(allLikedMovies);  // get reccommended movies using the flask server
     await displayMoviesUsingTmdbIds(moviesRecommended); //display the recommended movies
}

async function main(){
    let starPageMovies = await getStartPageMovies();
    displayMoviesUsingMovieData(starPageMovies); 
}

let hasMainExecuted = false;
if (!hasMainExecuted) {
    main();
    hasMainExecuted = true;
}

var throttleTimer; //Keep track of the throttle timer
const throttle = (callback, time) => {  //limits how often a callback can be called
  if (throttleTimer) return; //If throttle timer is already set, retun immediately
  throttleTimer = true; //otherwise set it to to true
  setTimeout(() => { // afte the specified time 
    callback();  //call the call back function
    throttleTimer = false;  //reset the throttletimer to false to allow callback
  }, time);
};

const handleInfiniteScroll = () => { //function to handle infinite scrolling
    throttle(() => {  //use throttle function to limit frequency of call back execution
        const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 500;  //calculate if its the end of the page
        //window.innerHeight represents the visible part of of the webpage
        //window.pageYOffset represents the number of pixels that the document is currently scrolled
        //document.body.offsetHeight represents the total height of the entire document 
        if (endOfPage) {  // if end of page
          displayMoviesRecommended(); //display the movies recommended
        }
      }, 5000); //Set a 5000ms throttle time
  };


window.addEventListener("scroll", handleInfiniteScroll); //sroll event to handle infinite scroll function

/*****************************************************************************/






