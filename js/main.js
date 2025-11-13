const API_KEY = "lKBuCFZji1BrCnFWZCJqoLNTnIgvyuGk";
        const PAGE_SIZE = 10;
        // const offset = 0; // Not strictly needed if not doing pagination yet

        const searchForm = document.getElementById("searchForm");
        const searchSection = document.getElementById("search-section");
        const outputArea = document.getElementById("outputArea");
        const searchInput = document.getElementById("q");

        // Use a function to create and append the image elements
        function appendGifToScreen(gif) {
            const title = gif.title || "Untitled GIF";
            // Prefer using a stable image format like fixed_height_downsampled or fixed_height
            const gifURL = gif.images.fixed_height.url; 
            const originalURL = gif.url;

            // 1. Create the container elements
            const flexItem = document.createElement('div');
            flexItem.classList.add('flex-item'); // Assuming this is for your CSS layout

            const gifCard = document.createElement('div');
            gifCard.classList.add('gif-card');

            const link = document.createElement('a');
            link.href = originalURL;
            link.target = "_blank"; // Open in a new tab

            const image = document.createElement('img');
            image.src = gifURL;
            image.alt = title; // Essential for accessibility

            const caption = document.createElement('div');
            caption.textContent = title;

            // 2. Assemble the elements
            link.appendChild(image);
            gifCard.appendChild(link);
            gifCard.appendChild(caption);
            flexItem.appendChild(gifCard);

            // 3. Append to the main output area
            outputArea.appendChild(flexItem);
        }

        /**
         * Queries the Giphy API and renders the results.
         * Uses async/await for cleaner asynchronous code flow.
         * @param {string} searchTerm The phrase to search for.
         */
        async function queryGiphy(searchTerm) {
            // 1. Clear previous results and display a loading message
            outputArea.innerHTML = '<h2>Loading Gifs...</h2>'; 

            const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(searchTerm)}&limit=${PAGE_SIZE}&offset=0`;

            try {
                // 2. Fetch the data
                const response = await fetch(url);
                
                // Check for HTTP errors (e.g., 404, 500)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const json = await response.json();
                
                // 3. Clear the loading message/previous results for the actual content
                outputArea.innerHTML = ''; 

                const gifs = json.data;
                console.log('gif data', json.data)
                if (gifs.length === 0) {
                    outputArea.innerHTML = `<h2>No Gifs found for "${searchTerm}" 😢</h2>`;
                    return;
                }

                // 4. Iterate through the returned data and append images
                for (const gif of gifs) {
                    appendGifToScreen(gif);
                }

            } catch (error) {
                console.error("Giphy API call failed:", error);
                outputArea.innerHTML = `<h2>An error occurred: ${error.message}. Please check your API key and network connection.</h2>`;
            }
        }

        function handleHomeClick(event) {
           searchInput.value = '';
           searchSection.style.display = 'block';
            outputArea.innerHTML = '';
        }

        function handleRandomClick(event) {
            searchSection.style.display = 'block';
           searchInput.value = '';
            queryGiphy('random'); // Calls the main function with the 'random' path
        }

        
        function handleSearchSection(page)
        {
            if(page === 'contact')
            {
                searchSection.innerHTML='';
            }
        }

        function handleContactClick(event) {
            if (event) {
                event.preventDefault(); // Stop the link from changing the URL
             }

            const mainContentArea = document.querySelector('main');
            if (!mainContentArea) {
                console.error("Could not find the main content area.");
                return;
             }
             
         
             // Or 'flex', 'grid', etc., depending on desired layout
        
            searchSection.style.display = 'none';

                outputArea.innerHTML = `
        <h2>Get in Touch</h2>
        <p>Have questions, feedback, or suggestions? Fill out the form below and we'll get back to you as soon as possible.</p>

        <form action="#" method="POST" id="contactForm">
            
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div>
                <label for="subject">Subject:</label>
                <input type="text" id="subject" name="subject" required>
            </div>
            
            <div>
                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="6" required></textarea>
            </div>
            
            <div>
                <button type="submit">Send Message</button>
            </div>

        </form>
    `;

    // Optional: Add a listener for form submission (since the form is created dynamically)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Thank you for your message! (Form submission logic would go here)");
            contactForm.reset();
        });
    }
}

        // Event listener for form submission
        searchForm.addEventListener('submit', (event) => {
            // Prevent the default form submission (page reload)
            event.preventDefault(); 
            
            const searchTerm = searchInput.value.trim();
            console.log('searchterm', searchTerm);
            if (searchTerm) {
                queryGiphy(searchTerm);
            } else {
                outputArea.innerHTML = '<h2>Please enter a search phrase.</h2>';
            }
        });

        // Optional: Initial message on load if the outputArea is empty
        window.onload = () => {
             if (outputArea.children.length === 0) {
                outputArea.innerHTML = '<p>Welcome! Start your Giphy search above.</p>';
            }
        };














