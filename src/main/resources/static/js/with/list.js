// 카테고리 검색  클릭 시 모달창 표시
window.addEventListener("load", function (e) {
  const searchBtn = document.querySelector("#search-btn");
  const searchBox = document.querySelector(".search-box");
  const resetIcon = document.querySelector(".reset-icon");
  const categorySection = document.querySelector("#category");
  const categoryList = categorySection.querySelector(".category-list");
  const inputCheckBox = categoryList.querySelectorAll("input[type='checkbox']");
  const faceYnDiv = searchBox.querySelector(".face-yn");
  const faceYnRadio = faceYnDiv.querySelectorAll("input[type='radio']");
  const querySearch = document.querySelector(".query-search");
  const queryBtn = document.querySelector(".query-btn");

  let categoryIdArr = []; // categoryId를 누적으로 저장하는 배열
  let faceYn;
  let query;

  const writeBtn = document.querySelector(".write-btn");

  /* 로그인 정보 쿠키 확인 */
  function getJSessionID() {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith("lck=")) {
        return cookie.split("=")[1];
      }
    }
    return null;
  }

  /* 로그인 안내 모달 창 */
  function loginModal() {
    const closeButton = document.getElementById("login-close-btn");
    const modal = document.getElementById("login-modal");
    const modalBackdrop = document.getElementById("login-modal-backdrop");

    modal.classList.remove("d:none");
    modalBackdrop.classList.remove("d:none");
    modal.classList.add("modal-fade-in");

    closeButton.addEventListener("click", function () {
      modal.classList.replace("modal-fade-in", "modal-fade-out");

      setTimeout(() => {
        modal.classList.add("d:none");
        modalBackdrop.classList.add("d:none");
        modal.classList.remove("modal-fade-out");
      }, 130);
    });
  }

  writeBtn.addEventListener("click", (e) => {
    if (getJSessionID() == null) {
      loginModal();
      e.preventDefault();
    }
  });

  /* 대면비대면 선택에 따른 정렬 */
  faceYnDiv.onclick = async function (e) {
    if (e.target.nodeName !== "INPUT") return;
    faceYn = e.target.value;

    //비동기 fetch 메소드 호출 및 GET 통신
    let response = await getByParams(categoryIdArr, query, faceYn);

    // 위드 리스트를 받아옴
    let list = await response.json();

    updateHTML(list);
    console.log(faceYn);
  };

  searchBtn.onclick = function (e) {
    searchBox.classList.toggle("d:none");

    if (searchBtn.classList.toggle("icon:plus")) {
      searchBtn.classList.remove("icon:minus");
      searchBtn.classList.add("icon:plus");
      searchBtn.classList.add(".ani2");
    } else {
      searchBtn.classList.remove("icon:plus");
      searchBtn.classList.add("icon:minus");
      searchBtn.classList.add(".ani2");
    }
  };

  // reset 아이콘 클릭시 모든 checkbox false 상태로 변환
  resetIcon.onclick = async function (e) {
    querySearch.value = null;

    for (let i of inputCheckBox) {
      i.checked = false;
    }
    categoryIdArr.length = 0;

    //비동기 fetch 메소드 호출 및 GET 통신
    let response = await getByParams(categoryIdArr, null, null);
    for (let i of faceYnRadio) {
      i.checked = false;
    }
    faceYnRadio[0].checked = true;
    // 위드 리스트를 받아옴
    let list = await response.json();
    updateHTML(list);
  };

  // 체크박스 클릭시 그에 해당하는 value를 가지고온다 e.target을 통해
  // 가지고 온 value값을 배열에 담아준다 .
  // locahostL8080/ ? c=2&c=3&c=4
  // 문자열 결합

  // querySearch 엘리먼트에서 keypress 이벤트와 queryBtn 클릭 이벤트에 대한 핸들러 함수입니다.
  async function handleQuery() {
    query = querySearch.value;
    // 비동기 fetch 메소드 호출 및 GET 통신
    let response = await getByParams(categoryIdArr, query, faceYn);
    // 위드 리스트를 받아옴
    let list = await response.json();
    updateHTML(list);
  }

  // querySearch 엘리먼트에서 keypress 이벤트를 감지하여 엔터 키를 눌렀을 때 handleQuery 함수를 호출합니다.
  querySearch.addEventListener("keypress", async function (event) {
    // event.key가 "Enter"일 때만 동작하도록 합니다.
    if (event.key === "Enter") {
      await handleQuery();
    }
  });

  // queryBtn 클릭 시 handleQuery 함수를 호출합니다.
  queryBtn.onclick = handleQuery;

  // 카테고리 검색
  categoryList.addEventListener("click", async (e) => {
    if (e.target.nodeName !== "INPUT" && e.target.type !== "checkbox") return;

    // 이거는 체크 박스 클릭하면 넣고 아니면 뺴기
    let categoryId;
    if (e.target.nodeName === "INPUT" && e.target.type === "checkbox") {
      categoryId = e.target.value;
    }

    if (e.target.checked) {
      categoryIdArr.push(e.target.value);
    } else {
      categoryIdArr = categoryIdArr.filter((item) => item !== categoryId);
    }

    console.log(categoryIdArr);

    //비동기 fetch 메소드 호출 및 GET 통신
    let response = await getByParams(categoryIdArr, query, faceYn);

    // 위드 리스트를 받아옴
    let list = await response.json();

    updateHTML(list);
  });
});

