import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;
const apiKey = process.env.API_KEY;
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files (like CSS) from the public directory
app.use(express.static('public'));

// Route to render the form page
app.get('/', (req, res) => {
    res.render('index', { weather: null, error: null });
});

// Route to handle form submission and fetch weather data
app.post('/weather', async (req, res) => {
    const { city } = req.body; // Get the city name from form input

    try {
        // Fetch weather data using the city name
        const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: city,
                units: 'metric', // Use 'imperial' for Fahrenheit, 'metric' for Celsius
                appid: apiKey
            }
        });

        // Render the EJS template with the weather data
        res.render('index', { weather: weatherResponse.data, error: null });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.render('index', { weather: null, error: 'Failed to fetch weather data. Please try again.' });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});