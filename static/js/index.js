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
    findBrewsForm.addEventListener('submit', e => findBreweries(e, 1));


    // Add Drag and Drop for the beer and coaster
    let draggableBeer = document.getElementById('draggable');
    draggableBeer.addEventListener('dragstart', dragBeer);

    let coasterDrop = document.getElementById('droppable');
    coasterDrop.addEventListener('dragover', e => e.preventDefault());
    coasterDrop.addEventListener('drop', handleBeerDrop);


    // Add click listeners to the Bubbles to show event propogation
    const bubbles = document.getElementsByClassName('bubble');
    bubbles[0].addEventListener('click', e => console.log("You clicked outer... propogated from:", e.target.id));
    bubbles[1].addEventListener('click', e => {
        console.log("You clicked middle... propogated from:", e.target.id);
        // e.stopPropagation(); // This will stop the event from also calling the outer bubble event
    });
    bubbles[2].addEventListener('click', e => console.log("You clicked inner... propogated from:", e.target.id));

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

    // If the view is the grab beer view, listen for keydown events
    if (idToTurnOn === 'grab'){
        // Add the key event listener to the document
        document.addEventListener('keydown', handleBeerMove);
    } else {
        document.removeEventListener('keydown', handleBeerMove);
    }
}

// Event Listener to get brewery data and display on the page
function findBreweries(e, pageNumber){
    e.preventDefault(); // will prevent the page from refreshing with form data as query params
    // console.log(e);
    // Get the value from the city input
    let cityName = document.getElementById('cityInput')?.value;
    let stateName = document.getElementById('stateInput')?.value;
    console.log(`Looking for breweries in ${cityName}, ${stateName}...`);

    // Build the URL for the API request
    const url = `https://api.openbrewerydb.org/v1/breweries?by_city=${cityName}&by_state=${stateName}&per_page=10&page=${pageNumber}`
    console.log(url);

    // Make the HTTP get request to the above url and log the data
    fetch(url)
        .then( res => res.json() )
        .then( data => displayBreweries(data, pageNumber) )
        .catch( err => console.error(err) )

}


// Callback function for findBreweries that will accept brewery data and insert into the display table
function displayBreweries(data, pageNumber){
    // Get the table from the HTML
    let table = document.getElementById('brewery-table');

    // Clear out the table of any current data
    table.innerHTML = '';
    // Remove any previous or next buttons
    let breweryButtons = document.querySelectorAll('.prev-next-btn');
    for (let btn of breweryButtons){
        btn.remove()
    }

    if (!data.length){
        table.innerHTML = '<h1>No Breweries Here</h1>'
        return
    }

    // Set up table headers
    const thead = document.createElement('thead');
    table.append(thead); // Add the thead as a child to the table
    let tr = document.createElement('tr');
    thead.append(tr); // add the table row as a child the table header
    const tableHeadings = ['Name', 'Type', 'Street Address', 'Address 2', 'Address 3', 'City', 'State'];
    tableHeadings.forEach( heading => {
        let th = document.createElement('th');
        th.scope = 'col';
        th.innerHTML = heading;
        tr.append(th)
    } );

    // Create the table body and populate with brewery data
    let tbody = document.createElement('tbody');
    table.append(tbody);

    // Write a row for each brewery in data
    for (let brewery of data){
        let tr = document.createElement('tr');
        tbody.append(tr);

        newDataCell(tr, `<a href=${brewery.website_url} target="_blank">${brewery.name}</a>`)
        newDataCell(tr, brewery.brewery_type);
        newDataCell(tr, brewery.street);
        newDataCell(tr, brewery.address_2);
        newDataCell(tr, brewery.address_3);
        newDataCell(tr, brewery.city);
        newDataCell(tr, brewery.state);
    }

    // Add a next button if there are 10 breweries in the current data array
    if (data.length === 10){
        let nextButton = document.createElement('button');
        nextButton.classList.add('prev-next-btn', 'btn', 'btn-primary');
        nextButton.innerHTML = 'Next';
        nextButton.addEventListener('click', e => findBreweries(e, pageNumber + 1))
        table.after(nextButton);
    }

    // Add a prev button if the pageNumber > 1
    if (pageNumber > 1){
        let prevButton = document.createElement('button');
        prevButton.classList.add('prev-next-btn', 'btn', 'btn-danger');
        prevButton.innerHTML = 'Prev';
        prevButton.addEventListener('click', e => findBreweries(e, pageNumber - 1))
        table.after(prevButton);
    }

}


// Helper Function for creating a new data cell for a table row
function newDataCell(tr, value){
    let td = document.createElement('td');
    td.innerHTML = value ?? '-'
    tr.append(td)
}


// Event Listener Function that will get the ID of the beer and set it in the Data Transfer
function dragBeer(e){
    console.log('Dragging beer...');
    e.dataTransfer.setData('text', e.target.id)
}


// Event Listener Function to handle the drop
function handleBeerDrop(e){
    console.log('Dropping beer...');
    let beerId = e.dataTransfer.getData('text');
    console.log(beerId);
    const beer = document.getElementById(beerId);
    if (beer){
        e.target.append(beer);
    }
}


// Event listener for handling key strokes moving the beer
function handleBeerMove(e){
    const arrowKeys = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']
    if (arrowKeys.includes(e.key)){
        // console.log(e.key);
        const glass = document.querySelector('.beerglass');
        switch(e.key){
            case 'ArrowUp':
                glass.style.top = parseInt(glass.style.top) - 5 + 'px';
                break
            case 'ArrowDown':
                glass.style.top = parseInt(glass.style.top) + 5 + 'px';
                break
            case 'ArrowLeft':
                glass.style.left = parseInt(glass.style.left) - 5 + 'px';
                break
            case 'ArrowRight':
                glass.style.left = parseInt(glass.style.left) + 5 + 'px';
                break
        }

        if (glass.style.top === '200px' && glass.style.left === '450px'){
            setTimeout( () => alert('Enjoy a nice cold beer!'), 0 )
        }
    }
}