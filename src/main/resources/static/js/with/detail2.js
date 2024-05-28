// window.addEventListener("DOMContentLoaded", (e) => {
//   let contentDiv = document.querySelector("#content");
//   let menuTap = document.querySelector(".menu-tap");
//   let withInfoSection = document.querySelector("#with-info");
//   let withJoinDiv = withInfoSection.querySelector(".with-join-btn");
//   let withJoinBtn = withJoinDiv.querySelector("button");
//
//   let lis = menuTap.querySelectorAll("li");
//
//   let tmpContetnDiv = contentDiv.innerHTML;
//
//   // console.log(tmpContetnDiv);
//
//   //===================== 해당 텝의 스크립트 추가 ============================//
//
//   async function getAnyList(withId, reqUrl) {
//     let url = reqUrl;
//
//     try {
//       let response = await fetch(url);
//
//       if (!response.ok) {
//         throw new Error("네트워크 상태가 좋지 않습니다.");
//       }
//
//       let list = await response.json();
//       return list;
//     } catch (error) {
//       console.error("게시판 목록을 가져오는 동안 오류 발생:", error);
//       throw error; // 예외를 다시 throw하여 호출자에게 전달
//     }
//   }
//
//   // 가입신청 버튼 클릭시
//   withJoinBtn.addEventListener("click", async (e) => {
//     // 회원이 아닌 경우
//     if (e.target.classList.contains("anonymous")) {
//       loginModal();
//       return;
//     }
//
//     // 위드 아이디
//     let withId = withJoinDiv.querySelector("input").value;
//
//     // 탈퇴 버튼 클릭시
//     if (withJoinBtn.classList.contains("joined")) {
//       let result = confirm("탈퇴 하시겠습니까?");
//       if (result) {
//         document.deleteMember.submit();
//         alert("탈퇴되었습니다.");
//       }
//       return;
//     }
//     // 위드가입 api
//     let reponse = await fetch(`/api/withs/join?withId=${withId}&userId=`);
//
//     // 가입된 상태를 식별하기 위한 스타일 변경
//     reponse.json().then(() => {
//       withJoinBtn.textContent = "가입 되었습니다!";
//       withJoinBtn.classList.add("joined");
//       withJoinBtn.classList.add("bg-color:main-1");
//       withJoinBtn.classList.add("color:main-5");
//       // 버튼이 바뀌는 동안 이벤트 발생 막기 위해 disabled 처리
//       withJoinBtn.setAttribute("disabled", "");
//
//       // 0.8초 뒤에 탈퇴하기 버튼으로 바뀜
//       setTimeout(function () {
//         withJoinBtn.classList.remove("bg-color:main-1");
//         withJoinBtn.classList.remove("color:main-5");
//
//         withJoinBtn.classList.replace(
//           "n-btn-type:filled",
//           "n-btn-type:outline",
//         );
//         withJoinBtn.classList.add("border-color:base-2");
//         withJoinBtn.classList.add("color:base-4");
//         withJoinBtn.textContent = "탈퇴하기";
//         // disabled 지움
//         withJoinBtn.removeAttribute("disabled");
//
//         window.location.reload();
//       }, 800);
//     });
//   });
//
//   // ===================================================================
//   // 비회원 로그인 모달
//   function loginModal() {
//     const openButton = document.getElementById("modal-btn");
//     const closeButton = document.getElementById("login-close-btn");
//     const modal = document.getElementById("login-modal");
//     const modalBackdrop = document.getElementById("login-modal-backdrop");
//
//     modal.classList.remove("d:none");
//     modalBackdrop.classList.remove("d:none");
//     modal.classList.add("modal-fade-in");
//
//     closeButton.addEventListener("click", function () {
//       modal.classList.replace("modal-fade-in", "modal-fade-out");
//
//       setTimeout(() => {
//         modal.classList.add("d:none");
//         modalBackdrop.classList.add("d:none");
//         modal.classList.remove("modal-fade-out");
//       }, 130);
//     });
//   }
//
//   // *** 위드 메인 모임일정 날짜 계산하는 함수 ***
//   function calculateDday(eventDate) {
//     const currentDate = new Date();
//     const targetDate = new Date(eventDate);
//     const timeDiff = targetDate - currentDate;
//     const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
//     return daysDiff;
//   }
//
//   const eventElements = document.querySelectorAll(".event");
//   eventElements.forEach(function (element, index) {
//     const eventDate = element.getAttribute("event-date");
//     const dDay = calculateDday(eventDate);
//     let dDayText;
//     if (dDay > 0) {
//       dDayText = `D-${dDay}`;
//     } else if (dDay < 0) {
//       dDayText = `D+${Math.abs(dDay)}`;
//     } else {
//       dDayText = `D-Day`;
//     }
//     element.querySelector(".d-day").textContent = dDayText;
//
//     if (index >= 3) {
//       element.style.display = "d:none";
//     }
//   });
//
//   // *** more 버튼 누르기 ***
//   const showMoreButton = document.querySelector("#show-more");
//
//   showMoreButton.addEventListener("click", function () {
//     let test = document.querySelectorAll(".event");
//
//     for (let t of test) {
//       t.classList.remove("d:none");
//     }
//   });
// });
