# Harvard Art API

## What do we need to Know?

* JavaScript
    * Using nested objects to avoid magic strings
    * `throw Error()`
        * In general programming throwing an error starts a chain of events
        * This error will start in the current function, and if nothing is catching what is being thrown, it will then move up a scope to the next outer function
        * This process continues until it gets to the global scope, and if nothing is catching it then your program might halt / have unintended consequences

            ```js
            function add(x, y) {
                if (typeof x === 'number' && typeof y === 'number') {
                    return x + y;
                } else {
                    throw Error('this should be a number')
                }
            }

            add(3, 6); // 9
            add(true, 'hello') // PROGRAM GOES CRAZY UNCAUGHT ERROR OOPS
            ```

    * try/catch/finally
        * How do we catch thrown errors?
        * We can write a `try`/`catch` block:

            ```js
            try {
                const result = add(5, 11);
                console.log(result); // 16
            } catch (errorObject) {
                console.error(errorObject); // doesn't happen, no thrown error
            }

            try {
                const result = add(5, "11");
                console.log(result); // doesn't happen, error in previous line moves us to catch block
            } catch (errorObject) {
                console.error(errorObject); // "this should be a number"
            }
            ``` 

        * Finally is a bonus block you can write that runs **either** if the try or catch block completes.  It doesn't care if your code runs or errors out.

            ```js
            try {
                // something
            } catch (error) {
                // something else
            } finally {
                console.log('hi there!'); // this ALWAYS HAPPENS
            }
            ```

    * async functions
        * when you write `async function myFunc() {}` it is still just a function
        * this function now returns a **promise** when you call it, no matter what you do inside of it
        * if you return a value from `myFunc`, it will passed into the `then` callback function
        * if you throw an error from inside `myFunc`, it will be passed into the `catch` callback function

            ```js
            async function add(x, y) {
                return x + y;
            }

            add(3, 5).then(result => console.log(result));

            async function reverse(str) {
                if (typeof str !== "string") {
                    throw Error("reverse require a string");
                } else {
                    return str.split('').reverse().join('');
                }
            }

            reverse('hello').then(console.log).catch(console.error); // olleh
            reverse(7).then(console.log).catch(console.error); // reverse requires a string
            ```

    * await keyword
        * only usable **inside** an asnyc function
        * usable on a called async function rather than registering a `.then()` callback
        * grabs the value from the `.then()` callback and makes it available

            ```js
            async function add(x, y) {
                return x + y;
            }

            async function addThree(x, y, z) {
                const xPlusY = await add(x, y);
                const xPlusYPlusZ = await add(xPlusY, z);

                return xPlusYPlusZ;
            }

            addThree(1, 2, 3).then(console.log).catch(console.error); // 6
            ```
        * Most importantly lets us write our asynchronous code in a synchronous way

            ```js
            async function complicatedApiCallAsync() {
                const firstResult = await fetch(firstUrl);
                const firstData = await firstResult.json();
                const secondUrl = makeSecondUrl(firstData); // not an async process
                const secondResult = await fetch(secondUrl);
                const secondData = await secondResult.json();

                return secondData;
            }

            // OR

            function complicatedApiCallPromises() {
                return fetch(firstUrl)
                        .then(firstResult => firstResult.json())
                        .then(firstData => makeSecondUrl(firstData))
                        .then(secondUrl => fetch(secondUrl))
                        .then(secondResult => secondResult.json())
            }
            ```

        * The above two look relatively reasonable either way, but if you want to return `firstData` and `secondData`, the calls get way more complicated. 
        * `async` and `await` can flatten our our code, avoiding nested promises

    * try/catch/finally with async/await

            ```js
            async function add(x, y) {
                if (typeof x === 'number' && typeof y === 'number') {
                    return x + y;
                } else {
                    throw Error('Numeric inputs only');
                }
            }

            async function addThree(x, y, z) {
                try {
                    const xPlusY = await add(x, y);
                    const xPlusYPlusZ = await add(xPlusY, z);
                    return xPlusYPlusZ;
                } catch (errorObj) {
                    console.error(errorObj);
                    throw Error(errorObj); // punt it up the line
                } finally {
                    console.log("Thanks for using addThree!");
                }
            }

            addThree(1, 2, 3).then(console.log).catch(console.error);
            // Thanks for using addThree! (from the finally in addThree)
            // 6                          (from the then on addThree)

            addThree(true, 2, 3).then(console.log).catch(console.error);
            // Numeric inputs only        (from the catch in addThree)
            // Thanks for using addThree! (from the finally in addThree)
            // Numeric inputs only        (from the catch on the calling of addThree)
            ```
       
    * Array & Object destructuring
    
        * Object destructuring creates a variable name equal to a key name
        * It will do this for each key in the "object syntax" on the left of the assignment operator
        * It assigns to the variable the object the key points to 
        * Array destructuring is based on the order of elements in the array
        * It creates a variable name for each entry on the left of the assignment operator
        * It assigns the objects from the array on the right in order

            ```js
            const myObject = {
                keyOne: 10,
                name: "Josephine",
                age: 37
            }

            const myFuncArray = [
                function() { return 7 },
                function() { return 11 }
            ];

            const { name, age } = myObject;
            // this is the same as:
            // const name = myObject.name
            // const age = myObject.age

            const [ getSeven, getEleven ] = myFuncArray;
            // this is the same as:
            // const getSeven = myFuncArray[0];
            // const getEleven = myFuncArray[1];
            ```

        * You can do this in a function call

            ```js
            function doSomething({ name, age }) {
                console.log(name, age);
            }

            const me = {
                name: 'sam',
                height: '6ft 1in'
            }

            const you = {
                name: 'sally',
                age: 42,
                height: '5ft 11in'
            }

            doSomething(me) // sam undefined
            doSomething(you) // sally 42

            function add([ first, second, third ]) {
                return first + second + third;
            }

            add([ 1, 2, 3 ]); // 6
            ```

