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
            searchSection.innerHTML = '<form id="searchForm">'+
                '<div>'+
                   '<label for="q">Search Gifs:</label>'+
                    '<input type="text" id="q" placeholder="Enter search phrase" required>'+
                    '<button type="submit" onClick="queryGiphy()">Search</button>'+
                '</div>'+
           '</form>';
            outputArea.innerHTML = '';
        }

        function handleRandomClick(event) {
           // event.preventDefault();
           searchSection.innerHTML = '<form id="searchForm">'+
                '<div>'+
                   '<label for="q">Search Gifs:</label>'+
                    '<input type="text" id="q" placeholder="Enter search phrase" required>'+
                    '<button type="submit" onClick="queryGiphy()">Search</button>'+
                '</div>'+
           '</form>';
            queryGiphy('random'); // Calls the main function with the 'random' path
        }

        function handleContactClick(event) {
            searchSection.innerHTML = '';

           outputArea.innerHTML = '<section id="search-section"<form id="searchForm"><div><label for="q">Search Gifs:</label>'+
           '<input type="text" id="q" placeholder="Enter search phrase" required><button type="submit" onClick="queryGiphy()">Search</button>'+
                '</div></form></section>';
        }


        // Event listener for form submission
        searchForm.addEventListener('submit', (event) => {
            // Prevent the default form submission (page reload)
            event.preventDefault(); 
            
            const searchTerm = searchInput.value.trim();

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














