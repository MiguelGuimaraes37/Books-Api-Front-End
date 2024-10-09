dataRequest();

function dataRequest() {
    $.ajax({
        url: 'http://localhost:8080/restExercise/api/books',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            populateTable(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('AJAX request failed:', textStatus, errorThrown);
        }
    });
}

function getBookById(bookId) {
    $.ajax({
        url: 'http://localhost:8080/restExercise/api/books/id/' + bookId,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            populateFields(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('AJAX request failed:', textStatus, errorThrown);
        }
    });
}

function createBook() {

    if(document.getElementById("idInput").value.length === 0) {

        if(validFields() === true) {

            fetch('http://localhost:8080/restExercise/api/books/isbn/' + document.getElementById("isbnInput").value)
            .then(response => {
            if (!response.ok) {
                $.ajax({
                    url: 'http://localhost:8080/restExercise/api/books/create',
                    method: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        title: document.getElementById("titleInput").value,
                        author: document.getElementById("authorInput").value,
                        isbn: document.getElementById("isbnInput").value,
                        publishedDate: document.getElementById("publishedDateInput").value,
                        price: document.getElementById("priceInput").value
                    }), 
                        success: function() {
            
                        alert("Book: " + document.getElementById("titleInput").value + " has been created!");
            
                        location.href = location.href;
            
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            alert('AJAX request failed:', textStatus, errorThrown);
                        }
                    });
            } else {
                alert("ISBN already in use!");
            } 
        })
        }
    }
    else {
        alert("Clean first!")
    }
    
}

function updateBookById() {

    if(document.getElementById("idInput").value.length > 0) {
        
        if(validFields()) {

            fetch('http://localhost:8080/restExercise/api/books/book/' + document.getElementById("isbnInput").value + '/' + document.getElementById("idInput").value)
            .then(response => {
            if (!response.ok) {
                $.ajax({
                    url: 'http://localhost:8080/restExercise/api/books/edit/' + document.getElementById("idInput").value,
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        id: document.getElementById("idInput").value,
                        title: document.getElementById("titleInput").value,
                        author: document.getElementById("authorInput").value,
                        isbn: document.getElementById("isbnInput").value,
                        publishedDate: document.getElementById("publishedDateInput").value,
                        price: document.getElementById("priceInput").value
                    }), 
                    success: function() {
            
                        alert("BookId: " + document.getElementById("idInput").value + " has been updated!");
            
                        location.href = location.href;
            
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        alert('AJAX request failed:', textStatus, errorThrown);
                    }
                }).catch(error => {
                    console.log("É o log " + error);

                })
            }
            else {
                alert("ISBN already in use!")
            }

            });

            }
            
        }
        else {
            alert("Select a book!");
        }
    }

function populateFields(data) {
    document.getElementById("idInput").value = data.id;
    document.getElementById("titleInput").value = data.title;
    document.getElementById("authorInput").value = data.author;
    document.getElementById("isbnInput").value = data.isbn;
    document.getElementById("publishedDateInput").value = data.publishedDate;
    document.getElementById("priceInput").value = data.price;
}

function clearInputs() {
    document.getElementById("titleInput").value = "";
    document.getElementById("authorInput").value = "";
    document.getElementById("isbnInput").value = "";
    document.getElementById("publishedDateInput").value = "";
    document.getElementById("priceInput").value = "";
    document.getElementById("idInput").value = "";
}

function validFields() {

    const regexDate = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;
    const regexISBN = /^[0-9]{3}-[0-9]-[0-9]{2}-[0-9]{6}-[0-9]$/;
    const isbnInputValue = document.getElementById("isbnInput").value;
    const currentDate = new Date();
    const partsOfDate = document.getElementById("publishedDateInput").value.split('-');
    const reversedDateString = `${partsOfDate[2]}-${partsOfDate[1]}-${partsOfDate[0]}`; 
    const inputDate = new Date(reversedDateString);

    
    if(document.getElementById("titleInput").value.length < 3) {
        alert("Title has to have at list 3 characters");
        return false;
    }
    else if(document.getElementById("authorInput").value.length < 3) {
        alert("Author has to have at list 3 characters");
        return false;
    }
    else if(isbnInputValue.length !== 17 && !regexISBN.test(isbnInputValue)) {
        alert("ISBN has to have 17 characters");
        return false;
    }
    if(!regexISBN.test(isbnInputValue)) {
        alert("Wrong ISBN, ex: NNN-N-NN-NNNNNN-N");
        return false;
    }
    if (!regexDate.test(document.getElementById("publishedDateInput")) && document.getElementById("publishedDateInput").value.length !== 10) {
        alert("Invalid date, ex: DD-MM-YYYY")
        return false;
    }
    if (inputDate > currentDate) {
        alert("Date cannot be bigger than current date!");
        return false;
    }
    if (document.getElementById("priceInput").value <= 0 || document.getElementById("priceInput").value.length <= 0) {
        alert("Invalid price");
        return false;
    }

    return true;
}

function populateTable(data) {
    const tableBody = document.querySelector('#data-table tbody');
    
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        
        const cellId = document.createElement('td');
        cellId.textContent = item.id;
        row.appendChild(cellId);

        const cellTitle = document.createElement('td');
        cellTitle.textContent = item.title;
        row.appendChild(cellTitle);

        const cellAuthor = document.createElement('td');
        cellAuthor.textContent = item.author;
        row.appendChild(cellAuthor);

        const cellISBN = document.createElement('td');
        cellISBN.textContent = item.isbn;
        row.appendChild(cellISBN);

        const cellPublishedDate = document.createElement('td');
        cellPublishedDate.textContent = item.publishedDate;
        row.appendChild(cellPublishedDate);
        
        const cellPrice = document.createElement('td');
        cellPrice.textContent = item.price;
        row.appendChild(cellPrice);

        const cellEditButton = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.onclick = function() {
            getBookById(item.id);
        };
        editButton.className = "btn btn-warning"
        editButton.textContent = "Select";
        cellEditButton.appendChild(editButton);
        row.appendChild(cellEditButton);

        const cellDeleteButton = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.onclick = function() {
            $.ajax({
                url: 'http://localhost:8080/restExercise/api/books/delete/' + item.id,
                method: 'DELETE',
                dataType: 'json',
            });

            location.href = location.href;
        };
        deleteButton.className = "btn btn-danger"
        deleteButton.textContent = "Delete";
        cellDeleteButton.appendChild(deleteButton);
        row.appendChild(cellDeleteButton);

        tableBody.appendChild(row);
    });
}