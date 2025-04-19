# Movie Website
This project is a movie recommendation and search platform that integrates various APIs to provide users with an interactive experience. It features a dynamic movie panel with trailers, a GPT-powered search bar, and secure user authentication. Note that you cannot run this project without setting API keys for GPT and TMDB in the .env file.

## Video Demo
A demo of the final project is available here: https://drive.google.com/file/d/1O_pKABgfuIRA60Lgws_zUn3IYdatr-Th/view?usp=sharing or https://youtu.be/An-lNnwJfJM . 

## Team Information: 
One student worked on this project.                                   
Gleb Zvonkov                                   
1011806636                                  
gleb.zvonkov@utoronto.ca                                  

## Motivation: 
Millions of people ask, “What should we watch?” every day. Finding an answer isn’t always easy. Browsing Netflix limits choices to its available selection. A Google search for “best action movies” returns a generic, non-personalized list. Scrolling through IMDb movie lists can be time-consuming. These methods often lead to subpar recommendations, highlighting the need for a personalized movie recommendation system.   

We propose developing a personalized movie recommendation system. The basic interface of the system is a page of rectangles each containing a movie. When a movie is hovered over the trailer is played and information about tha movie is revealed. Once the user scrolls to the bottom of the page movie recommendations are generated using trailer watch time and clicks. The user is also able to search for movies using a chat gpt search bar.                        

Existing solutions include Googling for movie recommendations, which requires explicit input; streaming services, which are limited to their own catalog; and IMDb, which is not designed for personalized recommendations. YouTube generates implicit recommendations, but its primary purpose is not to help users find movies. These limitations highlight the need for a more intuitive and personalized recommendation system.                                  

## Objectives: 
Develop an interface that dynamically displays movies in a continuous feed.                                  
Integrate the TMDB API to fetch detailed movie information.                                   
Utilize the YouTube API to display relevant movie trailers.                                  
Clean and preprocess a movie dataset to support personalized recommendations.                                  
Implement a GPT-powered search bar for improved user interaction.                                   
Incorporate authentication and authorization features for secure access.                                  

## Technical Stack: 
We choose to have a seperate front end and bakend.                                  
Where the frontend is React Vite project.                                    
Where the backend is an Express.js server.                                  

In the frontend we use Tailwind CSS for styling.                                   
In the freontend we use shadcn/u specificlly avatar, button, card, input, label, skeleton.                                   
In the frontend we use the YouTube API to display movie trailers.                                   

In the backend we store user profile images using DigitalOcean.                                  
In the backend we generate new recommendation using a SQLite database.                                   

In the backend we use the TMDB API to fetch movie details, including poster images.                                  
In the backed we use GPT API for intelligent search capabilities.                                  

We implement user authentication and authorization use Better Auth.                                   
We store the user information in a SQLite database.                                   


## Features: 
The main features offered are: A GPT-powered search bar to help users find movies, a dynamic, scrollable panel of movies, each displaying its trailer, and user authentication and profile image storage.                                  

We describe who they fulfill course requirments:                                   
Tailwind CSS for Styling: Used for responsive and efficient styling.                                  
shadcn/ui: Enhances our program’s responsiveness.                                  
Relational Database: SQLite for authentication and movie reccommendations.                                
Backend: Express.js server handles backend functionality.                                  
User Authentication and Authorization: Implemented using Better-Auth.                                  
Cloud Storage: User profile images stored using DigitalOcean.                                  
API Integration with External Services: We integrate with TMDB, GPT, and YouTube APIs. 


## User Guide: 
Hover over a movie to autoplay its trailer. For the first movie, you may need to press play manually; subsequent trailers will autoplay on hover. Double-click on a movie to view it in full screen.                                  

Type a query into the search bar and press Enter. Movie results will appear below, and you can scroll through them as usual.                                   

Click on the user icon in the upper left corner to either login or signup.                                  
Once logged in, click on the user icon again to upload a profile image.                                  
 

## Development Guide: 
The .env file contains secret keys necessary for the GPT and TMDB APIs, as well as for cloud storage configuration (see below). These keys have been removed for safety purposes. You will need to obtain the API keys for both services in order for the application to function properly (movie fetching, search bar, etc.). Contact me, and I can provide these keys if needed.                                   

To generate a SQL migration file: `npx @better-auth/cli generate`.                                  
To migrate tables into the database: `npx @better-auth/cli migrate`.                                  
Follow the official Better Auth documentation for installation instructions: https://www.better-auth.com/docs/installation .                                  

