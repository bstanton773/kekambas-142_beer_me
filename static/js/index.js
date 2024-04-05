console.log("Hello this is the index.js!");

// Call the pageLoader function to load the page
pageLoader();


// Function to set up all of the event listeners
function pageLoader(){
    console.log('Setting up the page...')
    // Get the color buttons
    let colorButtons = document.getElementsByClassName('light-dark-button');
    // console.log(colorButtons);
    // Loop through the buttons and add a click event listener to each button
    for (let btn of colorButtons){
        btn.addEventListener('click', changeBackgroundColor);
    }

    // Get the nav links and add a changeView event listener
    let navLinks = document.getElementsByClassName('nav-link');
    // console.log(navLinks);
    for (let link of navLinks){
        link.addEventListener('click', changeView)
    }

    // Get the find breweries form and add submit event listener
    let findBrewsForm = document.getElementById('find-brews-form');
    findBrewsForm.addEventListener('submit', findBreweries);

}


// Event Listener that will change the background color
function changeBackgroundColor(e){
    console.log('Color button clicked');
    console.log(e.target.value);
    if (e.target.value === 'Dark'){
        document.body.style.backgroundColor = '#C96E12'
    } else {
        document.body.style.backgroundColor = '#FFF897'
    }
}


// Event Listener that will change the view
function changeView(e){
    console.log('Clicked!')
    // turn off the element(s) that are visible
    const toTurnOff = document.getElementsByClassName('is-visible');
    for (let element of toTurnOff){
        element.classList.replace('is-visible', 'is-invisible');
        // get the nav link associated with the element
        let navLink = document.getElementsByName(element.id)[0]
        navLink.classList.remove('active')
    }
    // Turn on the element based on the link that we clicked
    let idToTurnOn = e.target.name;
    let toTurnOn = document.getElementById(idToTurnOn);
    toTurnOn.classList.replace('is-invisible', 'is-visible');
    e.target.classList.add('active');
}

// Event Listener to get brewery data and display on the page
function findBreweries(e){
    e.preventDefault(); // will prevent the page from refreshing with form data as query params
    // console.log(e);
    // Get the value from the city input
    let cityName = document.getElementById('cityInput')?.value;
    console.log(`Looking for breweries in ${cityName}...`);

    // Build the URL for the API request
    const url = `https://api.openbrewerydb.org/v1/breweries?by_city=${cityName}&per_page=10`
    console.log(url);

    // Make the HTTP get request to the above url and log the data
    fetch(url)
        .then( res => res.json() )
        .then( data => console.log(data) )
        .catch( err => console.error(err) )

}

