var productsCollection = [];
var container;
var productsInCart = [];
var divRow;

window.onload = function () {
    createContainer();
    createNavBarActions();
    initiateHTTPRequest();
    addProductsToCartFromLocalStorage();
    showFloatingDiv();
};

function initiateHTTPRequest() {
    // Establishing connection - GET
    var Http = new XMLHttpRequest();
    var url = 'https://gist.githubusercontent.com/a7med-hussien/7fc3e1cba6abf92460d69c0437ce8460/raw/da46abcedf99a3d2bef93a322641926ff60db3c3/products.json';
    Http.open('GET', url);
    Http.send();
    Http.onreadystatechange = function () {
        if (this.readyState == 4) {
            var obj = JSON.parse(Http.responseText);
            // Using array of products to show items from the object
            productsCollection = obj['ProductCollection'];
            // creating a parent dive for all the cards of the products
            divRow = document.createElement('div');
            // class row to set element beside each other
            divRow.classList.add('row');
            // adding the row to the body of the page
            container.appendChild(divRow);

            // creating a card for each  element in the array
            for (var i = 0; i < productsCollection.length; i++) {
                //each product has a div named products contains two smaller divs
                var product = document.createElement('div');
                product.classList.add('col-md-4', 'align-items-stretch', 'd-flex');
                //first div named card
                var card = document.createElement('div');
                card.classList.add('card', 'shadow-sm', 'mb-4', 'card-link');
                card.style.width = '18rem';
                card.setAttribute('id', productsCollection[i]['ProductId']);
                card.addEventListener('mouseover', cardMouseOver);
                card.addEventListener('mouseout', cardMouseOut);
                card.addEventListener('click', createProductSinglePage);

                var img = document.createElement('img');
                img.setAttribute('src', productsCollection[i]['ProductPicUrl']);
                img.classList.add('card-img-top', 'rounded');
                img.setAttribute('style', 'height:200px; padding:2px')
                card.appendChild(img);
                //second div called body
                var body = document.createElement('div');
                body.classList.add('card-body');

                var desc = document.createElement('h5');
                desc.classList.add('card-title', 'text-center');

                var node = document.createTextNode(productsCollection[i]['Name']);
                desc.appendChild(node);
                body.appendChild(desc);

                var price = document.createElement('p');
                price.classList.add('card-text', 'text-center');

                var node = document.createTextNode(productsCollection[i]['Price'] + ' ' + productsCollection[i]['CurrencyCode']);
                price.appendChild(node);
                body.appendChild(price);
                var button = document.createElement('button');
                button.classList.add('btn', 'btn-light', 'btn-add-to-cart');
                button.addEventListener('click', addItemToCart);

                node = document.createTextNode('Add to cart');

                button.appendChild(node);
                card.appendChild(body);
                card.appendChild(button);
                product.appendChild(card);
                divRow.appendChild(product);
            }
        }
    }
};

function createContainer() {
    container = document.createElement('div');
    container.classList.add('container');
    document.getElementsByTagName('main')[0].appendChild(container);
};

//used in creating Single product's page
function createProductDetails(itemDetails, classes, div) {
    var element = document.createElement('p');
    element.className += classes;
    element.appendChild(document.createTextNode(itemDetails));
    div.appendChild(element);
}

//used in creating Single product's page
function createProductSpecsList(head, item, descList) {
    var title = document.createElement('dt');
    title.classList.add('col-sm-3');
    title.appendChild(document.createTextNode(head));
    descList.appendChild(title);

    var data = document.createElement('dd');
    data.classList.add('col-sm-9');
    data.appendChild(document.createTextNode(item));
    descList.appendChild(data);
};

function createNavBarActions() {
    var pages = document.querySelectorAll('li');
    for (var i = 0; i < 3; i++) {
        pages[i].addEventListener('click', navBarClickHandler);
    }
    pages[0].className += ' active';

    var cartPage = document.querySelector('#cart-nav');
    cartPage.addEventListener('click', navBarClickHandler);
};

function navBarClickHandler() {
    var pages = document.querySelectorAll('li');
    for (var i = 0; i < pages.length; ++i) {
        if (pages[i].id !== this.id) {
            pages[i].className = 'nav-item';
        }
    }
    if (this.id !== 'cart-nav') {
        this.className = 'nav-item active';
    }
    container.innerHTML = '';
    switch (this.id) {
        case 'home-nav':
            container.className = 'container';
            initiateHTTPRequest();
            showFloatingDiv();
            break;
        case 'about-nav':
            createAboutUsPage();
            break;
        case 'contact-nav':
            createContactPage();
            break;
        case 'cart-nav':
            createCartPage();
            break;
    };
};

