


//로그인 체크 쿠키 확인 함수
  function getJSessionID() {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.startsWith("lck=")) {
        return cookie.split('=')[1];
      }
    }
    return null;
  }

// <댓글, 좋아요 클릭 시 로그인 안내 모달  창 함수 >
function loginModal(){

  const openButton = document.getElementById('modal-btn');
  const closeButton = document.getElementById('login-close-btn');
  const modal = document.getElementById('login-modal');
  const modalBackdrop = document.getElementById('login-modal-backdrop');

  modal.classList.remove('d:none');
  modalBackdrop.classList.remove('d:none');
  modal.classList.add('modal-fade-in');

  closeButton.addEventListener('click', function () {
    modal.classList.replace('modal-fade-in', 'modal-fade-out');

    setTimeout(() => {
      modal.classList.add('d:none');
      modalBackdrop.classList.add('d:none');
      modal.classList.remove('modal-fade-out');
    }, 130);
  });


}

window.addEventListener("load",function (e){

  const writeBtn = document.querySelector(".write-btn");

  writeBtn.addEventListener("click",(e)=>{
  //   if(getJSessionID() ==null){
  //     loginModal();
  //     e.preventDefault();
  //   }


  })

})


// <댓글 창 textarea 자동으로 글 늘어나게 하기
window.addEventListener("load",function (e){

  document.addEventListener("click",function (e){
    let target = e.target;

    if(!target.closest(".comment-content"))
      return;

    let regBtn = target.nextElementSibling;
    console.log(regBtn);
    if (getJSessionID() !=1) {
      // alert('로그인을 먼저하세요 ')
      // loginModal();
      // regBtn.disabled  =true;

    }

    let section = target



    // witnIntro Textarea에 input 이벤트 추가
    target.oninput = function (e) {
      target.style.height="auto";
     target.style.height = target.scrollHeight + 'px'; //스크롤의 높이 만큼 textArea의 높이도 같이 늘어 남

    };

  })



})


