  // 검색을 위한 부모 form 찾기
  const searchBookForm = this.document.querySelector("#search-book-form");
  const searchForm = searchBookForm.querySelector(".book-search");

  // 쿼리 검색
  const searchQueryInput = searchBookForm.querySelector(".search-query-input[name=q]");
  const queryInputBtn = searchBookForm.querySelector(".query-input-btn");

  // 카테고리 검색
  const searchCategory = searchBookForm.querySelector(".search-category");
  let categoryValue = 0;


  // 쿼리 submit
  queryInputBtn.addEventListener("click", function (e) {
    e.preventDefault();
    searchSubmit();
  });

  // 카테고리 submit
  searchCategory.addEventListener("click",function(e){

    // 클릭한 카테고리가 li가 아닌 경우 모두 퇴출
    let clickedCategoryLi = e.target;
    if (clickedCategoryLi.tagName != "LI") return;
    
    let clickedValue = clickedCategoryLi.querySelector("span").dataset.id;

    if(categoryValue == clickedValue){
      categoryValue = 0;
      searchSubmit();
    }else{
      // 카테고리 값 설정
      categoryValue = clickedValue;
      searchSubmit();
    }
  });

// =============================================================
// 쿼리 & 카테고리 검색
function searchSubmit(){
    if(categoryValue > 0){
        let categoryInput = document.createElement("input");
        categoryInput.setAttribute("type", "hidden");
        categoryInput.setAttribute("name", "c");
        categoryInput.setAttribute("value",categoryValue);
        searchForm.appendChild(categoryInput);
    }
    searchForm.submit();
}

// 파라미터로부터 catrgoryId 뽑기
window.addEventListener("load",function(){
    // url param으로 꺼냄
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("c");
    // 파람에 카테고리 없는 경우 return
    if(!categoryParam)
        return;

    if(categoryParam)

    // 카테고리 값 설정
    categoryValue = categoryParam;

    // li span 태그들 중 카테고리 값을 data-set으로 가진 요소 색상 변경
    let categoryspans = searchCategory.querySelectorAll("span");
    categoryspans.forEach((span)=>{
        let parentLi = span.parentNode.parentNode;

        if(span.dataset.id == categoryValue){
            parentLi.classList.add("bg-color:main-5");
            span.classList.add("color:main-1");
        }
            
    })


        
});