function createContactPage() {
    var form = document.createElement('form');
    var formRow = document.createElement('div');
    formRow.classList.add('form-row');

    var label = document.createElement('label');
    label.appendChild(document.createTextNode('Name'));

    var name = document.createElement('input');
    name.setAttribute('placeholder', 'Name');
    name.setAttribute('type', 'text');
    name.classList.add('form-control');

    formRow.appendChild(label);
    formRow.appendChild(name);
    form.appendChild(formRow);

    formRow = document.createElement('div');
    formRow.classList.add('form-row');

    label = document.createElement('label');
    label.appendChild(document.createTextNode('Email'));

    var email = document.createElement('input');
    email.setAttribute('placeholder', 'Email');
    email.setAttribute('type', 'email');
    email.classList.add('form-control');

    formRow.appendChild(label);
    formRow.appendChild(email);
    form.appendChild(formRow);

    formRow = document.createElement('div');
    formRow.classList.add('mb-3');

    label = document.createElement('label');
    label.appendChild(document.createTextNode('Subject'));

    var subject = document.createElement('input');
    subject.setAttribute('placeholder', 'Subject');
    subject.setAttribute('type', 'text');
    subject.classList.add('form-control');

    formRow.appendChild(label);
    formRow.appendChild(subject);
    form.appendChild(formRow);

    formRow = document.createElement('div');
    formRow.classList.add('mb-3');

    label = document.createElement('label');
    label.appendChild(document.createTextNode('Message'));

    var message = document.createElement('textarea');
    message.setAttribute('placeholder', 'Message');
    message.setAttribute('rows', '4');
    message.classList.add('form-control');
    formRow.appendChild(label);
    formRow.appendChild(message);
    form.appendChild(formRow);

    var button = document.createElement('button');
    button.classList.add('btn', 'btn-primary');
    button.addEventListener('click', function () {
        event.preventDefault();
        var objData = {
            name: name.value,
            subject: subject.value,
            message: message.value,
            email: email.value,
        };
        var myRequest = new XMLHttpRequest();
        myRequest.open('POST', 'http://js.vacsera.com/api/final-project');
        myRequest.setRequestHeader('Content-Type', 'application/json');
        myRequest.send(JSON.stringify(objData));
        name.value = subject.value = message.value = email.value = '';
    });
    button.appendChild(document.createTextNode('Send'));
    form.appendChild(document.createElement('br'));
    form.appendChild(button);

    container.appendChild(form);
    container.classList.add('container');
    container.classList.remove('container-fluid');

};

function addProductsToCartFromLocalStorage() {
    //add data from local storage
    if (localStorage.getItem('productsInCart')) {
        productsInCart = JSON.parse(localStorage.getItem('productsInCart'));
    }
};
//when hovering on a product's card
function cardMouseOut() {
    this.classList.remove('text-white', 'card-mouse-over');

};
//when hovering on a product's card
function cardMouseOver() {
    this.classList.add('text-white', 'card-mouse-over');
};

