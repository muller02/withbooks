
// 댓글 창 textarea 자동으로 글 늘어나게 하기
window.addEventListener('load', function(e) {




    let textarea = document.querySelector("#new-comment");

    console.log(textarea)


    textarea.oninput = function (e) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + 'px'; //스크롤의 높이 만큼 textArea의 높이도 같이 늘어 남

    }

})


// 수정 삭제 드랍다운
window.addEventListener("load", function () {
    const dropdownButton = document.getElementById("dropdown-btn");
    const dropdownList = document.getElementById("dropdown-list");

    console.log(dropdownButton);
    console.log(dropdownList);

    dropdownButton.addEventListener("click", function () {
        dropdownList.classList.toggle("active");
    });
});

// 삭제 모달 창
window.addEventListener('load', function () {
    const openButton = document.getElementById('modal-btn');
    const closeButton = document.getElementById('close-btn');
    const modal = document.getElementById('modal');
    const modalBackdrop = document.getElementById('modal-backdrop');

    openButton.addEventListener('click', function () {
        modal.classList.remove('d:none');
        modalBackdrop.classList.remove('d:none');
        modal.classList.add('modal-fade-in');
    });

    closeButton.addEventListener('click', function () {
        modal.classList.replace('modal-fade-in', 'modal-fade-out');

        setTimeout(() => {
            modal.classList.add('d:none');
            modalBackdrop.classList.add('d:none');
            modal.classList.remove('modal-fade-out');
        }, 130);
    });
});

// 게시글 삭제
window.addEventListener('load', function () {
    const deleteBtn = document.querySelector("#delete-btn");
    const deleteForm = document.querySelector("#delete-form");

    deleteBtn.addEventListener("click", function (e) {
        console.log(e.target)
        deleteForm.action = '/board/delete';
        deleteForm.method = 'post';
        deleteForm.submit();
    })
})



// 댓글 등록 수정 삭제
window.addEventListener('load', function(e) {

    //============================== 댓글 등록 ====================================

    const commentCreateBtn  = document.querySelector("#comment-create-btn");

    commentCreateBtn.addEventListener('click', () => {

        const debateComment = {
            content : document.querySelector("#new-comment").value,
            boardId : document.querySelector("#new-comment-board-id").value
        }
        console.log(debateComment.content)
        console.log(debateComment.boardId)

        const url = `/with/debate/board/${debateComment.boardId}/comments`;
        console.log(url)

        fetch(url, {
            method: "post",
            body: JSON.stringify(debateComment),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            if (response.ok) {
                console.log("댓글이 등록되었습니다.");
                window.location.reload();
            } else {
                response.json().then(error => {
                    console.error("댓글 등록 실패:", error.message);
                });
            }

        })
    })

    //============================== 댓글 수정 ====================================
    //const commentBody = document.querySelector(".comment-body");
    const commentEditBtns = document.querySelectorAll(".comment-edit-btn");
    // const myComment = document.querySelector(".my-comment");

    commentEditBtns.forEach(commentEditBtn => {

        commentEditBtn.addEventListener("click", (e) => {

            // const commentBody = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
            let commentBody = e.target.parentNode;
            while (!commentBody.classList.contains("comment-body")) {
                commentBody = commentBody.parentNode;
            }
            // console.log(commentBody);

            // console.log(commentBody.firstElementChild);
            let commentSection = commentBody.firstElementChild;
            // console.log(commentSection);
            commentSection.classList.add("d:none")

            const userId = e.target.getAttribute("data-userId");
            const content = e.target.getAttribute("data-content");
            const id = e.target.getAttribute("data-commentId");
            const boardId = e.target.getAttribute("data-boardId");

            console.log(content)

            let editFormHtml = `
                <section class="my-comment-edit">
                    <h1 class="d:none">내 댓글 수정 폼</h1>
                    <form class="d:flex fl-dir:column py:2">
<!--                            <div class="d:flex fl-dir:column py:2">-->
                            <div class="comment-area ml:6 mt:2 mr:1 pos:relative d:flex fl-dir:column ai:end">
                                <textarea id="comment-edit-body" class="fs:2 bg-color:main-2 bd-radius:4 bd-tr-radius:0 px:3 pt:2 pb:2 mb:1 w:8p">${content}</textarea>
                                <div class="delete-button pos:absolute right:1 bottom:1"></div>
                                
                                <input type="hidden" id="comment-edit-commentId">
                                <input type="hidden" id="comment-edit-boardId">
                                <div class="d:flex ai:center">
                                    <button type="button" id="comment-cancel-btn" class="csr:pointer icon icon:trash icon-color:base-6 icon-size:3">취소</button>
                                    <button type="button" id="comment-update-btn" class="csr:pointer icon icon:pencil_simple icon-color:accent-3 icon-size:3">등록</button>
                                </div>
                            </div>
<!--                            </div>-->
                    </form>
                </section>
            `;

            commentBody.insertAdjacentHTML("beforeend", editFormHtml);

            document.querySelector("#comment-edit-commentId").value = id;
            document.querySelector("#comment-edit-boardId").value = boardId;

            const commentCancelBtn = document.querySelector("#comment-cancel-btn");
            const commentUpdateBtn = document.querySelector("#comment-update-btn");
            console.log(commentUpdateBtn);
            console.log(commentCancelBtn);

            const myCommentSection = document.querySelector(".my-comment-edit");
            console.log(myCommentSection);

            // 수정 취소 버튼 클릭
            commentCancelBtn.addEventListener("click", (e) => {
                console.log(e.target);
                myCommentSection.classList.add("d:none");
                commentSection.classList.remove("d:none");

                window.location.reload();
            })


            // 수정 완료 버튼 클릭
            commentUpdateBtn.addEventListener("click", (e) => {

                boardId: document.querySelector("#comment-edit-boardId").value;

                const comment = {
                    id: document.querySelector("#comment-edit-commentId").value,
                    content: document.querySelector("#comment-edit-body").value,
                }

                console.log(comment.id);
                console.log(comment.content);
                console.log(boardId);

                const url = `/with/debate/board/${boardId}/comments/${comment.id}`;
                console.log(url)

                fetch(url, {
                    method: "PATCH",
                    body: JSON.stringify(comment),
                    headers: {
                        "Content-Type": "application/json",
                    }
                }).then(response => {
                    if (response.ok) {
                        console.log("댓글이 수정되었습니다.");
                        window.location.reload();
                    } else {
                        response.json().then(error => {
                            console.error("댓글 수정 실패:", error.message);
                        });
                    }

                })
            })

        })
    })




    //==============================댓글 삭제 ====================================
    const commentDeleteBtns  = document.querySelectorAll(".comment-delete-btn");
    // console.log(commentDeleteBtns);

    commentDeleteBtns.forEach(deleteBtn => {
        deleteBtn.addEventListener("click", function(e) {

            const params = new URLSearchParams(window.location.search);
            const boardId = params.get("id");
            const id = e.target.getAttribute("data-commentId");

            console.log(boardId);
            console.log(id);

            const url = `/with/debate/board/${boardId}/comments/${id}`;
            console.log(url)

            fetch(url, {
                method: "delete",
            }).then(response => {
                if (response.ok) {
                    console.log("삭제 성공")
                    window.location.reload();
                } else {
                    console.log("삭제 실패")
                    return;
                }
            })
        })
    })

})

      
    
    
    
    
    
    
    
    
    
    
    
    
    
    