We use DigitalOcean for cloud storage of user profile images.                                  
The .env file contains the necessary credentials to set up the S3 client and communicate with DigitalOcean’s object storage. Make sure to configure the keys correctly.                                  

To run the program locally: 
Start the backend express server `cd backend` and `npm run dev`.                              
Then start the frontend vite react `cd frontend` and `npm run dev`.                                   


## Lessons Learned and Concluding Remarks: 
We gained valuable experience working with React and deepened our understanding of its ecosystem. We learned how to set up authentication using Better-Auth, which was crucial for user management and security.We gained hands-on experience integrating and configuring various APIs, including GPT, TMDB, and YouTube. Looking ahead, we plan to add more features, such as allowing users to click on a movie to view more detailed information. 

# Backend API Documentation 
`/api/auth/*splat`: Handles authentication requests through Better Auth.             
`/api/trending`: Fetches and returns trending movie data.            
`/api/recommended`: Fetches and returns recommended movie data.            
`/api/cloud_storage`: Handles image uploads to DigitalOcean's cloud storage.            
`/api/gpt`: Handles requests for GPT-based services.            



## Project strucure 
movieWebsite/                           
├── backend/                          
│   ├── __pycache__/                                               
│   ├── lib/
│   │   ├── better-auth_migrations/     # Better-auth internal migrations                          
│   │   ├── auth.db                     # SQLite database for auth                          
│   │   ├── auth.js                     # Auth-related logic                          
│   │   └── s3Client.js                 # AWS S3 file upload logic                          
│   ├── movieInfo/                          
│   │   ├── fetchMovieInfo.js           # TMDB movie data fetcher                          
│   │   ├── fetchYouTubeInfo.js         # YouTube video ID fetcher                          
│   │   ├── movieBuilder.js             # Composes full movie objects                          
│   │   └── movies.db                   # SQLite movie database                          
│   ├── routes/                          
│   │   ├── gpt.js                      # GPT query endpoints                          
│   │   ├── initialMovies.js            # Trending movies route                          
│   │   ├── recMovies.js                # Recommended movies route                          
│   │   └── upload.js                   # File upload route (S3)                          
│   ├── .env                            # Backend environment variables                          
│   └── index.js                        # Express server entry point                          
│
├── frontend/                          
│   ├── public/                                                   
│   ├── src/                          
│   │   ├── components/ui/              # UI components (shadcn/ui-style)                          
│   │   │   ├── avatar.tsx                          
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx                          
│   │   │   ├── input.tsx                          
│   │   │   ├── label.tsx                          
│   │   │   └── skeleton.tsx                          
│   │   ├── hooks/                      # Custom React hooks                          
│   │   │   ├── useAuth.ts              # Manages authentication state and login/signup logic             
│   │   │   ├── useInfiniteScroll.ts    # Handles loading more content as user scrolls to bottom                              
│   │   │   ├── useMovieLoader.ts       # Fetches and manages the movie list (initial + incremental)                           
│   │   │   └── useYoutubePlayer.ts     # Initializes and tracks YouTube player instances                   
│   │   ├── lib/                        # Utility functions                          
│   │   │   └── utils.ts
│   │   ├── parts/                      # Component sections                          
│   │   │   ├── authenticationCard.tsx  # Card component that toggles between sign in and sign up views    
│   │   │   ├── avatar.tsx              # Avatar UI with optional upload or fallback icon       
│   │   │   ├── movieCard.tsx           # UI card displaying a movie trailer and details    
│   │   │   ├── signIn.tsx              # Sign-in form for user authentication                          
│   │   │   ├── signUp.tsx              # Sign-up form for creating new user accounts         
│   │   │   └── userInfo.tsx            # Displays user profile information and image      
│   │   ├── App.tsx                     # Main app component                           
│   │   ├── App.css                     # App-specific styles                          
│   │   ├── index.css                   # Global styles                          
│   │   ├── main.tsx                    # Frontend entry point                          
│   │   ├── types.ts                    # Shared types                          
│   │   └── vite-env.d.ts               # Vite environment type declarations                          
│   ├── .env                            # Frontend environment variables                          
│   ├── index.html                      # Main HTML shell                          
│   ├── vite.config.ts                  # Vite config                          
│                          
├── .gitignore                          # Files ignored by Git                          
├── components.json                     # Component library config                          
├── eslint.config.js                    # Linting configuration                          
├── tsconfig.json                       # Base TypeScript config                          
├── tsconfig.app.json                   # TS config for frontend                          
├── tsconfig.node.json                  # TS config for backend                          
├── package.json                        # Project metadata and scripts                          
├── package-lock.json                   # Dependency lock file                          
└── README.md                           # Project documentation                          
