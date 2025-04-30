// REVIEW FUNCTIONS
 
// add sort listeners
  if (document.querySelectorAll(".review-container")) {
    const title = document.getElementById("sort-title");
    title.addEventListener("click", (e) => {
      sortReviews(e, "title");
    });

  const date = document.getElementById("sort-date");
    date.addEventListener("click", (e) => {
      sortReviews(e, "date");
    });

  const rating = document.getElementById("sort-rating");
    rating.addEventListener("click", (e) => {
      sortReviews(e, "rating");
    });
  };

  function sortReviews(e, property) { // function to sort reviews by title, date entered, and rating
    if (property.toString().toLowerCase() === "title") { 
       const titles = document.querySelectorAll(".title");
       var fragment = new DocumentFragment(); // where we will store the re-ordered DOM elements
       var titleList = [];

       titles.forEach((title, index) => { // grab id of review container for title so we can know which review # it is
         titleList.push({title: title.textContent, parentId: title.parentElement.parentElement.parentElement.id});
         index++;
       });

       var list = titleList.sort((a, b) => {
       
         const titleA = a.title.toLowerCase();
         const titleB = b.title.toLowerCase();
         
         if (titleA < titleB) { // alphabetize
           return -1;
         };
         if (titleA > titleB) {
           return 1;
         };
         return 0;
       });

       var reorderedList = []; // where we will store the list of newly re-ordered titles
       const parentElements = [...list]; // list of parent review #s in alphabetical order

       for (var i = 0; i < parentElements.length; i++) { // grab each review and put it in the order of the new list
          reorderedList[i] = document.getElementById(list[i].parentId); 
       };
       for (i = 0; i < reorderedList.length; i++) { // add reordered reviews to document fragment
         fragment.append(reorderedList[i]); 
       };
       var sort = document.querySelector(".sort-container");
       sort.append(fragment); // replace current page of reviews with alphabetized reviews
     };

     if (property.toString().toLowerCase() === "date") {
       const dates = document.querySelectorAll(".date_entered");
       var fragment = new DocumentFragment();
       var dateList = [];

       dates.forEach((dateEntered, index) => {
         dateList.push({dateEntered: dateEntered.textContent, parentId: dateEntered.parentElement.parentElement.parentElement.parentElement.id});
         index++;
       });

       var list = dateList.sort((a, b) => { 
           let dateA = a.dateEntered;
           let dateB = b.dateEntered;
           
           dateA = dateA.substring(0,24);
           dateB = dateB.substring(0,24);

           let newDateA = Date.parse(dateA);
           let newDateB = Date.parse(dateB);

           newDateA = newDateA.valueOf();
           newDateB = newDateB.valueOf();

           if (newDateA > newDateB) { // sort by newest first
             return -1;
           }
           if (newDateA < newDateB) {
             return 1;
           }
           return 0;
       });

       var reorderedList = [];
       const parentElements = [...list];

       for (var i = 0; i < parentElements.length; i++) {
          reorderedList[i] = document.getElementById(list[i].parentId);
       };
       for (i = 0; i < reorderedList.length; i++) {
         fragment.append(reorderedList[i]);
       };
       var sort = document.querySelector(".sort-container");
       sort.append(fragment);
     };

     if (property.toString().toLowerCase() === "rating") {
       const ratings = document.querySelectorAll(".rating");
       var fragment = new DocumentFragment();
       var ratingsList = [];

       ratings.forEach((rating, index) => {
         ratingsList.push({rating: rating.textContent, parentId: rating.parentElement.parentElement.parentElement.parentElement.id});
         index++;
       });

       var list = ratingsList.sort((a, b) => {
          let ratingA = parseInt(a.rating);
          let ratingB = parseInt(b.rating);
          if (ratingA > ratingB) { // sort by highest rating
            return -1;
          }
          if (ratingA < ratingB) {
            return 1;
          }
          return 0;
       });
        
       var reorderedList = [];
       const parentElements = [...list];

       for (var i = 0; i < parentElements.length; i++) {
          reorderedList[i] = document.getElementById(list[i].parentId);
       };
       for (var i = 0; i < reorderedList.length; i++) {
         fragment.append(reorderedList[i]);
       };
       var sort = document.querySelector(".sort-container");
       sort.append(fragment);
     };
   };