function createProductSinglePage() {
    //creating product's Single page

    //Empty the page
    container.innerHTML = '';
    container.className = 'container-fluid';
    container.setAttribute('height', '100%');

    //look for product index in the array of products
    var index = productsCollection.findIndex(x => x.ProductId === this.id);
    //check if this item was already added to the cart or not and if yes, finds its index
    var indexOfElementInCart = productsInCart.findIndex(x => x.ProductId === this.id);


    var row = document.createElement('div');
    row.classList.add('row');

    var productImg = document.createElement('div');
    productImg.classList.add('col-md-6', 'text-center');

    var img = document.createElement('img');
    img.setAttribute('src', productsCollection[index]['ProductPicUrl']);
    productImg.appendChild(img);
    row.appendChild(productImg);

    var productPanel = document.createElement('div');
    productPanel.classList.add('col-md-6');

    createProductDetails(productsCollection[index]['Category'], ' text-muted', productPanel);
    createProductDetails(productsCollection[index]['Name'], ' display-3', productPanel);
    createProductDetails(productsCollection[index]['Description'], ' h4 font-weight-normal', productPanel);
    createProductDetails(productsCollection[index]['Price'] + ' ' + productsCollection[index]['CurrencyCode'], ' font-italic display-4', productPanel);

    //creating product specifications list
    var element = document.createElement('h3');
    element.appendChild(document.createTextNode('PRODUCT SPECS'));
    productPanel.appendChild(document.createElement('hr'));
    productPanel.appendChild(element);

    var div = document.createElement('div');
    div.classList.add('row');

    var descList = document.createElement('dl');
    descList.classList.add('col-md-8', 'row');

    createProductSpecsList('Status:', productsCollection[index]['Status'], descList);
    createProductSpecsList('Weight Measure:', productsCollection[index]['WeightMeasure'] + productsCollection[index]['WeightUnit'], descList);
    createProductSpecsList('Width:', productsCollection[index]['Width'] + productsCollection[index]['DimUnit'], descList);
    createProductSpecsList('Depth:', productsCollection[index]['Depth'] + productsCollection[index]['DimUnit'], descList);
    createProductSpecsList('Height:', productsCollection[index]['Height'] + productsCollection[index]['DimUnit'], descList);

    //creating cart buttons
    var cartPanel = document.createElement('div');
    cartPanel.classList.add('col-md-4');
    cartPanel.setAttribute('id', this.id)

    var noOFItems = document.createElement('h5');
    noOFItems.classList.add('text-center', 'col-md-4', 'text-wrap', 'font-weight-bold');
    noOFItems.appendChild(document.createTextNode((indexOfElementInCart === -1) ? '0' : productsInCart[indexOfElementInCart]['Quantity']));

    var addItem = document.createElement('button');
    addItem.classList.add('btn', 'btn-primary', 'col-md-4', 'text-wrap');
    addItem.appendChild(document.createTextNode('+'));
    addItem.addEventListener('click', addItemToCartFromProductSinglePage);

    var removeItem = document.createElement('button');
    removeItem.classList.add('btn', 'btn-primary', 'col-md-4');
    removeItem.appendChild(document.createTextNode('-'));
    removeItem.addEventListener('click', removeItemFromCartFromProductSinglePage);

    cartPanel.appendChild(addItem);
    cartPanel.appendChild(noOFItems);
    cartPanel.appendChild(removeItem);

    div.appendChild(descList);
    div.appendChild(cartPanel);

    productPanel.appendChild(div);
    row.appendChild(productPanel);
    container.appendChild(row);

};

function addItemToCart(e) {
    //adding items to cart from home page

    //look for product index in the array of products
    var index = productsCollection.findIndex(x => x.ProductId === this.parentNode.id);
    //check if this item was already added to the cart or not and if yes finds its index
    var elementInCart = productsInCart.findIndex(x => x.ProductId === this.parentNode.id);

    if (elementInCart === -1) {
        //if item wasn't in the cart the add it
        var product = {
            'Name': productsCollection[index]['Name'],
            'ProductId': productsCollection[index]['ProductId'],
            'ProductPicUrl': productsCollection[index]['ProductPicUrl'],
            'Price': productsCollection[index]['Price'],
            'CurrencyCode': productsCollection[index]['CurrencyCode'],
            'Quantity': 1
        }
        productsInCart.push(product);
    } else {
        //if it was the increase its quantity after checking the stock's limit
        if (productsInCart[elementInCart]['Quantity'] < productsCollection[index]['Quantity'])
            productsInCart[elementInCart]['Quantity']++;
        else
            alert('Item out of stock!');
    }
    localStorage.setItem('productsInCart', JSON.stringify(productsInCart));
    updateFloatingDiv();
    e.stopPropagation();
};

function sendMessage(event) {
    event.preventDefault();
    alert('submit');
    var objData = {
        name: name.value,
        subject: subject.value,
        message: message.value,
        email: email.value,
    };
    var myRequest = new XMLHttpRequest();
    myRequest.open('POST', 'http://js.vacsera.com/api/final-project');
    myRequest.setRequestHeader('Content-Type', 'application/json');
    myRequest.send(JSON.stringify(objData));
}

