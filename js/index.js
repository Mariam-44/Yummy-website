// * Regex for validation
const nameRegex = /^[A-Za-z]+( [A-Za-z]+)*$/;
const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
const ageRegex = /^\d{1,2}$/;
const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// * Loading
function hideLoading(){
  $(".loading").fadeOut(1000,function () {
    $("body").css({overflow:"auto"});
 });
}

function showLoading(){
  $(".loading").removeClass("d-none");
  $(".loading").fadeIn(100,function () {
    $("body").css({overflow:"hidden"});
 });
}
// * side Navbar
const navWidth = $(".menu").outerWidth();
$(".side-navbar").css({ left: `-${navWidth}px` });

function closeNav() {
  $(".side-navbar").animate({ left: `-${navWidth}px` }, 500);
  $(".icon").removeClass("fa-x").addClass("fa-align-justify");
    for (let i = 4 ; i >= 0; i--) {
      $(".menu-items ul li").eq(i).delay(20 * (4-i)).animate({top: 200,});
    }

}
function openNav() {
  $(".side-navbar").animate({ left: `0px` }, 500);
  $(".icon").removeClass("fa-align-justify").addClass("fa-x");
  $(".menu-items ul li").each(function (i) {
    $(this).delay(100 * i).animate({top: 0,});
  });
}
let navFLag = false;
$(".icon").on("click", function () {
  if (navFLag == true) {
    closeNav();
    navFLag = false;
  } else {
    openNav();
    navFLag = true;
  }
});
// *function to filter data by (area - category - ingrediant)
async function FilterData(link) {
  showLoading();
  closeNav();
  let response = await fetch(
    `${link}`
  );
  let data = await response.json();
  if(data!=null)
    hideLoading();
  let main = data.meals;
  let size = 20;
  displayMeals(main, size);
}

// * main Meals Data
async function Meals() {
  showLoading();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=`
  );
  let data = await response.json();
  if(data!=null){
    hideLoading()
  }
  let meal = data.meals;
  let size = meal.length;
  displayMeals(meal, size);
}
Meals();

function displayMeals(meal, s) {
  let content = "";
  for (let i = 0; i < s; i++) {
    content += `       
          <div class="inner g-4 ">
            <div
              class="home-img position-relative overflow-hidden rounded-3 px-0 "
              style="cursor: pointer"
              onclick="getDetails('${meal[i].idMeal}')"
            >
              <img
                src="${meal[i].strMealThumb}"
                class="w-100 rounded-3"
                alt=""
              />
              <div
                class="layer position-absolute d-flex align-items-center ps-3"
              >
                <h2>${meal[i].strMeal}</h2>
              </div>
            </div>
          </div>
          `;
    $(".display").html(content);
  }
}

// * Meals Details
async function getDetails(id) {
  showLoading();
  $(".display").html("");
  $(".search-content").html("");
  closeNav();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let data = await response.json();
  if(data!=null)
    hideLoading();
  let deatails = data.meals[0];
  displayDetails(deatails);
}

function displayDetails(deatails) {
  let content = ` <div class="container">
            <div class="row text-white d-flex">
              <div class="right-side col-md-4">
                <img
                  src="${deatails.strMealThumb}"
                  alt=""
                  class="w-100 rounded-3 mb-2"
                />
                <h2>${deatails.strMeal}</h2>
              </div>
              <div class="left-side col-md-8">
                <h2>Instructions</h2>
                <p>
                ${deatails.strInstructions}
                </p>
                <h3>Area : <span>${deatails.strArea}</span></h3>
                <h3>Category : <span>${deatails.strCategory}</span></h3>
                <h3>Recipes:</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">`;

  for (let i = 1; i <= 20; i++) {
    let ingred = deatails[`strIngredient${i}`];
    let measure = deatails[`strMeasure${i}`];
    if (ingred) {
      content += ` <li class="alert alert-info m-2 p-1">${measure} ${ingred}</li>`;
    }
  }

  let tagsList = "";
  if (!deatails.strTags) {
    let tags = [];
    tagsList = tags;
  } else {
    let tags = deatails.strTags.split(",");
    for (let i = 0; i < tags.length; i++) {
      tagsList += `
      <span class="alert alert-danger ms-0 m-2 p-1 ">${tags[i]}</span>
      `;
    }
  }

  content += `
                </ul>
                <h3 class="mb-3">Tags:</h3>
                ${tagsList}
                <div class="d-flex mt-4 ">
                   <a target="_blank" href="${deatails.strSource}"><button type="button" class="btn btn-success me-1">Source</button></a>
                   <a target="_blank" href="${deatails.strYoutube}"><button type="button" class="btn btn-danger">Youtube</button></a>
                </div>
              </div>
            </div>
          </div>
         `;
  $(".deatail").html(content);
}

// * Search For meals
$(".search").on("click", function () {
  $(".display").html("");
  $(".deatail").html("");
  $(".contact-content").addClass("d-none");

  closeNav();
  $(".search-content").html(`
     <div class="row row-cols-md-2 px-3">
             <div class="mb-3">
            <input type="text" class="form-control name" id="exampleFormControlInput1" placeholder="Search By Name" autocomplete="off">
          </div>
             <div class="mb-3">
            <input type="text" class="form-control FLetter" id="exampleFormControlInput1" placeholder="Search By First Letter" maxlength ="1" autocomplete="off">
          </div>
          </div>
        </div>`);

  $(".name").on("input", function () {
    let name = $(this).val();
    SearchByName(name);
  });
  $(".FLetter").on("input", function () {
    let alpha = $(this).val();
    SearchByFirstLetter(alpha);
  });
});