document.getElementById("new-review-link").addEventListener("click", function(e) { // show new review form
      document.getElementById("create-review").classList.toggle("hidden");
});
  

let result = 0;

var editReviewClass = document.querySelectorAll('.edit-review');    
var editReviewClassLength = document.querySelectorAll(".edit-review").length;

// edit review function
for (i = 0; i < editReviewClassLength; i++) {
  document.querySelectorAll('.edit-review')[i].addEventListener("click", function (e) {
    
    if (document.querySelector(".edit-review-form")) {
      document.querySelector(".edit-review-form").remove(); // check to see if we already have an edit form open and close it (having more than one of these in the DOM will break the rating function)
     } else {

      var id = this.id; // capture which review triggered the edit form
      console.log(id);
      if (editReviewClassLength > 10) { // make sure we're grabbing the whole id for > single digit ids
        id = id.substring((id.length - 2), id.length);
      } else {
        id = id.substring((id.length - 1), id.length);
      };
      console.log(id);
    
      var frag = new DocumentFragment();   // create the fragment to store the form we'll append
      var container = frag.appendChild(document.createElement("div")); 
      container.setAttribute("id", `edit-review-container-${id}`);
      container.classList.add("edit-review-form", "hidden");

      var form = container.appendChild(document.createElement("form")); 
      form.setAttribute("method", "post");
      form.setAttribute("action", "/edit");
      form.setAttribute("name", "edit-review");
      form.setAttribute("id", `edit-review-form-${id}`);
      form.classList.add("review-form")

      let label;
      let input;

      for (i = 0; i < 4; i++) {
        label = form.appendChild(document.createElement("label"));
        label.classList.add("l");
        input = form.appendChild(document.createElement("input"));
        input.classList.add("i");
      };

      let reviewer = document.getElementById(`reviewer-${id}`).textContent;

      form.children[0].setAttribute("for", `edit-review-by-${id}`);
      form.children[0].textContent = "Your name:";

      form.children[1].setAttribute("type", "text");
      form.children[1].setAttribute("name", "reviewer");
      form.children[1].setAttribute("id", `edit-review-by-${id}`);
      form.children[1].setAttribute("value", `${reviewer}`);
      form.children[1].setAttribute("required", "");

      form.children[2].setAttribute("for", `edit-review-title-${id}`);
      form.children[2].textContent = "Book:";

      let reviewTitle = document.getElementById(`title-${id}`).textContent;

      form.children[3].setAttribute("type", "text");
      form.children[3].setAttribute("name", "title");
      form.children[3].setAttribute("id", `edit-review-title-${id}`);
      form.children[3].setAttribute("value", `${reviewTitle}`);
      form.children[3].setAttribute("required", "");

      form.children[4].setAttribute("for", `edit-review-author-${id}`);
      form.children[4].textContent = "Book author:";

      let author = document.getElementById(`author-${id}`).textContent;

      form.children[5].setAttribute("type", "text");
      form.children[5].setAttribute("name", "author");
      form.children[5].setAttribute("id", `edit-review-author-${id}`);
      form.children[5].setAttribute("value", `${author}`);
      form.children[5].setAttribute("required", "");

      form.children[6].setAttribute("for", `edit-isbn-${id}`);
      form.children[6].textContent = "ISBN-13:";

      let isbn = document.getElementById(`isbn-${id}`).textContent;

      form.children[7].setAttribute("type", "text");
      form.children[7].setAttribute("name", "isbn");
      form.children[7].setAttribute("id", `edit-isbn-${id}`);
      form.children[7].setAttribute("value", `${isbn}`);
      form.children[7].setAttribute("required", "");

      let span = form.appendChild(document.createElement("span"));

      span.classList.add("l");
      span.textContent = "Rating from 0 to 5 (0=worst, 5=best):";

      let div = form.appendChild(document.createElement("div"));
      div.classList.add("i");

      let ratingDiv = div.appendChild(document.createElement("div"));
      ratingDiv.setAttribute("id", "edit-star-rating");

      for (i = 0; i < 5; i++) {
        div = ratingDiv.appendChild(document.createElement("div"));
        div.classList.add("star", "edit", `review-${id}`);
        div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" zoomAndPan="magnify" viewBox="0 0 75 74.999997" height="100" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="d8645421c3"><path d="M 2.695312 4.152344 L 72.445312 4.152344 L 72.445312 70.902344 L 2.695312 70.902344 Z M 2.695312 4.152344 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#d8645421c3)"><path fill="#ffffff" d="M 37.496094 55.183594 L 59.011719 70.84375 L 50.773438 45.558594 L 72.289062 30.25 L 45.902344 30.25 L 37.496094 4.152344 L 29.085938 30.25 L 2.699219 30.25 L 24.214844 45.558594 L 16.007812 70.84375 Z M 37.496094 55.183594 " fill-opacity="1" fill-rule="nonzero"/></g></svg>';
      };

      input = form.appendChild(document.createElement("input"));
      input.setAttribute("type", "hidden");
      input.setAttribute("name", "rating");
      input.setAttribute("id", `edit-rating-${id}`);
      input.setAttribute("value", "0");

      let user_id = document.querySelector(".user").id;
      let del = parseInt(user_id.indexOf("-"));
      user_id = user_id.substring((del + 1));

      input = form.appendChild(document.createElement("input"));
      input.setAttribute("type", "hidden");
      input.setAttribute("name", "user_id");
      input.setAttribute("value", `${user_id}`);

      let review_id = id;

      input = form.appendChild(document.createElement("input"));
      input.setAttribute("type", "hidden");
      input.setAttribute("name", "review_id");
      input.setAttribute("value", `${review_id}`);

      label = form.appendChild(document.createElement("label"));
      label.setAttribute("for", `edit-book-description-${id}`);
      label.textContent = "Book summary:";

      let description = document.getElementById(`description-${id}`).textContent.trim();

      let textarea = form.appendChild(document.createElement("textarea"));
      textarea.setAttribute("name", "description");
      textarea.setAttribute("id", `edit-book-description-${id}`);
      textarea.textContent = description;
      textarea.classList.add("i");

      label = form.appendChild(document.createElement("label"));
      label.setAttribute("for", `edit-book-review-${id}`);
      label.textContent = "Review: (5,000 char max):";

      let review = document.getElementById(`review-content-${id}`).textContent.trim();

      textarea = form.appendChild(document.createElement("textarea"));
      textarea.setAttribute("name", "review");
      textarea.setAttribute("id", `edit-book-review-${id}`);
      textarea.setAttribute("required", "");
      textarea.textContent = review;
      textarea.classList.add("i");

      input = form.appendChild(document.createElement("input"));
      input.setAttribute("type", "submit");
      input.setAttribute("id", `edit-review-button-${id}`);
      input.setAttribute("value", "Submit");
      input.classList.add("button");

      var currentReviewContainer = document.getElementById(`review-${id}`); // grab the review we're adding this form to

      currentReviewContainer.append(frag); // append the form to the review

      let editStars = document.querySelectorAll(".edit"); // grab the rating stars
      result = 0;

      editStars.forEach((item, index) => { // add the event listeners for the rating function
        item.addEventListener("click", (e) => {
          result = index + 1;
          if (e.detail === 2) { // check for double-click to remove last star
            item.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" zoomAndPan="magnify" viewBox="0 0 75 74.999997" height="100" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="d8645421c3"><path d="M 2.695312 4.152344 L 72.445312 4.152344 L 72.445312 70.902344 L 2.695312 70.902344 Z M 2.695312 4.152344 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#d8645421c3)"><path fill="#ffffff" d="M 37.496094 55.183594 L 59.011719 70.84375 L 50.773438 45.558594 L 72.289062 30.25 L 45.902344 30.25 L 37.496094 4.152344 L 29.085938 30.25 L 2.699219 30.25 L 24.214844 45.558594 L 16.007812 70.84375 Z M 37.496094 55.183594 " fill-opacity="1" fill-rule="nonzero"/></g></svg>';
            result--; // remove star from result
            console.log(result);
          };
          updateRating(editStars);
          document.getElementById(`edit-rating-${id}`).value = parseInt(result); // update hidden field for db input
        });
      });
      document.getElementById(`edit-review-container-${id}`).classList.toggle("hidden"); // we're all done, so show the newly created/inserted form
    };
  });
}; 