function createAboutUsPage() {
    container.innerHTML = `
<div class="about-body">
<div class="section" id="about">
    <div class="container">
        <div class="row ">
            <img  class="col-lg-6 col-md-12rounded mx-auto d-block"  src="images/personal-image.jpg" width="20%px" height="10%">
        </div>
        <div class="card-about">
            <div class="row">
                <div class="col-lg-6 col-md-12">
                    <div class="card-body">
                        <div class="h4 mt-0 title">About</div>
                        <p class="passage">Hello! I am Mahydit Mahmoud Anber. Web Developer, Graphic Designer and Photographer.</p>
                        <p class="passage">Magna cillum dolore qui qui minim ea aute. Excepteur voluptate cupidatat ut sint
                            reprehenderit exercitation magna. Cupidatat nostrud velit est est do duis sit labore
                            quis reprehenderit duis sunt. Eu ipsum aliqua laborum laborum nisi minim fugiat nisi do
                            eiusmod elit labore dolor. Deserunt amet qui nulla ex.
                            <!-- <a href="https://templateflip.com/templates/creative-cv/"target="_blank">Learn More</a>-->
                        </p>
                    </div>
                </div>
                <div class="col-lg-6 col-md-12">
                    <div class="card-body">
                        <div class="h4 mt-0 title">Basic Information</div>
                        <div class="row">
                            <div class="col-sm-4"><strong class="text-uppercase">Age:</strong></div>
                            <div class="col-sm-8">23</div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-sm-4"><strong class="text-uppercase">Email:</strong></div>
                            <div class="col-sm-8">mahydit_anber@outlook.com</div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-sm-4"><strong class="text-uppercase">Phone:</strong></div>
                            <div class="col-sm-8">+1718-111-0011</div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-sm-4"><strong class="text-uppercase">Address:</strong></div>
                            <div class="col-sm-8">140, City Center, New York, U.S.A</div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-sm-4"><strong class="text-uppercase">Language:</strong></div>
                            <div class="col-sm-8">English, French</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="section" id="experience">
    <div class="container cc-experience">
        <div class="h4 text-center mb-4 title">Work Experience</div>
        <div class="card-about">
            <div class="row">
                <div class="col-md-3 bg-primary">
                    <div class="card-body cc-experience-header">
                        <p class="passage">March 2016 - Present</p>
                        <div class="h5">CreativeM</div>
                    </div>
                </div>
                <div class="col-md-9 ">
                    <div class="card-body">
                        <div class="h5">Front End Developer</div>
                        <p class="passage">Euismod massa scelerisque suspendisse fermentum habitant vitae ullamcorper magna quam
                            iaculis, tristique sapien taciti mollis interdum sagittis libero nunc inceptos tellus,
                            hendrerit vel eleifend primis lectus quisque cubilia sed mauris. Lacinia porta
                            vestibulum diam integer quisque eros pulvinar curae, curabitur feugiat arcu vivamus
                            parturient aliquet laoreet at, eu etiam pretium molestie ultricies sollicitudin dui.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-about">
            <div class="row">
                <div class="col-md-3 bg-primary ">
                    <div class="card-body cc-experience-header">
                        <p class="passage">April 2014 - March 2016</p>
                        <div class="h5">WebNote</div>
                    </div>
                </div>
                <div class="col-md-9">
                    <div class="card-body">
                        <div class="h5">Web Developer</div>
                        <p class="passage">Euismod massa scelerisque suspendisse fermentum habitant vitae ullamcorper magna quam
                            iaculis, tristique sapien taciti mollis interdum sagittis libero nunc inceptos tellus,
                            hendrerit vel eleifend primis lectus quisque cubilia sed mauris. Lacinia porta
                            vestibulum diam integer quisque eros pulvinar curae, curabitur feugiat arcu vivamus
                            parturient aliquet laoreet at, eu etiam pretium molestie ultricies sollicitudin dui.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-about">
            <div class="row">
                <div class="col-md-3 bg-primary ">
                    <div class="card-body cc-experience-header">
                        <p class="passage">April 2013 - February 2014</p>
                        <div class="h5">WEBM</div>
                    </div>
                </div>
                <div class="col-md-9">
                    <div class="card-body">
                        <div class="h5">Intern</div>
                        <p class="passage">Euismod massa scelerisque suspendisse fermentum habitant vitae ullamcorper magna quam
                            iaculis, tristique sapien taciti mollis interdum sagittis libero nunc inceptos tellus,
                            hendrerit vel eleifend primis lectus quisque cubilia sed mauris. Lacinia porta
                            vestibulum diam integer quisque eros pulvinar curae, curabitur feugiat arcu vivamus
                            parturient aliquet laoreet at, eu etiam pretium molestie ultricies sollicitudin dui.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="container cc-education">
    <div class="h4 text-center mb-4 title">Education</div>
    <div class="card-about">
        <div class="row">
            <div class="col-md-3 bg-primary ">
                <div class="card-body cc-education-header">
                    <p class="passage">2014 - 2018</p>
                    <div class="h5">Bachelor's Degree</div>
                </div>
            </div>
            <div class="col-md">
                <div class="card-body">
                    <div class="h5">Bachelor of Computer Science</div>
                    <p class="category passage">University of Alexandria - Faculty of Science</p>
                    <p class="passage">Euismod massa scelerisque suspendisse fermentum habitant vitae ullamcorper magna quam
                        iaculis, tristique sapien taciti mollis interdum sagittis libero nunc inceptos tellus,
                        hendrerit vel eleifend primis lectus quisque cubilia sed mauris. Lacinia porta vestibulum
                        diam integer quisque eros pulvinar curae, curabitur feugiat arcu vivamus parturient aliquet
                        laoreet at, eu etiam pretium molestie ultricies sollicitudin dui.</p>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
`;
}