//  Search by name 
async function SearchByName(name) {
  showLoading();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  let data = await response.json();
  if(data!=null)
    hideLoading();
  let meal = data.meals;
  let size = meal.length;
  displayMeals(meal, size);
}

// Search by First Letter 
async function SearchByFirstLetter(alpha) {
  showLoading();
  if (alpha == "") alpha = "a";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${alpha}`
  );
  let data = await response.json();
  if(data!=null)
    hideLoading();
  let meal = data.meals;
  let size = meal.length;
  displayMeals(meal, size);
}

// * Categories Page

$(".categories").on("click", function () {
  $(".display").html("");
  $(".deatail").html("");
  $(".search-content").html("");
  $(".contact-content").addClass("d-none");
  closeNav();
  getCategoriesData();
});

async function getCategoriesData() {
  showLoading();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let data = await response.json();
  if(data!=null)
    hideLoading();
  let categ = data.categories;
  displayCategories(categ);
}
function displayCategories(categ) {
  let content = "";
  for (let i = 0; i < categ.length; i++) {
    content += `       
          <div class="inner g-4 ">
            <div
              class="home-img position-relative overflow-hidden rounded-3 px-0 "
              style="cursor: pointer"
              onclick="mealsCategory('${categ[i].strCategory}')"
            >
              <img
                src="${categ[i].strCategoryThumb}"
                class="w-100 rounded-3"
                alt=""
              />
              <div
                class="layer position-absolute d-flex align-items-center flex-column ps-3"
              >
                <h2 class="pt-3">${categ[i].strCategory}</h2>
                <p class="text-center pe-2">${categ[i].strCategoryDescription
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")}</p>
              </div>
            </div>
          </div>
          `;
    $(".display").html(content);
  }
}
//  Filter Meals By category
async function mealsCategory(category) {
  FilterData(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
}

// * Area Page 
$(".area").on("click", function () {
  $(".display").html("");
  $(".deatail").html("");
  $(".search-content").html("");
  $(".contact-content").addClass("d-none");
  closeNav();
  getAreaData();
});

async function getAreaData() {
  showLoading();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await response.json();
  if(data!=null)
    hideLoading();
  let area = data.meals;
  displayAreaData(area);
}
function displayAreaData(area) {
  let content = "";
  for (let i = 0; i < area.length; i++) {
    content += `       
          <div class="inner g-4 ">
            <div
              class="position-relative overflow-hidden rounded-3 px-0 text-white text-center"
              style="cursor: pointer"
              onclick="mealsArea('${area[i].strArea}')"
            >
              <i class="fa-solid fa-house-laptop fa-4x"></i>
              
                <h2 >${area[i].strArea}</h2>
            </div>
          </div>
          `;
    $(".display").html(content);
  }
}
//  Filter Meals By Area
async function mealsArea(a) {
  FilterData(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${a}`)
}

// * Ingrediants Page

$(".ingrediants").on("click", function () {
  $(".display").html("");
  $(".deatail").html("");
  $(".search-content").html("");
  $(".contact-content").addClass("d-none");
  closeNav();
  getIngrediantData();
});

async function getIngrediantData() {
  showLoading();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await response.json();
  if(data!=null)
    hideLoading();
  let gred = data.meals;
  displayIngrediantData(gred);
}
function displayIngrediantData(gred) {
  let content = "";
  for (let i = 0; i < 20; i++) {
    content += `       
          <div class="inner g-4 ">
            <div
              class="position-relative overflow-hidden rounded-3 px-0 text-white text-center"
              style="cursor: pointer"
              onclick="mainIngrediant('${gred[i].strIngredient}')"
            >
            
              <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h2 >${gred[i].strIngredient}</h2>
                <p>${gred[i].strDescription
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")}</p>
            </div>
          </div>
          `;
    $(".display").html(content);
  }
}
// Filter Meals By Ingrediant
async function mainIngrediant(i) {
  FilterData(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${i}`);
}

// * Contact Page

$(".contact").on("click", function () {
  $(".display").html("");
  $(".deatail").html("");
  $(".search-content").html("");
  $(".contact-content").removeClass("d-none");

  closeNav();
  $(".contact-content").removeClass("d-none");
});

function validation(className, regex) {
  if (className == "confirmPass") {
    confirmPassword();
    return;
  }

  $(`.${className}`).keyup(function () {
    let element = $(this).val();
    let errorElement = $(this).next(".error");

    if (regex.test(element)) {
      errorElement.addClass("d-none");
    } else {
      errorElement.removeClass("d-none");

      $(".submit-button").attr("disabled");
    }

    validateform();
  });
}

function confirmPassword() {
  let password = $(".password").val();
  let confirmation = $(".confirmPass").val();
  let errorElement = $(".confirmPass").next(".error");
  if (password == confirmation) {
    errorElement.addClass("d-none");
  } else {
    errorElement.removeClass("d-none");

    $(".submit-button").attr("disabled");
  }
  validateform();
}

function validateform() {
  let allInputsFilled = true;
  let VisibleError = false;

  $("input").each(function () {
    if ($(this).val().trim() === "") {
      allInputsFilled = false;
    }
  });
  $(".error").each(function () {
    if (!$(this).hasClass("d-none")) {
      VisibleError = true;
    }
  });

  if (allInputsFilled && !VisibleError) {
    $(".submit-button").removeAttr("disabled");
  } else {
    $(".submit-button").attr("disabled", "disabled");
  }
}
