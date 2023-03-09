let fetchData = [];

const fetchCatagories = () => {
    fetch('https://openapi.programming-hero.com/api/news/categories')
        .then(res => res.json())
        .then(data => showCatagories(data.data))
};

// fetchCatagories()

const showCatagories = data => {
    // console.log(data)
    // capture categories container to append all the categories link
    const categoriesContainer = document.getElementById('categories-container')
    data.news_category?.forEach(singleCategory => {
        // console.log(singleCategory);
        //its difficult thats the reason i skip it step-1
        // categoriesContainer.innerHTML += `<a class="nav-link" href="#">${singleCategory?.category_name}</a>`;
        //step-2
        let linkContainer = document.createElement('p');
        linkContainer.innerHTML = `<a class="nav-link" href="#" onclick ="fetchCategoryNews('${singleCategory.category_id}','${singleCategory.category_name}')">${singleCategory.category_name}</a>`;
        categoriesContainer.appendChild(linkContainer);
    })
}

//fetch all news category
const fetchCategoryNews = (category_id, category_name) => {
    // console.log(category_id)
    const url = `https://openapi.programming-hero.com/api/news/category/${category_id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            fetchData = data.data;
            showAllNews(data.data, category_name)
        });
};

const showAllNews = (data, category_name) => {
    console.log(data, category_name)
    document.getElementById('news-count').innerText = data.length;
    document.getElementById('category-name').innerText = category_name;

    const newsContainer = document.getElementById('allNews');
    newsContainer.innerHTML = '';

    data.forEach(singleNews => {
        const { _id, image_url, title, details, author, total_view, rating } = singleNews;
        // console.log(singleNews)
        const card = document.createElement('div');
        card.classList.add("card", "mb-3");
        card.innerHTML = `
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${singleNews.image_url}" class="img-fluid rounded-start" alt="...">
          </div>
          <div class="col-md-8 d-flex flex-column">
            <div class="card-body">
              <h5 class="card-title">Title :${singleNews.title}</h5>
              <p class="card-text">${singleNews.details.slice(0, 200)}....</p>
            </div>

            <div class="card-footer border-0 bg-body d-flex justify-content-between">
                <div class="d-flex gap-2">
                <img src="${singleNews.author.img}" class="img-fluid rounded-circle" alt="..." height="35" width="40">
                <div>
                <P class="p-0 m-0">${author.name ? author.name : "Not Available"}</p>
                <P class="p-0 m-0">${singleNews.author.published_date}</p>
                </div>
                </div>

                <div class="d-flex align-items-center">
                <i class="fa-solid fa-eye"></i>
                <P class="p-0 m-0">${total_view ? total_view : "Not Available"}</p>
                </div>

                <div>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star-half-stroke"></i>
                <i class="fa-solid fa-star-half-stroke"></i>
                <i class="fa-solid fa-star-half-stroke"></i>
                <i class="fa-solid fa-star-half-stroke"></i>
                </div>

                <div>
                <i class="fa fa-arrow-right" onclick="fetchNewsDetails('${_id}')"data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
                </div>

            </div>
          </div>
        </div>
        `;
        newsContainer.appendChild(card);
    })

};

const fetchNewsDetails = news_id => {
    const URL = `https://openapi.programming-hero.com/api/news/${news_id}`
    fetch(URL)
        .then(res => res.json())
        .then(data => showNewsDetails(data.data[0]))
}

const showNewsDetails = newsDetails => {
    const { _id, image_url, title, details, author, total_view, rating, others_info } = newsDetails;
    console.log(newsDetails);
    document.getElementById('modal-body').innerHTML = `
       <div class="card", "mb-3">
       <div class="row g-0">
       <div class="col-md-12">
         <img src="${image_url}" class="img-fluid rounded-start" alt="...">
       </div>
       <div class="col-md-12 d-flex flex-column">
         <div class="card-body">
           <h5 class="card-title">Title :${title} <span class="badge text-bg-warning">${others_info.is_trending && "Trending"}</span></h5>
           <p class="card-text">${details}....</p>
         </div>

         <div class="card-footer border-0 bg-body d-flex justify-content-between">
             <div class="d-flex gap-2">
             <img src="${author.img}" class="img-fluid rounded-circle" alt="..." height="35" width="40">
             <div>
             <P class="p-0 m-0">${author.name ? author.name : "Not Available Name"}</p>
             <P class="p-0 m-0">${author.published_date}</p>
             </div>
             </div>

             <div class="d-flex align-items-center">
             <i class="fa-solid fa-eye"></i>
             <P class="p-0 m-0">${total_view ? total_view : "Not Available"}</p>
             </div>

             <div>
             <P class="p-0 m-0">${rating.number}</p>
             </div>

         </div>
       </div>
     </div>
       </div>
        `;
};

// show trending news
const showTrending = () => {
    const trendingNews = fetchData.filter(singleData => singleData.others_info.is_trending === true);
    const category_name = document.getElementById("category-name").innerText;
    showAllNews(trendingNews, category_name);

}