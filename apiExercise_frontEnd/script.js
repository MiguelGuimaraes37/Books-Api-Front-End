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
        url: 'http://localhost:8080/restExercise/api/books/' + bookId,
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

function editBookById() {

    if(document.getElementById("idInput").value != "") {
        
        if(validFields()) {
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

function cancelFunction() {
    clearInputs();
}

function validFields() {
    const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;
    
    if(document.getElementById("titleInput").value.length < 3) {
        alert("Title has to have at list 3 characters");
        return false;
    }
    else if(document.getElementById("authorInput").value.length < 3) {
        alert("Author has to have at list 3 characters");
        return false;
    }
    else if(document.getElementById("isbnInput").value.length !== 17) {
        alert("ISBN has to have 17 characters, with hifens ex: NNN-N-NN-NNNNNN-N");
        return false;
    }
    if (!regex.test(document.getElementById("publishedDateInput")) && document.getElementById("publishedDateInput").value.length !== 10) {
        alert("Invalid date, ex: DD-MM-YYYY")
        return false;
    }
    if (document.getElementById("priceInput").value <= 0 || document.getElementById("priceInput").value.length <= 0) {
        alert("Invalid price");
        return false;
    }

    return true;
}

function createBook() {
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

            alert("BookId: " + document.getElementById("titleInput").value + " has been created!");

            location.href = location.href;

        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('AJAX request failed:', textStatus, errorThrown);
        }
    });
}

function createFunction() {
    if(validFields() === true) {
        createBook();
    }
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
        console.error
        const cellPrice = document.createElement('td');
        cellPrice.textContent = item.price;
        row.appendChild(cellPrice);

        const cellEditButton = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.onclick = function() {
            getBookById(item.id);
        };
        editButton.className = "btn btn-warning"
        editButton.textContent = "Edit";
        cellEditButton.appendChild(editButton);
        row.appendChild(cellEditButton);

        const cellDeleteButton = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.onclick = function() {
            $.ajax({
                url: 'http://localhost:8080/restExercise/api/books/delete/' +item.id,
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