const perPageCount = 4;
var allData = [];
var filterData = [];
var typeFilterData = [];
var searchFilterData = [];
var totalCount = 0;
var checkValues = [];
var renderPageData = [];
var pageStartCount;
var pageEndCount;
var nextClick;
var prevClick;
const fieldNameObj = {};
const finalData = [];
var previousBtn;
var nextBtn;

const getData = (start, end) => {
  fetch('data/airports.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    setFieldName(data);  
    allData = finalData;    
    formatFilterData(allData, start, end)    
  })
  .catch(function (err) {
    console.log(err);
  });
}

getData(0, perPageCount);

function formatFilterData(allData, start, end) {
  totalCount = allData.length;      
    previousBtn = document.querySelector('.prev');  
    nextBtn = document.querySelector('.next');  
    if(start <= 0) {
      previousBtn.classList.add('disabled')
    } else {
      previousBtn.classList.remove('disabled')
    }
    if(end >= totalCount) {
      nextBtn.classList.add('disabled')
    } else {
      nextBtn.classList.remove('disabled')
    }
    const airportData = allData.slice(start, end);
    appendData(airportData);
    const pageStart = start;
    const pageTo = end;
    renderPagination(allData, totalCount, pageStart, pageTo);
    const typeCheckbox = document.querySelectorAll("input[type=checkbox]");    
    for (var i = 0; i < typeCheckbox.length; i++) {
      typeCheckbox[i].addEventListener("change", typeFilter);
    }
    const search = document.querySelector("#search");
    search.addEventListener('keypress', searchFilter)
}

function setFieldName(data) {
  for (let temp of data) {
      this.fieldNameObj = {
          "Name": temp.name,
          "ICAO": temp.icao,
          "IATA": temp.iata,
          "Elev.": temp.elevation,
          "Lat.": temp.latitude,
          "Long.": temp.longitude,
          "Type": temp.type,
      }
      finalData.push(this.fieldNameObj);
  }  
}

function appendData(data) {        
  var col = [];
  for (var i = 0; i < data.length; i++) {
    for (var key in data[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }

  // Create a table.
  var table = document.createElement("table");

  // Create table header row using the extracted headers above.
  var tr = table.insertRow(-1);                   // table row.

  for (var i = 0; i < col.length; i++) {
    var th = document.createElement("th");      // table header.
    th.innerHTML = col[i];
    tr.appendChild(th);    
  }

  // add json data to the table as rows.
  for (var i = 0; i < data.length; i++) {

    tr = table.insertRow(-1);

    for (var j = 0; j < col.length; j++) {
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = data[i][col[j]];
    }
  }

  // Now, add the newly created table with json data, to a container.
  var divShowData = document.getElementById('myData');
  divShowData.innerHTML = "";
  divShowData.appendChild(table);
};

// pagination
const  renderPagination = (allData, totalCount, startCount, endCount) => {  
  setRecords(startCount, endCount);
  const totalCountSpan = document.querySelector(".totalCount");
  nextClick = document.querySelector('.next');
  prevClick = document.querySelector('.prev');
  if(prevClick) {    
    prevClick.addEventListener('click', prevPage);
  }
  
  if(nextClick) {
    nextClick.addEventListener('click', nextPage);
  }
  totalCountSpan.innerHTML = totalCount;
  renderPageData = allData;
  pageStartCount = startCount;
  pageEndCount = endCount;
};

function setRecords(startCount, endCount) {
  const pageStart = document.querySelector(".pageStart");
  const pageTo = document.querySelector(".pageTo");
  if(startCount < 0) {
    pageStart.innerHTML = 0;
    pageTo.innerHTML = 0;
  } else {
    pageStart.innerHTML = (startCount + 1);
  }
  if(endCount > totalCount) {
    pageTo.innerHTML = totalCount;
  } else {
    pageTo.innerHTML = endCount;
  }
}

// type Filter
function typeFilter(e) {  
  if (e.target.checked) {
    checkValues.push(e.target.value);
    const checkFilterData = allData.filter((airport) => {      
      return (checkValues.some(value => airport.Type.toLowerCase().includes(value.toLowerCase())))
    });
    filterData = checkFilterData;
    formatFilterData(filterData, 0, perPageCount);
    typeFilterData = filterData;     
  } else {    
    for( var i = 0; i < checkValues.length; i++){                                    
      if ( checkValues[i] === e.target.value) { 
          checkValues.splice(i, 1); 
          i--; 
      }
    }
    const checkFilterData = allData.filter((airport) => {      
      return (checkValues.some(value => airport.Type.toLowerCase().includes(value.toLowerCase())))
    });
    filterData = checkFilterData;
    formatFilterData(filterData, 0, perPageCount);
    typeFilterData = filterData;   
  }
  if(checkValues.length === 0) {
    filterData = allData;
    formatFilterData(filterData, 0, perPageCount);
    typeFilterData = filterData;   
  }
}

// Search filter
function searchFilter(e) {
  if (e.key === 'Enter') {     
    if(typeFilterData.length > 0) {
      filterData = typeFilterData;
    } else {
      filterData = allData;
    }  
    filterData = filterData.filter((airport) => {
      return (
        airport.Name.toLowerCase().includes(e.target.value.toLowerCase()) || 
        airport.ICAO.toLowerCase().includes(e.target.value.toLowerCase()) ||
        airport.IATA.toLowerCase().includes(e.target.value.toLowerCase())
      )
    });
    searchFilterData = filterData;
    formatFilterData(filterData, 0, perPageCount);
  }
}

function nextPage() {
  const start = pageStartCount + perPageCount;
  const end = pageEndCount + perPageCount;    
  if(start > 0 && end >= start) {    
    appendData(renderPageData.slice(start, end));
    setRecords(start, end);
  } else {
    // next.classList.add('disabled');
  }    
  pageStartCount = start;
  pageEndCount = end;
  if(end <= renderPageData.length) {
    nextBtn.classList.remove('disabled')
  } else {
    nextBtn.classList.add('disabled')
  }
  if(start >= 0) {
    previousBtn.classList.remove('disabled')
  } else {
    previousBtn.classList.add('disabled')
  }
}

function prevPage()  {
  const start = pageStartCount - perPageCount;
  const end = pageEndCount - perPageCount;     
  if((start + 1) > 0) {
    appendData(renderPageData.slice(start, end));
    setRecords(start, end);  
  } else {
    // prev.classList.add('disabled');
  }
  pageStartCount = start;
  pageEndCount = end;
  if(end <= renderPageData.length) {
    nextBtn.classList.remove('disabled')
  } else {
    nextBtn.classList.add('disabled')
  }
  if(start >= 0) {
    previousBtn.classList.remove('disabled')
  } else {
    previousBtn.classList.add('disabled')
  }
}