function createCartPage() {
    container.className = 'container';
    if (productsInCart.length != 0) {
        //create the cart elements
        createCartProductsTable();

        var checkOutButton = document.createElement('button');
        checkOutButton.classList.add('btn-outline-primary', 'btn-lg', 'col-sm', 'btn');
        checkOutButton.setAttribute('type', 'button');
        checkOutButton.appendChild(document.createTextNode('Check Out'));
        container.appendChild(checkOutButton);
    } else {
        //specify that there is no element in the cart
        var table = document.createElement('table');
        table.classList.add('table', 'table-hover');
        container.appendChild(table);

        var thead = document.createElement('thead');
        table.appendChild(thead);

        var trow = document.createElement('tr');
        thead.appendChild(trow);

        var th = document.createElement('th');
        th.setAttribute('scope', 'col');
        th.appendChild(document.createTextNode('Product'));
        trow.appendChild(th);

        th = document.createElement('th');
        th.setAttribute('scope', 'col');
        th.appendChild(document.createTextNode('Price'));
        trow.appendChild(th);

        th = document.createElement('th');
        th.setAttribute('scope', 'col');
        th.appendChild(document.createTextNode('Quantity'));
        trow.appendChild(th);

        th = document.createElement('th');
        th.setAttribute('scope', 'col');
        th.appendChild(document.createTextNode('Total'));
        trow.appendChild(th);

        var tbody = document.createElement('tbody');
        table.appendChild(tbody);

        var alert = document.createElement('div');
        alert.classList.add('alert', 'alert-warning');
        alert.setAttribute('role', 'alert');

        var alertHeader = document.createElement('h4');
        alertHeader.classList.add('alert-heading', 'justify-content-center');
        alertHeader.setAttribute('style', 'padding:5px;margin:5px;')
        alertHeader.appendChild(document.createTextNode('Sorry, your cart is empty!'));
        alert.appendChild(alertHeader);

        var alertParagrph = document.createElement('p');
        alertParagrph.appendChild(document.createTextNode('Please go back and start adding products.'));
        alert.appendChild(alertParagrph);

        container.appendChild(alert);

        var checkOutButton = document.createElement('button');
        checkOutButton.classList.add('btn-outline-primary', 'btn-lg', 'col-sm', 'fixed-bottom"');
        checkOutButton.setAttribute('type', 'button');
        checkOutButton.appendChild(document.createTextNode('Check Out'));
        checkOutButton.setAttribute('disabled', '');

        container.appendChild(checkOutButton);

    }
}

function createCartProductsTable() {
    //creating cart page which consists of table 
    var table = document.createElement('table');
    table.classList.add('table', 'table-hover');
    container.appendChild(table);

    var thead = document.createElement('thead');
    table.appendChild(thead);

    var trow = document.createElement('tr');
    thead.appendChild(trow);

    var th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.appendChild(document.createTextNode('Product'));
    trow.appendChild(th);

    th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.appendChild(document.createTextNode('Price'));
    trow.appendChild(th);

    th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.appendChild(document.createTextNode('Quantity'));
    trow.appendChild(th);

    th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.appendChild(document.createTextNode('Total'));
    trow.appendChild(th);

    var tbody = document.createElement('tbody');
    table.appendChild(tbody);

    productsInCart.forEach(function (x) {
        var tr = document.createElement('tr');
        var th = document.createElement('th');
        var img = document.createElement('img');
        img.setAttribute('src', x.ProductPicUrl);
        img.classList.add('rounded', 'd-inline-block');
        img.setAttribute('height', '100px');
        img.setAttribute('width', '100px');
        img.setAttribute('style', 'padding:inherit;');
        th.appendChild(img);
        th.appendChild(document.createTextNode(x.Name));
        tr.appendChild(th);

        var td = document.createElement('td');
        td.appendChild(document.createTextNode(x.Price + ' ' + x.CurrencyCode));
        td.classList.add('align-middle');
        tr.appendChild(td);

        td = document.createElement('td');
        td.classList.add('align-middle');
        td.appendChild(document.createTextNode(x.Quantity));
        tr.appendChild(td);

        td.classList.add('align-middle');
        td = document.createElement('td');
        td.classList.add('align-middle');
        td.appendChild(document.createTextNode(parseInt(x.Price) * parseInt(x.Quantity) + ' ' + x.CurrencyCode));
        tr.appendChild(td);
        tbody.appendChild(tr);

    });
}