//
function getByParams(categoryIdArr, query, faceYn) {
  let categoryIds = "";

  if (categoryIdArr !== null) {
    for (let i = 0; i < categoryIdArr.length; i++) {
      categoryIds += categoryIdArr[i];
      // c?=2 &c=
      if (i < categoryIdArr.length - 1) {
        categoryIds += "&c=";
      }
    }
  }

  let url;

  console.log("f=", faceYn);
  console.log("q=", query);
  console.log("c=", categoryIds);

  if (
    query &&
    query !== "" &&
    categoryIdArr &&
    categoryIdArr.length !== 0 &&
    faceYn &&
    faceYn !== ""
  ) {
    url = `/?c=${categoryIds}&q=${query}&f=${faceYn}`;
  } else if (
    categoryIdArr &&
    categoryIdArr.length !== 0 &&
    faceYn &&
    faceYn !== ""
  ) {
    url = `/api/withs?f=${faceYn}&c=${categoryIds}`;
  } else if (query && query !== "") {
    url = `/api/withs?q=${query}`;
  } else if (categoryIdArr && categoryIdArr.length !== 0) {
    url = `/api/withs?c=${categoryIds}`;
  } else if (faceYn && faceYn !== "") {
    url = `/api/withs?f=${faceYn}`;
  } else {
    url = `/api/withs`;
  }

  // const method = "GET";
  return fetch(url);
}

function updateHTML(list) {
  const withListUl = document.querySelector(".with-list-ul");

  withListUl.innerHTML = ``;

  for (let item of list) {
    let categoryHtml = "";

    for (let category of item.categoryNames) {
      categoryHtml += `<li class=" bd-color:base-3 border-radius:11 fs:1 pl:3 pr:3 pt:1 pb:1 background-color:main-6 fl-shrink:0">
                        <span class="color:base-1">${category}</span>
                          </li>`;
    }

    let innerHtml = `
       
             <li
            class="d:flex with-ul gap:2 flex-direction:column n-item:shadow"
   
          >
            <ul class="d:flex gap:1 flex-wrap:wrap">
              <li
                class="border bd-color:base-2 border-radius:11 fs:1 pl:3 pr:3 pt:1 pb:1 mr:2"
              >
                <span class="" 
                  >${item.faceYn == 1 ? "대면" : "비대면"}</span
                >
              </li>
              ${categoryHtml}
            </ul>
            <div class="d:flex pt:1 gap:5">
              <!--            th:with img-->
              <div
                class="w:2 h:2 box-shadow border-color:base-2 border-radius:3 my:auto flex-shrink:0"
              >
                <img
                  src="${item.img}"
     
                  class="w:100p h:100p border-radius:3"
                />
              </div>

              <div class="d:flex gap:1 flex-direction:column flex-grow:1">
                <div class="fs:6 fw:3 mb:2">
                  <a
                        href="/with/detail?id=${item.id}"
        
                  >
                   ${item.name}</a
                  >
                </div>
                <div class="d:flex ai:center gap:1 ai:center">
                  <div class="d:flex ai:center">
                    <span class="icon icon:user  icon-size:2"></span>
                    <span
                      class="fs:2 color:base-5 ml:1"
       
                      >${item.memberCnt}명/${item.personnel}명</span
                    >
                  </div>
                  <!--            <span>·</span>-->
                  <div class="d:flex ai:center">
                    <span class="icon:calendar_check icon icon-size:2"></span>
                    <span
                      class="fs:2 color:base-5 ml:1"
     
                      >월 ${item.interval} 회</span
                      
                    >
                  </div>
                  <!--            <span>·</span>-->
                </div>

                <div class="d:flex ai:center">
                  <span class="icon icon:map_pin_fill  icon-size:2"></span>
                  <span
                    class="fs:2 color:base-5 ml:1"
        
                    >${item.location}</span
                  >
                </div>
                <div class="ln-clamp:3">
                  <span class=" " >
                        ${item.intro}
                  </span>
                </div>
              </div>
            </div>
          </li>
       `;

    withListUl.insertAdjacentHTML("beforeend", innerHtml);
  }
}