const newStars = document.querySelectorAll(".new"); // last verse, same as the first - grab rating stars for new reviews
result = 0;

if (document.getElementById("new-review-form")) { // add the event listeners
     newStars.forEach((item, index) => {
          item.addEventListener("click", (e) => {
          result = index + 1; 
            if (e.detail === 2) { // check for double-click to remove last star
              item.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" zoomAndPan="magnify" viewBox="0 0 75 74.999997" height="100" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="d8645421c3"><path d="M 2.695312 4.152344 L 72.445312 4.152344 L 72.445312 70.902344 L 2.695312 70.902344 Z M 2.695312 4.152344 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#d8645421c3)"><path fill="#ffffff" d="M 37.496094 55.183594 L 59.011719 70.84375 L 50.773438 45.558594 L 72.289062 30.25 L 45.902344 30.25 L 37.496094 4.152344 L 29.085938 30.25 L 2.699219 30.25 L 24.214844 45.558594 L 16.007812 70.84375 Z M 37.496094 55.183594 " fill-opacity="1" fill-rule="nonzero"/></g></svg>';
              result--; // remove star from result
              console.log(result);  
            };
          updateRating(newStars);
          document.getElementById("new-rating").value = parseInt(result); // update hidden field for db input

        });
    });
  };

// GENERAL FUNCTIONS