function addItemToCartFromProductSinglePage() {
    //adding item to cart within the limited range
    var index = productsCollection.findIndex(x => x.ProductId === this.parentNode.id);
    var indexOfElementInCart = productsInCart.findIndex(x => x.ProductId === this.parentNode.id);
    var noOFItems = this.parentNode.getElementsByTagName('h5')[0];

    if (indexOfElementInCart === -1) {
        //if the product doesn't exist in the cart the creat an object and add it 
        var product = {
            'Name': productsCollection[index]['Name'],
            'ProductId': productsCollection[index]['ProductId'],
            'ProductPicUrl': productsCollection[index]['ProductPicUrl'],
            'Price': productsCollection[index]['Price'],
            'CurrencyCode': productsCollection[index]['CurrencyCode'],
            'Quantity': 1
        }
        productsInCart.push(product);
        noOFItems.textContent = product.Quantity;
    } else {
        if (productsInCart[indexOfElementInCart]['Quantity'] < productsCollection[index]['Quantity'])
            noOFItems.textContent = ++productsInCart[indexOfElementInCart]['Quantity'];
        else
            alert('Item out of stock!');
    }
    localStorage.setItem('productsInCart', JSON.stringify(productsInCart));
}

function removeItemFromCartFromProductSinglePage() {
    //removing items from cart
    var indexOfElementInCart = productsInCart.findIndex(x => x.ProductId === this.parentNode.id);
    var noOFItems = this.parentNode.getElementsByTagName('h5')[0];

    if (indexOfElementInCart !== -1) {
        if (productsInCart[indexOfElementInCart]['Quantity'] === 1) {
            productsInCart.splice(indexOfElementInCart, 1);
            noOFItems.textContent = '0';
        } else
            noOFItems.textContent = --productsInCart[indexOfElementInCart]['Quantity'];

        localStorage.setItem('productsInCart', JSON.stringify(productsInCart));
    } else
        alert('Start adding items to the cart');
}

function showFloatingDiv() {
    //creating the floating div whenever the home page is loaded
    var totalPrice = 0,
        totalItems = 0;
    productsInCart.forEach(function (x) {
        totalItems += x.Quantity;
        totalPrice += x.Price;
    });

    if (totalPrice !== 0 && totalItems !== 0) {
        var floatingDiv = document.createElement('div');
        floatingDiv.classList.add('floating-div', 'border', 'rounded-pill');
        container.appendChild(floatingDiv);
        var label1 = document.createElement('label');
        label1.appendChild(document.createTextNode('Total Price'));
        label1.appendChild(document.createElement('br'));
        label1.appendChild(document.createTextNode(totalPrice));
        label1.appendChild(document.createElement('br'));
        label1.appendChild(document.createTextNode('Total Items'));
        label1.appendChild(document.createElement('br'));
        label1.appendChild(document.createTextNode(totalItems));
        label1.classList.add('text-center');
        floatingDiv.appendChild(label1);
    }
}

function updateFloatingDiv() {
    //updating the ffloating div after adding new items
    var floatingDiv = document.querySelector('.floating-div label');
    if (floatingDiv == null) {
        showFloatingDiv();
    } else {
        var totalPrice = 0,
            totalItems = 0;
        productsInCart.forEach(function (x) {
            totalItems += x.Quantity;
            totalPrice += (x.Price * x.Quantity);
        });

        floatingDiv.innerText = '';
        floatingDiv.appendChild(document.createTextNode('Total Price'));
        floatingDiv.appendChild(document.createElement('br'));
        floatingDiv.appendChild(document.createTextNode(totalPrice));
        floatingDiv.appendChild(document.createElement('br'));
        floatingDiv.appendChild(document.createTextNode('Total Items'));
        floatingDiv.appendChild(document.createElement('br'));
        floatingDiv.appendChild(document.createTextNode(totalItems));
    }
}