* Ajax
    * More dealing with results

* APIs
    * API 
    
* General
    * Using helper functions to avoid complexity

## Day 01

- API Lives at https://github.com/harvardartmuseums/api-docs
- Sign up for api key at https://docs.google.com/forms/d/e/1FAIpQLSfkmEBqH76HLMMiCC-GPPnhcvHC9aJS86E32dOd0Z8MpY2rvQ/viewform

- Build Search Bar
- Fetch initial search bar data
- Use localstorage for data to prevent fetch every page load
- Build search string from search bar
- Fetch data from search bar

### Getting Started

Go and familiarize yourself with the documentation over at [https://github.com/harvardartmuseums/api-docs](https://github.com/harvardartmuseums/api-docs).  In particular you need to get an idea of the [Responses & Data Format](https://github.com/harvardartmuseums/api-docs#responses-and-data-format), [Available Resources](https://github.com/harvardartmuseums/api-docs#resources-that-are-available), and sections such as [Object](https://github.com/harvardartmuseums/api-docs/blob/master/sections/object.md) and [Century](https://github.com/harvardartmuseums/api-docs/blob/master/sections/century.md).

These documents will be helpful to you when you have questions about what's going on with the API, and what data should be returned when you make requests.

#### The Key

This api, unlike the last ones that we've used, uses an API key to protect their resources.  You have to read [Access to the API](https://github.com/harvardartmuseums/api-docs#access-to-the-api), and [fill out this form](https://docs.google.com/forms/d/e/1FAIpQLSfkmEBqH76HLMMiCC-GPPnhcvHC9aJS86E32dOd0Z8MpY2rvQ/viewform).  Once you do, you'll get an email with a key in it which you can use with your requests.

### Your First Request

Let's write a function, called `fetchObjects`, just to test our our new API key.  

```js
const BASE_URL = 'https://api.harvardartmuseums.org';
const KEY = 'apikey=jakjk1b2j34kb32j4bkjasfd'; // USE YOUR KEY HERE

function fetchObjects() {
    const url = `${ BASE_URL })/object?${ KEY }`;

    fetch(url)
        .then(function (response) {
            return response.json()
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.error(error);
        });
}

fetchObjects();
```

