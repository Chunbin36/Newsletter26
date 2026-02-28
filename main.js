const Api_KEY = `1762ea44d88e4718ba27607148b2bced`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
const sideMenus = document.querySelectorAll(".side-menu-list button");
let totalResults = 0
let page = 1
const pageSize = 10
const groupSize = 5

menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event)),
);

sideMenus.forEach((sideMenus) =>
  sideMenus.addEventListener("click", (event) => getNewsByCategory(event)),
);

let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`,
);


const fetchNews = async (url) => {
  try {
    url.searchParams.set("page",page); // => &page = page
    url.searchParams.set ("pageSize", pageSize);

    const response = await fetch(url);
    const data = await response.json();
    console.log("ddd",data);
    if(response.status===200){
      if(data.articles.length===0){
        throw new Error("No result for this search");
      }
      newsList=data.articles;
      totalResults = data.totalResults
      render();
      pagiNationRender();
    }else{
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`,
  );
  fetchNews(url);
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase(); // 어떤 버튼 눌렀는지 설정(소문자로)
  page=1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`,
  );
  fetchNews(url);
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`,
  );
  fetchNews(url);
};

const render = () => {
  const newsHTML = newsList
    .map(
      (news) => `<div class="row news">
                <div class="col-lg-4">
                     <img class="news-img-size"
                src="${
                  news.urlToImage ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
                }" />

                </div>
                <div class="col-lg-8">
                    <h2>${news.title}</h2>

                     <p>${
                       news.description == null || news.description == ""
                         ? "내용없음"
                         : news.description.length > 200
                           ? news.description.substring(0, 200) + "..."
                           : news.description
                     }
                    </p>

                    <div>${news.source.name || "no source"}  ${moment(
                      news.publishedAt,
                    ).fromNow()}
                    </div>
                </div>
            </div>`,
    )
    .join(``);
  console.log("html", newsHTML);
  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML =`<div class="alert alert-danger" role="alert">
    ${errorMessage}
    </div>`;

    document.getElementById("news-board").innerHTML=errorHTML;
}


const pagiNationRender = () => {
  let pagiNationHTML = ``;
  const totalPages =  Math.ceil (totalResults / pageSize);
  const pageGroup = Math.ceil (page / groupSize);
  let lastPage = pageGroup * groupSize;
  if(lastPage > totalPages){
    lastPage = totalPages;
  }
  const firstPage = lastPage - (groupSize - 1) <= 0? 1 : lastPage - (groupSize - 1);

  if (page > 1) {
    pagiNationHTML = `<li class="page-item" onclick="moveToPage(1)">
                        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="moveToPage(${page - 1})">
                        <a class="page-link" href='#js-bottom'>&lt;</a>
                      </li>`;
  }
  for (let i = firstPage; i <= lastPage; i++) {
    pagiNationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
                        <a class="page-link" href='#js-bottom' onclick="moveToPage(${i})" >${i}</a>
                       </li>`;
  }

  if (page < totalPages) {
    pagiNationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})">
                        <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                       </li>
                       <li class="page-item" onclick="moveToPage(${totalPages})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`;
  }

  document.querySelector(".pagination").innerHTML = pagiNationHTML;
};




const moveToPage = (pageNum) =>{
  console.log("moveToPage", pageNum);
  page = pageNum;
  fetchNews (url);
}

getLatestNews();

//*사이드리스트
const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};