// <좋아요 >
window.addEventListener("load", function (e) {

  // 버블리을 위해 main 얻기
  const main = document.querySelector("#main");

  // main에 이벤트 추가
  main.addEventListener("click", async function (e) {

    // 좋아요 버튼이 아니면 return
    if (!e.target.classList.contains("likeBtn"))
      return;

    // 좋아요 버튼을 누르면 shortsId 를 얻어온다
    let shortsId = e.target.dataset.shortsId;

    // 추후 좋아요 숫자를 비동기로 변경하기위해, 좋아요 숫자 엘리먼트 찾기
    let shortsNumber = e.target.nextElementSibling;


    // Api 요청 url
    const url = `/api/shorts-like?si=`;

    try {
      const response = await fetch(url + shortsId, {
        method: "GET",
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("서버 요청에 실패");
      }

      const data = await response.text(); // response로 받은 결과 boolean을 통해 조건 처리

      if (data == 'true') {  // 내가 이전에 좋아요 했으면, 좋아요 취소

        // 로그인을 하지 않고 누르면 서버 오류 발생
        const deleteResponse = await fetch(url + shortsId, {
          method: "DELETE",
        })
        if (!deleteResponse.ok) {
          throw new Error("서버요청에 실패");
        }
        // 좋아요 취소 후 , 아이콘과 색상 변경
        e.target.classList.remove("icon-color:main-5", "icon:heart_fill");
        e.target.classList.add("icon:heart")
        e.target.classList.remove("like");

        // 좋아요 취소 후, 해당 쇼츠의 좋아요 갯수 리로드 후  삽입
        let count = getLikeCount(shortsId);
        shortsNumber.textContent = await count;

      } else if (data == 'false') {  // 내가 좋아요를 한 적이 없으면 실행

        const postResponse = await fetch(url + shortsId, {
          method: "POST"
        })
        if (!postResponse.ok) {
          throw new Error("서버요청에 실패");
        }
        // 좋아요 후, 아이콴과 색상 변경
        e.target.classList.add("icon-color:main-5", "icon:heart_fill");
        e.target.classList.remove("icon:heart")
        e.target.classList.add("like");

        //  좋아요 후 해당 쇼츠의 좋아요 갯수 리로드 후 삽입
        let count = getLikeCount(shortsId);
        shortsNumber.textContent = await count;
      }
    } catch (error) {
      // alert("로그인을 해주세요 !")
      loginModal();
      console.error("fetch 호출 중 에러 발생:", error);
    }


    // 좋아요 리로드 함수
    async function getLikeCount(shortsId) {
      let count;
      let url = `/api/shorts-like/count?si=${shortsId}`
      let resoponse = fetch(url);

      count = (await resoponse).text();

      console.log(count);
      return count;

    }


  })


})



window.addEventListener('load', function () {
  const modalBackdrop = document.querySelector('#modal-backdrop');

  document.addEventListener('click', function (event) {
    const target = event.target;

    // 내가 클릭한 요소가 shortsection 이면  진행
    const shortSection = target.closest('.short-section');
    if (!shortSection) return;

    const dropDownList = shortSection.querySelector(".dropdown-list");

    const openButton = shortSection.querySelector('#modal-btn');
    const closeButton = shortSection.querySelector('#close-btn');
    const modal = shortSection.querySelector('#modal');
    const formName = shortSection.querySelector("#form-name");
    const okButton = shortSection.querySelector("#ok-btn");


    //내가 클릭한 요소가 삭제하기 면 모달창을 나오게 하고 , 화면을 어둡게 하고,
    if (target === openButton) {
      event.preventDefault();
      modal.classList.remove('d:none'); // 모달창 보이게하기
      modalBackdrop.classList.remove('d:none'); //어두운 화면 나타나게하기
      modal.classList.add('modal-fade-in');
      dropDownList.classList.remove("active");  // ... 의 모달은 가리기
    }

    if (target === closeButton) {
      modal.classList.replace('modal-fade-in', 'modal-fade-out');

      setTimeout(() => {

        modal.classList.add('d:none');
        modalBackdrop.classList.add('d:none');
        modal.classList.remove('modal-fade-out');
      }, 130);

    }

    if (target === okButton) {
      formName.action = "/shorts/delete";
      formName.method = "post";
      formName.submit();
    }
  });
});



// 이미지 슬라이드
window.addEventListener("load", () => {
  const shortSections = document.querySelectorAll(".short-section");

  let width = document.querySelector(".img-list > img");

  shortSections.forEach((short) => {
    let pages = 0; // 현재 인덱스 번호
    let positionValue = 0; // images 위치값
    const IMAGE_WIDTH = 300; // 한번 이동 시 IMAGE_WIDTH만큼 이동한다.

    const nextBtn = short.querySelector(".next");
    const backBtn = short.querySelector(".back");
    const images = short.querySelector(".images");

    const imgPaging = Array.from(short.querySelectorAll(".img-paging > li"));
    const imgLen = short.querySelectorAll(".images > img").length;

    //이미지 슬라이드 되면, 해당 스라이드 패이징 색상 변경 함수
    function imgSlidePaging(pages) {
      imgPaging.forEach((img, index) => {
        img.classList.add("bg-color:main-3");

        if (index === pages) {
          img.classList.remove("bg-color:main-3");
          img.classList.add("bg-color:main-5");
        }
      });
    }

    //각 쇼츠에 nextBtn과 backBtn이 없으면 리턴
    if (nextBtn == null || backBtn == null) return;

    nextBtn.addEventListener("click", function () {
      console.log("widhth = ", width.offsetWidth);
      if (pages < imgLen - 1) {
        backBtn.removeAttribute("disabled"); // 뒤로 이동해 더이상 disabled가 아니여서 속성을 삭제한다.
        positionValue -= IMAGE_WIDTH; // IMAGE_WIDTH의 증감을 positionValue에 저장한다.
        images.style.transform = `translateX(${positionValue}px)`; // x축으로 positionValue만큼의 px을 이동한다.
        pages += 1; // 다음 페이지로 이동해서 pages를 1증가 시킨다.

        imgSlidePaging(pages); //슬라이드 페이징 색상 변경 함수 호출
      }
      if (pages === imgLen - 1) {
        nextBtn.setAttribute("disabled", "true"); // 마지막 장일 때 next버튼이 disabled된다.
      }
    });

    backBtn.addEventListener("click", function () {
      if (pages > 0) {
        nextBtn.removeAttribute("disabled");
        positionValue += IMAGE_WIDTH;
        images.style.transform = `translateX(${positionValue}px)`;
        pages -= 1; // 이전 페이지로 이동해서 pages를 1감소 시킨다.

        imgSlidePaging(pages); //슬라이드 페이징 색상 변경 함수 호출
      }
      if (pages === 0) {
        backBtn.setAttribute("disabled", "true"); // 첫 장 일때 back버튼이 disabled된다.
      }
    });
  });


});

// 댓글 리스트 요청
function getCommentList(shortsId, comments, getCommentCount) {
  comments.innerHTML = "";

  let commentCount = 0;

  fetch(`/api/comments/list?shorts_id=${shortsId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let commentList = data.list;
        let userId = data.userId;

        commentList.forEach((cmt) => {
          let formattedDate = moment(cmt.regDate).format('YY-MM-DD HH:mm');

          commentCount++; // 댓글 갯수 카운트
          let divHTML = `
          <div class="border-bottom pt:3 pl:2">
            <div class="d:flex ai:center">
              <div class="border-radius:full of:hidden mr:1 comment-user-img mr:2">
                <img src="${cmt.img}" class="w:100p h:100p">
              </div>
              <span></span>
              <div class="mr:auto fw:2">${cmt.nickname}</div>
              `;

          if (cmt.userId == userId) {
            divHTML += `
            <div class="n-dropdown comment-dropdown">
              <button class="cursor:pointer dropdown-btn">
                <span class="comment-dots-icon icon icon:dots_three_outline_vertical_fill icon-size:3 color-icon rg-comment-hover"></span>
              </button>
              <ul class="dropdown-list w:2 comment-modal-transform comment-dropdown-list">
                <li>
                  <button class="va:middle delete-comment text-align:center color:accent-2" data-commentId="${cmt.id}">
                    삭제하기
                  </button>
                </li>
              </ul>
            </div>
            `;
          }

          divHTML += `
            </div>
            <div class="mt:3 comment-content-color pl:2 fs:2">${cmt.content}</div>
            <div class="ml:auto fs:1 color:base-3 mb:2 d:flex jc:end">${formattedDate}</div>
          </div>
        `;

          comments.insertAdjacentHTML("beforeend", divHTML);
        });

        if (getCommentCount !== null)
          getCommentCount(commentCount);
      })
      .catch((error) => console.error("Error:", error));
}



document.addEventListener("click", function (e){

  // 내가 선택한 것이 delete-comment가 아니면 종료
  if (!e.target.closest(".delete-comment"))
    return;

  let target = e.target;

  let commentGroup = target.closest(".comment-group");
  let commentBtn = commentGroup.previousElementSibling.querySelector(".comment-btn")
  let shortsId = commentBtn.dataset.shortsId;
  let comments = commentGroup.querySelector(".comments");
  let countComment = commentBtn.nextElementSibling;

  // 선택한 댓글의 commentId 저장
  let commentId = target.dataset.commentid;

  // api delete 요청
  let url = `/api/comments?cmtId=${commentId}`;

  fetch(url, { method: "DELETE" })
      .then(response => {
        if (!response.ok) {
          throw new Error("서버 요청에 실패");
        }
        // 코멘트 리스트 출력 , 코멘트 숫자 갱신
        getCommentList(shortsId, comments, function(commentCount) {
          countComment.innerHTML = commentCount;
        });
      })
      .catch(error => {
        console.error("fetch 호출 중 에러 발생:", error);
      });
});





// 점점점 버튼 클릭 시 모달 창 나타나는 이벤트, 점점점 밖에 영역 클릭 시 모달 창 닫힘
window.addEventListener("load", function () {

  const main = document.querySelector("#main");
  let siblingElement = null;

  main.addEventListener("click", function (e) {

    const target = e.target;
    if (target.classList.contains("shorts-content-dots")) {

      const parentElement = target.parentElement;
      siblingElement = parentElement.nextElementSibling;
      siblingElement.classList.add("active");
      siblingElement.classList.add("transform-x");

    }
    else if (siblingElement && siblingElement.classList.contains("active")) {

      siblingElement.classList.remove("active");

    }
  });
});





// 댓글 창 관련 이벤트, 댓글 리스트 GET, 댓글 X 버튼 클릭
window.addEventListener("load", function (e) {
  //메인 엘리먼트 가지고 오기
  let main = document.querySelector("#main");

  // 방금 전 선택한 댓글 요소를 저장할 임시 배열
  let tmpArr = [];

  // 메인 이벤트 시작 버블링
  main.addEventListener("click", function (e) {
    // 내가 클릭한 아이의 클래스에 icon:cahts 가 없으면 리턴
    if (!e.target.classList.contains("icon:chats")) return;

    //내가 클릭한 요소의 부모 중  댓글/ 좋아요 아이콘이 있는 section 을 가지고 온다 .
    let commentBox = e.target.closest(".cmt-like-section");

    // 그 section의 다음 형제(댓글 창)  엘리먼트를 가지고 온다 .
    let commentGroup = commentBox.nextElementSibling;

    // 첫번 째로 댓글 아이콘을 클릭하면,  그 아이의 d:none 속성을 제거한다.
    commentGroup.classList.remove("d:none");

    // 방금 내가 선택한 댓글 엘리먼트를 임시 배열에 넣는다.
    tmpArr.push(commentGroup);

    // 다음 댓글을 클릭하게 되면 배열 0번쨰 있는 댓글의 클래스 d:none 추가하여 보이지 않게 만든 다음  배열에 제거
    // 다음 댓글이 배열 0번쨰 요소로 이동

    //배열에 2개가 담기게 되면 실행
    if (tmpArr.length > 1) {
      tmpArr[0].classList.add("d:none");
      tmpArr.shift();
    }

    //html 자체에 d:none이 있기 때문에 , 새 댓글창을 보려면 d:none을 제거해야함
    tmpArr[0].classList.remove("d:none");

    let shortsId = e.target.dataset.shortsId;
    let comments = commentGroup.querySelector(".comments");

    getCommentList(shortsId, comments, null);

    let closeBtn = commentGroup.querySelector(".comment-close");

    //닫기 버튼
    closeBtn.onclick = function (e) {
      commentGroup.classList.add("d:none");
    };
  });
});




// 댓글 POST 요청
window.addEventListener("load", function (e) {

  let main = document.querySelector("#main");

  main.addEventListener("click", function (e) {

    if (!e.target.closest(".cmt-like-section"))
      return;

    let commentBox = e.target.closest(".cmt-like-section"); // 댓글, 좋아요 버튼이 있는 box
    let commentGroup = commentBox.nextElementSibling;
    let commentBtn = commentBox.querySelector(".comment-btn");
    let shortsId;


    if (commentBox.querySelector(".comment-btn")) {
      shortsId = commentBtn.dataset.shortsId;
    }

    let countComment = commentBox.querySelector(".count-comment");  // 댓글 숫자 나오는 엘리먼트
    let comments = commentGroup.querySelector(".comments"); //댓글 창 내부 댓글 리스트
    let commentReg = commentGroup.querySelector(".comment-reg"); // 댓글 등록 버튼
    let commentContent = commentGroup.querySelector(".comment-content"); // 댓글창 input



    // input에 내용이 있어야 버튼 활성화 가능 함수
    function  updateButtonState(){
      if(getJSessionID() ==null){
      //   commentReg.disabled =true;
      // return
      }

      if(commentContent.value.trim() === "" || commentContent.value.trim() ===null){
        commentReg.disabled = true;
      }else{
        commentReg.disabled=false;
      }

    }


    //댓글 input창에 입력될 때 마다 함수 호출
    commentContent.addEventListener("input",updateButtonState);

    // if(getJSessionID() ==null)
    //   commentReg.disabled =true;

    commentReg.onclick = function (e) {
      let content = commentContent.value;

      if (commentContent.value === "") {
        alert("댓글을 입력해주세요 !");
        return;
      }

      let httpRequest = new XMLHttpRequest();
      let shortsComment = {
        shortsId,
        content,
      };
      httpRequest.onload = () => {
        getCommentList(shortsId, comments, function (commentCount) {
          countComment.innerHTML = commentCount;
        });
        
        // 댓글 등록 누르고나서의 행위 , 댓글 내용 초기화, 댓글 등록 버튼 비활성화
        commentContent.value = "";
        commentReg.disabled=true; 
      };
      httpRequest.open("POST", "/api/comments", true);
      httpRequest.responseType = "json";
      httpRequest.setRequestHeader("Content-Type", "application/json");
      httpRequest.send(JSON.stringify(shortsComment));
    };


  });
});





// 댓글창 점점점 버튼
window.addEventListener("load", function () {

  // 메인 엘리먼트 가지고오기
  const main = document.querySelector("#main");

  main.addEventListener("click", function (e) {

    // e.target 변수 설정
    const target = e.target;

    // 내가 클릭한 아이의 부모 중 comment - dropdown이 없으면 함수 종료
    if (!target.closest(".comment-dropdown"))
      return;

    // 내가 클릭한 아이의 comment-dropdown 가지고 옴
    const commentDropdown = target.closest(".comment-dropdown");

    // .. 버튼
    const dotBtn = commentDropdown.querySelector(".comment-dots-icon");

    // ... 버튼 클릭시 나오는 모달 창
    const dropdownList = commentDropdown.querySelector(".dropdown-list");

    dropdownList.classList.add("active");

    // 아무데나 클릭하면 , 모달창 사라지게 하기
    // 위에서 e.target의 범위를 한정 했기 때문에 , 내가 문서 전체에서 e 를 가지고 와서
    // e.target 의 범위를 제한하지 않으면서 모든 클릭 대상을 설정 가능
    document.addEventListener("click", function (e) {

      //내가 클릭한 애가 dotBtn이 아니면 모달창에 active 제거
      if (!e.target.contains(dotBtn)) {
        dropdownList.classList.remove("active");
      }

    });
  });
});