Once you fill in your api key, what happens? 

In the above function we build the request URL from the base url, the data type we want, and the key.  Using that we initiate a fetch request, and tack on success/failure callbacks to the promise that fetch returns.

If you've done it right, you should get something like this in your console:

```js
{
  info: {},
  records: [{}, {}, ...]
}
```

This is our data structure, and we will be using both the `info` and the `records` in our application.

### Flatten the code

Let's rewrite that function using `async` and `await` to help flatten out the code:

```js
async function fetchObjects() {
  const url = `${ BASE_URL })/object?${ KEY }`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

Now we aren't chaining our calls, but instead writing each one in order.  Feels more synchronous, which feels good.

However, this function, as it stands, isn't super useful. We really need to return the objects from fetchObjects, so that we can use them in whatever calls this method. We can do that just by returning the data from the try block.

```js
async function fetchObjects() {
  const url = `${ BASE_URL })/object?${ KEY }`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

fetchObjects().then(x => console.log(x)); // { info: {}, records: [{}, {},]}
```

This will be our new paradigm from here until the end of time.

## Search Bar

The Search Bar is the main entry point for all app functionality.  Users will enter a search string, and possibly restrict down either by classification (things like Amulets or Photos) or by century by using a `<select>` tag that we populate by fetching the available classifications and centuries from the API.

### Fetching Category Lists

We need to build two functions: `fetchAllCenturies` and `fetchAllClassifications`.  They will be called to get the categories we can use in our search bar, and we will use the data they fetch in a third function called `prefetchCategoryLists` which takes them and adds the fields to the search bar.

The two fetch functions are very similar, so we'll walk through `fetchAllCenturies` together first, and you'll get an opportunity to write `fetchAllClassifications` by yourself.

#### Write `fetchAllCenturies`

```js
async function fetchAllCenturies() {

}
```

We need to do a few things: build the correct URL, fetch and convert the response, then return it.

The URL here should look like this:

`https://api.harvardartmuseums.org/century?apikey=YOUR_API_KEY&size=100&sort=temporalorder`

What are the things after your API key? They are query parameters. The first one says to fetch 100 things rather than the normal 10, and the second says to sort the returned records by their field "temporalorder", which is special to the century objects. This means we will have them in the order that the centuries happened, rather than by some other order.

So your code here should mimic the `fetchObjects` we built above with small changes:

* The URL is different
* Don't log the data, instead we need to return the records key in the data, rather than all of the data

For point #2, we can use our new love for object destructuring in this way.

```js
const { records } = await response.json();
```

Remember, that makes a new variable called records, and sets it equal to `(await response.json()).records`.

It means we don't have to write this, creating another variable we won't really use, other than to create the next one:

```js
const data = await response.json();
const records = data.records;
```

Ok, so you should have something that looks like this:

```js
async function fetchAllCenturies() {
  const url = `${ BASE_URL }/century?${ KEY }&size=100&sort=temporalorder`;

  try {
    const response = await fetch(url);
    const { records } = await response.json();

    return records;
  } catch (error) {
    console.error(error);
  }
}
```

Before we move on, let's add one trick that we've used before: caching. This code will be called ever time a user comes to this page, which means that we will be hitting the endpoint multiple times on page load for data which probably doesn't change very often.  We can store the records in localstorage the first time we fetch it, and use the stored records instead if they exist.

Before the try/catch block, add in the following:

```js
if (localStorage.getItem('centuries')) {
  return JSON.parse(localStorage.getItem('centuries'));
}
```

This will allow us to return the array of centuries before fetching if we've stored them.

Now, you need to store them.  Where can we do that?  Right before we return them after successful fetch.  Add a line to set the `centuries` item in `localstorage` after you get the records, but before returning them.

Call `fetchAllCenturies` twice, and look at your network tab.  There should be only one request to the API. Reload your page, call it again... amazing, we're being thoughtful with our requests!

#### Write `fetchAllClassifications`

You can now write `fetchAllClassifications`.  

* Here the url format is a bit different... the sort is on `name`, not `temporalorder`
* Also, don't use `centuries` as the localstorage key, use `classifications`

#### Write `prefetchCategoryLists`

Let me get us up and running with some boilerplate, including a new thing: `Promise.all()`:

```js
function prefetchCategoryLists() {
  try {
    const [
      classifications, centuries
    ] = await Promise.all([
      fetchAllClassifications(),
      fetchAllCenturies()
    ]);
  } catch (error) {
    console.error(error);
  }
}
```

About `Promise.all()`:

* It takes an array of promises
* It returns a promise that resolves with an array of resolved values for each promise in the original array, and rejects if any of the promises reject

So we call each fetch, wrap them in an array, and pass them into `Promise.all`.  It makes a new promise which we can await for the results on.

We could have written it this way:

```js
const results = await Promise.all([
  fetchAllClassifications(),
  fetchAllCenturies()
]);

const classifications = results[0];
const centuries = results[1];
```

Which would have been fine, but I like array destructuring, so we'll use it here.

Ok, so we have our data, let's populate the dropdowns.  Inside the function we need to loop over the two captured arrays, create an `<option>` tag for each item in them.

```js
// This provides a clue to the user, that there are items in the dropdown
$('.classification-count').text(`(${ classifications.length }))`);

classifications.forEach(classification => {
  // append a correctly formatted option tag into
  // the element with id select-classification
});

// This provides a clue to the user, that there are items in the dropdown
$('.century-count').text(`(${ centuries.length }))`);

centuries.forEach(century => {
  // append a correctly formatted option tag into
  // the element with id select-century
});
```

