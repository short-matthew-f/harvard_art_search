const API = {
  ROOT: 'https://api.harvardartmuseums.org',
  RESOURCES: {
    OBJECT: 'object', // 234230
    CLASSIFICATION: 'classification', // 57
    CENTURY: 'century', // 47
    /* below here are unused keys */
    PERSON: 'person', // 39506
    EXHIBITION: 'exhibition', // 4652
    PUBLICATION: 'publication', // 15751
    GALLERY: 'gallery', // 64
    SPECTRUM: 'spectrum',
    COLOR: 'color', // 147
    CULTURE: 'culture', // 255
    GROUP: 'group', // 27
    MEDIUM: 'medium', // 271
    PERIOD: 'period', // 310
    PLACE: 'place', // 2539
    TECHNIQUE: 'technique', // 314
    WORKTYPE: 'worktype', // 405
    ACTIVITY: 'activity', // 11021739
    SITE: 'site', // 3
    VIDEO: 'video', // 40
    IMAGE: 'image', // 367131
    AUDIO: 'audio', // 9
    ANNOTATION: 'annotation', // 25097915
  },
  KEY: 'apikey=1ed6bd20-6ced-11ea-8bdc-95909fa24347'
};

function onFetchStart() {
  $('#loading').addClass('active');
}

function onFetchEnd() {
  $('#loading').removeClass('active');
}

async function fetchAllCenturies() {
  if (localStorage.getItem('centuries')) {
    return JSON.parse(localStorage.getItem('centuries'));
  }

  try {
    const response = await fetch(`${ API.ROOT }/${ API.RESOURCES.CENTURY }?${ API.KEY }&size=100&sort=temporalorder`);
    const { info, records } = await response.json();
    localStorage.setItem('centuries', JSON.stringify(records));

    return records;
  } catch (error) {
    console.error(error);
  }
}

async function fetchAllClassifications() {
  if (localStorage.getItem('classifications')) {
    return JSON.parse(localStorage.getItem('classifications'));
  }

  try {
    const response = await fetch(`${ API.ROOT }/${ API.RESOURCES.CLASSIFICATION }?${ API.KEY }&size=100&sort=name`);
    const { info, records } = await response.json();
    localStorage.setItem('classifications', JSON.stringify(records));

    return records;
  } catch (error) {
    console.error(error);
  }
}

async function prefetchCategoryLists() {
  const [
    classifications, centuries
  ] = await Promise.all([
    fetchAllClassifications(),
    fetchAllCenturies()
  ]);

  $('.classification-count').text(`(${ classifications.length })`);
  classifications.forEach(classification => {
    $('#select-classification')
      .append($(`<option value="${ classification.name }">${ classification.name }</option>`));
  });
  
  $('.century-count').text(`(${ centuries.length })`);
  centuries.forEach(century => {
    $('#select-century')
      .append($(`<option value="${ century.name }">${ century.name }</option>`));
  });
}

function buildSearchString() {
  const base = `${ API.ROOT }/${ API.RESOURCES.OBJECT }?${ API.KEY }`;

  const terms = [...$('#search select')].map(el => {
    return `${ $(el).attr('name') }=${ $(el).val() }`
  }).join('&');
  
  const keywords = `keyword=${ $('#keywords').val() }`;

  return `${ base }&${ terms }&${ keywords }`
}

function updatePreview(records, info) {
  const root = $('#preview');
  
  if (info.next) {
    root.find('.next')
      .data('url', info.next)
      .attr('disabled', false);
  } else {
    root.find('.next')
      .data('url', null)
      .attr('disabled', true);
  }
  
  if (info.prev) {
    root.find('.previous')
      .data('url', info.prev)
      .attr('disabled', false);
  } else {
    root.find('.previous')
      .data('url', null)
      .attr('disabled', true);
  }
  
  const resultsElement = root.find('.results');
  resultsElement.empty();

  records.forEach(objectRecord => {
    resultsElement.append(
      renderObjectRecordPreview(objectRecord)
    );
  });

  resultsElement.animate({ scrollTop: 0 }, 500);
}