function updateRating(name) { // function to change star appearance from filled in to blank
  name.forEach((item, index) => {
  if (index < result) item.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" zoomAndPan="magnify" viewBox="0 0 75 74.999997" height="100" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="eb4aa5fe21"><path d="M 2.695312 4.152344 L 72.445312 4.152344 L 72.445312 70.902344 L 2.695312 70.902344 Z M 2.695312 4.152344 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#eb4aa5fe21)"><path fill="#ffde59" d="M 37.496094 55.183594 L 59.011719 70.84375 L 50.773438 45.558594 L 72.289062 30.25 L 45.902344 30.25 L 37.496094 4.152344 L 29.085938 30.25 L 2.699219 30.25 L 24.214844 45.558594 L 16.007812 70.84375 Z M 37.496094 55.183594 " fill-opacity="1" fill-rule="nonzero"/></g></svg>';
  else item.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" zoomAndPan="magnify" viewBox="0 0 75 74.999997" height="100" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="d8645421c3"><path d="M 2.695312 4.152344 L 72.445312 4.152344 L 72.445312 70.902344 L 2.695312 70.902344 Z M 2.695312 4.152344 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#d8645421c3)"><path fill="#ffffff" d="M 37.496094 55.183594 L 59.011719 70.84375 L 50.773438 45.558594 L 72.289062 30.25 L 45.902344 30.25 L 37.496094 4.152344 L 29.085938 30.25 L 2.699219 30.25 L 24.214844 45.558594 L 16.007812 70.84375 Z M 37.496094 55.183594 " fill-opacity="1" fill-rule="nonzero"/></g></svg>';
});
console.log(result); 
};