The formatting for the option tags is like this:

```html
<option value="value text">Display Text</option>
```

So, in each loop, use the `.name` property off of the iterating object for both the value text and the display text.  Append the newly created element into the correct select element.

#### Test it out

Call `prefetchCategoryLists`... you should be able to get a lovely dropdown for the two categories.  Congrats!

### Write `buildSearchString`

We need to write a function which will convert the form we've created into the actual search string.  The three things we need are values from:

* `#select-classification`
* `#select-century`
* `#keywords`

Then we need to assemble them into a string that looks like this:

`https://api.harvardartmuseums.org/object?apikey=YOUR_KEY_HERE&classification=Photographs&century=19th century&keyword=face`

Remember to grab values from form elements by using the jQuery `.val()` method, and finish writing `buildSearchString`.

### Listen to #search submissions

```js
$('#search').on('submit', async function (event) {
  // prevent the default

  try {
    // get the url from `buildSearchString`
    // fetch it with await, store the result
    // log out both info and records when you get them
  } catch (error) {
    // log out the error
  }
});
```

#### A bit of good UI

Here, take a few functions:

```js
function onFetchStart() {
  $('#loading').addClass('active');
}

function onFetchEnd() {
  $('#loading').removeClass('active');
}
```

These will show/remove a modal indicating we are searching for something.

The way to use it is this:

```js
async function someFetchFunction() {
  onFetchStart();

  try {
    await fetch();
  } catch (error) {
    // error stuff
  } finally {
    onFetchEnd();
  }
}
```

Go update anywhere we are fetching, and add these two function calls as above.

## Day 02

- Populate search results in preview bar
- Attach result object to preview so we can build 
- Attach URLs to prev/next buttons
- Set up prev/next fetch functionality
- Build `onFetchStart` and `onFetchEnd` functions for search scrim
- Set up try/catch/finally for everywhere a fetch happens

## Day 03


## Stretch Goals

- Add an `expirationDate` to the localstorage data.  If it is stale, remove it before calling the populate function.  This guarantees we stay relatively up to date.
- We aren't using many of the fields to prepopulate the search bar.  There's so many more!  The problem is, many of them have > 100 results, which is the max for one search. We can, however, keep searching until we've fetched them all in the same way we use pagination.  Add another dropdown to the search.  


Here's what an object looks like:

```json
{
    "objectid": 308045,
    "objectnumber": "1944.50.21",
    "accessionyear": 1944,
    "dated": "1930",
    "datebegin": 1930,
    "dateend": 1930,
    "classification": "Drawings",
    "classificationid": 21,
    "medium": "Graphite and white and red pastel on gray-green wove paper",
    "technique": null,
    "techniqueid": null,
    "period": null,
    "periodid": null,
    "century": "20th century",
    "culture": "American",
    "style": null,
    "signed": "graphite, l.r.: HMV [in monogram with bird design] / 1930",
    "state": null,
    "edition": null,
    "standardreferencenumber": null,
    "dimensions": "sight: 30.6 x 20.4 cm (12 1/16 x 8 1/16 in.)",
    "copyright": null,
    "creditline": "Harvard Art Museums/Fogg Museum, Gift of Mrs. Harold M. Vanderbilt",
    "department": "Department of Drawings",
    "division": "Modern and Contemporary Art",
    "contact": "am_moderncontemporary@harvard.edu",
    "description": null,
    "provenance": "Harold Moody Vanderbilt; to Mrs. Harold Moody Vanderbilt, 1942, gift; to the Fogg Art Museum, 1944.",
    "commentary": null,
    "labeltext": null,
    "imagecount": 1,
    "mediacount": 0,
    "colorcount": 0,
    "markscount": 2,
    "peoplecount": 1,
    "titlescount": 1,
    "publicationcount": 0,
    "exhibitioncount": 0,
    "contextualtextcount": 0,
    "groupcount": 0,
    "relatedcount": 0,
    "totalpageviews": 5,
    "totaluniquepageviews": 2,
    "dateoffirstpageview": "2014-10-03",
    "dateoflastpageview": "2016-05-26",
    "verificationlevel": 4,
    "verificationleveldescription": "Best. Object is extensively researched, well described and information is vetted",
    "imagepermissionlevel": 1,
    "accesslevel": 1,
    "accessionmethod": "Gift",
    "rank": 71688,
    "url": "https://www.harvardartmuseums.org/collections/object/308045",
    "id": 308045,
    "lastupdate": "2020-03-21T05:41:41-0400",
    "primaryimageurl": null,
    "images": [],
    "marks": [
        {
            "text": "l.l., graphite, in artist's hand: Zürich",
            "type": "inscription"
        },
        {
            "text": "verso of mat, paper, handwritten: #16 / Zürich",
            "type": "label"
        }
    ],
    "people": [
        {
            "alphasort": "Vanderbilt, Harold Moody",
            "birthplace": "Clarkstown, N.Y.",
            "name": "Harold Moody Vanderbilt",
            "prefix": null,
            "personid": 29170,
            "gender": "unknown",
            "role": "Artist",
            "displayorder": 1,
            "culture": "American",
            "displaydate": "1879 - 1942",
            "deathplace": "Cambridge, Mass.",
            "displayname": "Harold Moody Vanderbilt"
        }
    ],
    "terms": {
        "medium": [
            {
                "id": 2028183,
                "name": "Graphite"
            }
        ],
        "century": [
            {
                "id": 37525815,
                "name": "20th century"
            }
        ],
        "culture": [
            {
                "id": 37526778,
                "name": "American"
            }
        ],
        "support": [
            {
                "id": 2028173,
                "name": "paper"
            },
            {
                "id": 2028174,
                "name": "wove paper"
            }
        ]
    },
    "title": "Zurich, Switzerland",
    "titles": [
        {
            "title": "Zurich, Switzerland",
            "titletype": "Title",
            "displayorder": 1,
            "titleid": 696365
        }
    ],
    "worktypes": [
        {
            "worktypeid": "125",
            "worktype": "drawing"
        }
    ],
    "seeAlso": [
        {
            "id": "https://iiif.harvardartmuseums.org/manifests/object/308045",
            "type": "IIIF Manifest",
            "format": "application/json",
            "profile": "http://iiif.io/api/presentation/2/context.json"
        }
    ]
}
```