function renderObjectRecordPreview(objectRecord) {
  const {
    description,
    primaryimageurl,
    title,
  } = objectRecord;

  return $(`<div class="object-preview">
    <a href="#">
    ${
      primaryimageurl && title
      ? `<img src="${ primaryimageurl }" /><h3>${ title }<h3>`
      : title
      ? `<h3>${ title }<h3>`
      : description
      ? `<h3>${ description }<h3>`
      : `<img src="${ primaryimageurl }" />`
    }
    </a>
  </div>`).data('objectRecord', objectRecord);
}

function renderObjectRecordFeature(objectRecord) {
  const { 
    title, 
    dated,
    images,
    primaryimageurl,
    description,
    culture,
    style,
    technique,
    medium,
    dimensions,
    people,
    department,
    division,
    contact,
    creditline,
  } = objectRecord;

  return $(`<div class="object-feature">
    <header>
      <h3>${ title }<h3>
      <h4>${ dated }</h4>
    </header>
    <section class="facts">
      ${ factHTML('Description', description) }
      ${ factHTML('Culture', culture, 'culture') }
      ${ factHTML('Style', style) }
      ${ factHTML('Technique', technique, 'technique' )}
      ${ factHTML('Medium', medium ? medium.toLowerCase() : null, 'medium') }
      ${ factHTML('Dimensions', dimensions) }
      ${ 
        people 
        ? people.map(
            person => factHTML('Person', person.displayname, 'person')
          ).join('')
        : ''
      }
      ${ factHTML('Department', department) }
      ${ factHTML('Division', division) }
      ${ factHTML('Contact', `<a target="_blank" href="mailto:${ contact }">${ contact }</a>`) }
      ${ factHTML('Credit', creditline) }
    </section>
    <section class="photos">
      ${ photosHTML(images, primaryimageurl) }
    </section>
  </div>`);
}

function factHTML(title, content, searchTerm = null) {
  if (!content) {
    return ''
  }

  return `
    <span class="title">${ title }</span>
    <span class="content">${
      searchTerm && content
      ? `<a href="${ 
         API.ROOT 
        }/${
         API.RESOURCES.OBJECT 
        }?${
          API.KEY
        }&${ 
          searchTerm 
        }=${ 
          encodeURI(content.split('-').join('|')) 
        }">${ 
          content
        }</a>`
      : content
    }
    </span>
  `
}

function photosHTML(images, primaryimageurl) {
  if (images.length > 0) {
    return images.map(
      image => `<img src="${ image.baseimageurl }" />`).join('');
  } else if (primaryimageurl) {
    return `<img src="${ primaryimageurl }" />`;
  } else {
    return '';
  }
}

$('#search').on('submit', async function (event) {
  event.preventDefault();
  onFetchStart();

  try {
    const response = await fetch(buildSearchString());
    const { records, info } = await response.json();  
    updatePreview(records, info);
  } catch (error) {
    console.error(error);
  } finally {
    onFetchEnd();
  }
});

$('#preview .next, #preview .previous').on('click', async function () {
  onFetchStart();

  try {
    const url = $(this).data('url');
    const response = await fetch(url);
    const { records, info } = await response.json();  
    
    updatePreview(records, info);
  } catch (error) {
    console.error(error);
  } finally {
    onFetchEnd();
  }
});

$('#preview').on('click', '.object-preview', function (event) {
  event.preventDefault();

  const objectRecord = $(this).data('objectRecord');
  
  const featureElement = $('#feature');
  featureElement.html( renderObjectRecordFeature(objectRecord) );  
});

$('#feature').on('click', 'a', async function (event) {
  const href = $(this).attr('href');

  if (href.startsWith('mailto:')) {
    return;
  }

  event.preventDefault();

  onFetchStart();
  try {
    let result = await fetch(href);
    let { records, info } = await result.json();
    updatePreview(records, info);
  } catch (error) {
    console.error(error)
  } finally {
    onFetchEnd();
  }
});

prefetchCategoryLists();
