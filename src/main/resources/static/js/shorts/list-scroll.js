{
  // 마지막 게시글의 아이디 얻기
  let lastShorts = document.querySelector(".observe-target");
  
  const urlParams = new URL(location.href).searchParams;
  const id = urlParams.get('id');
  
  if(!id){

    let observer = new IntersectionObserver((entries, observer)=>{
      if(entries[0].isIntersecting){
  
        let lastSectionId = lastShorts.dataset.id;
  
        fetch(`/api/bookShorts/list?m=2&ls=${lastSectionId}`)
        .then((response)=>response.json())
        .then((data)=>{
          
          // 마지막 게시글에 가면 데이터 불러와서 글 늘리고
          // 기존의 observe-target 지우고
           // 기존의 observer를 해제
           // 새로 만든 애를 observe
          makeTemplate(data);
  
          
          
  
          console.log(data)
        })
      }
    }, { threshold: 1});
    
    observer.observe(lastShorts);
  }

  




  function makeTemplate(list){

    let template = "";
    let n = 1;

    for(let shorts of list){
      let classAppend = (n == list.length) ? 'observe-target' : '';
      n++;


      let imgTemplate = "";
      if(shorts.img.length > 0){
        let imgsLength = shorts.img.length;
        imgTemplate += `
                        <section class="fl-dir:column align-self:center my:5 lg:my:0 lg:order:1 lg:mr:6 img-section gap:2">
                          <h1 class="d:none">북쇼츠 본문 이미지</h1>

                          <div class="d:flex fl-dir:column h:7 w:7 mx:auto">
                            <div class="slide w:7 h:7 of:hidden pos:relative border-radius:2">
                              <div
                                class="img-list transition-transform images d:inline-flex position:relative"
                              >`;
                                
        console.log("id : ", shorts.id, "shorts.img : ", shorts.img);
        for(let img of shorts.img)
          imgTemplate +=   `
                              <img
                                src="/image/shorts/${img}"
                                alt="본문 이미지"
                                class="w:7 h:7 bd-radius:1 pb:1"
                              />
                          `;
                        
                        
        imgTemplate +=   `
                          </div>
                        `;

                            
        if(1 < shorts.img.length)
          imgTemplate += `
                          <button
                            class="back position:absolute cursor:pointer ml:2 icon-color:sub-1 icon icon:arrow_left border-radius:full bg-color:base-3 top:5p left:0"
                          >
                            <span class=" "></span>
                          </button>

                          <button
                            class="next position:absolute cursor:pointer mr:2 icon icon:arrow_right border-radius:full icon-color:sub-1 bg-color:base-3 top:5p right:0"
                          >
                        `;

                        
        imgTemplate += `
                              <span class="icon-color:sub-1 icon icon:arrow_right"></span>
                            </button>
                          </div>

                          <section class="pager as:stretch mt:1">
                            <h1 class="d:none">이미지 페이저</h1>
                        `;

        if(1 < shorts.img.length){
          imgTemplate +=  `
                              <ul
                                class="d:flex of:hidden img-paging gap:1"
                              >
                          `

        let i = 0;
        for(let img of shorts.img){
          imgTemplate +=  `
                                <li
                                  class="bd-radius:2 transition-background fl-grow:1 h:1 
                          `;
                      
                          
          if(0 < i)
            imgTemplate +=  ` ml:2 bg-color:main-3"`;
          else  
            imgTemplate +=  ` bg-color:main-5"`;
          
          
          imgTemplate += `></li>`;

          i++;
        }


          imgTemplate +=  `</ul>`

        }


        imgTemplate += `
                          </section>
                          </div>
                        </section>
                      `;
      }
        


      template += `
        <section
          
        class="bd bd-color:base-3 box-shadow-custom bd-radius:6 px:4 py:4 mt:6 short-section lg:pos:relative"
        >
          <h1 class="d:none">북쇼츠</h1>

          <section class="shorts d:flex jc:center ai:center px:1 ${classAppend}"
          data-id="${shorts.id}"
          >
            <h1 class="d:none">북쇼츠 작성관련 정보</h1>
            <div class="h:1 w:1 border-radius:full of:hidden">
              <img
                class="obj-fit:contain h:10p w:10p"
                src="/image/shorts/${shorts.userImg}"
                alt="프로필사진"
              />
            </div>

            <span class="d:flex ml:1 flex-direction:column">
              <div>
                <a
                  href=""
                  class="font-size:2 comment-title-color font-weight:3 ml:1"
                  >${shorts.userNickname}</a
                >
              </div>
              <div
                class="as:end font-size:1 color:base-4 ml:1"
              >
              ${shorts.regDate}
              </div>
            </span>
            <div class="ml:auto">
              <a
                href="/book/detail?id=${shorts.bookId}"
                class="font-size:1 color:base-4"
                >${shorts.bookTitle}</a
              >
            </div>
          </section>

          <section class="d:flex jc:end my:3">
            <h1 class="d:none">북쇼츠 팝업버튼</h1>
            <div class="n-dropdown">
              <button class="cursor:pointer dropdown-btn">
                <span
                  class="icon icon:dots_three_outline_vertical_fill color-icon rg-comment-hover shorts-content-dots"
                ></span>
              </button>
              <ul class="dropdown-list ">
                <li>
                  <button>
                    <span class="va:middle deco deco-size:2 icon:share_fat w:100p">
                      공유하기
                    </span>
                  </button>
                </li>`

                // 이 문자열 어떻게 하지? `
                //     <li th:if="${#authentication.principal ne 'anonymousUser'}">
                //     <button>
                //       <span class="va:middle deco deco-size:2 icon:share_fat w:100p">
                //         신고하기
                //       </span>
                //     </button>
                //   </li>

                //   <li th:if="${#authentication.principal ne 'anonymousUser' and #authentication.principal.id eq s.userId}">
                //     <button>
                //       <a
                //         href=""
                //         th:href="@{edit(sid=${shorts.id},bid=${shorts.bookId})}"
                //         class="va:middle deco deco-size:2 icon:pencil_simple w:100p"
                //       >
                //         수정하기
                //       </a>
                //     </button>
                //   </li>

                //   <li th:if="${#authentication.principal != 'anonymousUser' and #authentication.principal.id eq s.userId}">
                //     <form id="form-name" class="px:2 py:1">
                //       <button
                //         id="modal-btn"
                //         class="delete-btn w:100p va:middle deco deco-size:2 ai:center deco-color:accent-2 icon:trash color:accent-2 fs:2 fw:2"
                //       >
                //         삭제하기
                //       </button>
                //       <input type="hidden" name="shorts-id" th:value="${shorts.id}" />

                //     </form>
                //   </li>
                // `
                

              template += `</ul>
            </div>
            <section
                id="modal"
                class="n-modal d:none modal-transform-xy"
                tabindex="-1"
              >
                <h1 class="n-font:subtitle text-align:center">
                  게시글을 정말 삭제 하시겠습니까 ?
                </h1>
                <div class="mt:4 d:flex">
                  <button id="ok-btn" type="button" class="n-btn w:2 mr:4">
                    확인
                  </button>
                  <button
                    id="close-btn"
                    type="button"
                    class="n-btn w:2 bg-color:main-2"
                  >
                    닫기
                  </button>
                </div>
            </section>
          </section>

          
          <span class="lg:d:flex lg:ai:start gap:2">
            ${imgTemplate}  
          <span class="d:block w:100p">

              <article class="h:max-content pl:2 pr:3">
                <h1 class="d:none">북쇼츠 본문</h1>
                <p class="ml:2 mr:2 ln-h:2 fs:2">
                ${shorts.content}
                </p>
              </article>
            </span>
          </span>

          <section class="d:flex ai:center jc:end mr:2 mt:4 cmt-like-section">
            <h1 class="d:none">댓글/좋아요 버튼</h1>
            <div class="d:flex fl-dir:column ai:center">
              <div
                class="icon icon:chats  icon-size:5 comment-btn cursor:pointer color-icon"
                data-shorts-id="${shorts.id}"
              ></div>
              <div
                class="fs:3 fw:3 count-comment  color-text"
              >
              ${shorts.commentCnt}
              </div>
            </div>
            <div class="d:flex fl-dir:column ai:center ml:5">
              <div data-shorts-id="${shorts.id}" class="likeBtn icon icon-size:5 cursor:pointer    `;
              
              if(shorts.liked == 1)
                template += ' icon:heart_fill icon-color:main-5';
              else
                template += ' icon:heart';

              template += `"></div>`;
              


              template += `
              <div class="fs:3 fw:3 color-text" >${shorts.likeCnt}</div>
              <section
                      id="modal-like"
                      class="n-modal d:none modal-transform-xy"
                      tabindex="-1"
              >
                <h1 class="n-font:subtitle text-align:center">
                  로그인을 해주세요
                </h1>
                <div class="mt:4 d:flex">
                  <button id="ok-btn-like" type="button" class="n-btn w:2 mr:4">
                    로그인 하러 가기
                  </button>
                  <button
                          id="close-btn-like"
                          type="button"
                          class="n-btn w:2 bg-color:main-2"
                  >
                    닫기
                  </button>
                </div>
              </section>

            </div>
          </section>

          <section
            class="comment-group box-shadow-custom bg-color:sub-1 translate-x-18px mt:2 d:none h:auto d:flex fl-dir:column bd-radius:6 p:3 lg:pos:absolute lg:bottom:0 lg:right:-7 lg:border lg:w:7 zi:4"
          >
            <h1 class="d:none">북쇼츠 댓글</h1>
            <div
              class="icon icon:x cursor:pointer comment-close rg-comment-hover"
            ></div>
            <div class="comments color-base-9"></div>

            <div>
              <form class="d:flex mt:2 ai:center" method="post">
                <textarea
                  type="text"
                  required
                  class="comment-content px:1 py:1 n-textbox mr:2 of:hidden "
                  name="comment-content"
                  placeholder="댓글을 입력하세요 ! "
                ></textarea>

                <button type="button" class="n-btn n-btn-color:main comment-reg" >
                  등록
                </button>
              </form>
            </div>
          </section>
        </section>
      `;




      
    }


    // 데이터 불러와서 글 늘리고
    let bookshortsList = document.querySelector("#bookshorts-list");
    bookshortsList.insertAdjacentHTML("beforeend", template);

    // 기존의 observe-target 지우고
    lastShorts.classList.remove("observe-target");

    // 기존의 observer를 해제
    observer.unobserve(lastShorts);

    // 새로 만든 애를 observe
    lastShorts = document.querySelector("section.observe-target");
    if(lastShorts != null)
      observer.observe(lastShorts);

    
      
  }

}






