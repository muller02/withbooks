package kr.withbooks.web.controller;

import jakarta.servlet.http.HttpServletRequest;
import kr.withbooks.web.config.CustomUserDetails;
import kr.withbooks.web.entity.*;
import kr.withbooks.web.repository.CalendarViewRepository;
import kr.withbooks.web.repository.DebateRoomViewRepository;
import kr.withbooks.web.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@Controller
@RequestMapping("with")
public class WithController {

  @Autowired
  private WithService service;

  @Autowired
  private CategoryService categoryService;

  @Autowired
  private WithCategoryService withCategoryService;

  @Autowired
  private WithMemberService withMemberService;

  @Autowired
  private UserService userService;

  // 서비스 필요할 것 같습니다.
  @Autowired
  private DebateRoomViewRepository debateRoomViewRepository;

  @Autowired
  private DebateRoomService debateRoomService;

  @Autowired
  private CalendarViewRepository calendarViewRepository;

  @Autowired
  private CalendarService calendarService;

  @Autowired
  private FreeBoardService freeBoardService;


  @Autowired
  private WithMemberService memberService;

  @GetMapping("list")
  public String list(Model model,
                     @RequestParam(name = "c", required = false) Long[] categoryIds,
                     @RequestParam(name = "q", required = false) String query,
                     @RequestParam(name = "f", required = false) Long faceYn,
                     @RequestParam(name = "p", required = false) Integer page,
                     @AuthenticationPrincipal CustomUserDetails userDetails) {

    Long userId = userDetails != null ? userDetails.getId() : null;

    if (page == null)
      page = 1;

    //카테고리 모델 얻기
    List<Category> categoryList = categoryService.getList();
    model.addAttribute("categoryList", categoryList);

    //  WithView list 얻기 , 쿼리 스트링 ( category id, query, faceYn 포함)
    List<WithView> list = service.getList(categoryIds, query, faceYn, null, null, null, null, page);

    int count = service.getCount(categoryIds, query, faceYn, null, null, null, null, page);


    // 뷰에 데이터 전달
    model.addAttribute("list", list);
    model.addAttribute("count", count);

    return "with/list";
  }

  @GetMapping("detail")
  public String detail(
          Model model
          , @RequestParam(name = "id", required = false) Long withId
          , @AuthenticationPrincipal CustomUserDetails userDetails
  ) {

    //withId에 해당하는 위드 얻기
    With with = service.get(withId);

    Long withCapId = with.getWithRegId();

    String nickname = userService.getNickNameById(withCapId);

    //withId에 해당하는 위드 카테고리 리스트를 얻기
    List<String> withCategoryNames = withCategoryService.getListByWithId(withId);

    //withMember 테이블에서 withId에 해당하는 맴버들을 얻기
    List<WithMemberView> withMemberList = withMemberService.getViewById(withId);

    //WithViewService 를 통해 with Id에 해당하는 view 리스트를 얻고 사이즈를 얻기
    int withMemberCnt = withMemberList.size();

    // 토론 요약에 데이터를 제공 해줄 , de
    List<DebateRoomView> debateRoomList = debateRoomViewRepository.findAllById(withId);

    // 토론 요약 best 책
    DebateRoomView debateTopRoom = debateRoomService.getTopBoardCntbyId(withId);

    // 모임일정 위드메인에 데이터 제공
    List<CalendarView> calendarEvents = calendarService.getEventsById(withId);

    // 해당 위드의 자유 게시판 리스트를 출력하기위한 view Service 호출
    List<FreeBoardView> freeBoardList = freeBoardService.getList(withId, 1, "latest");


    // freeBoardList null 체크 및 2개만 출력
    if (freeBoardList != null) {

      List<FreeBoardView> subList = new ArrayList<>();
      if (freeBoardList.size() >= 2)
        subList = freeBoardList.subList(0, 2);
      else
        subList = freeBoardList;

      model.addAttribute("freeBoardList", subList);
    }

    // Long userId = userDetails.getId();
    if (userDetails != null) {
      // [ ] 제거 예정
      Long userId = userDetails.getId();
      // 위드 가입 여부 알아오기
      Integer withJoinYn = withMemberService.getJoinYn(withId, userId);
      // 미가입 상태일 경우 0 보내기, 반대의 경우 1 보냄
      if (withJoinYn == null) withJoinYn = 0;
      else withJoinYn = 1;
      model.addAttribute("joinYn", withJoinYn);
    }

    model.addAttribute("nickname", nickname);
    
    model.addAttribute("withMemberList", withMemberList);
    // model.addAttribute("freeBoardList", freeBoardList);
    model.addAttribute("debateRoomList", debateRoomList);
    model.addAttribute("calendarEvents", calendarEvents);
    model.addAttribute("with", with);
    model.addAttribute("withCategoryNames", withCategoryNames);
    model.addAttribute("withMemberCnt", withMemberCnt);

    model.addAttribute("debateTopRoom", debateTopRoom);


    return "with/detail";
  }


  @GetMapping("reg")
  public String regForm(Model model
          , @AuthenticationPrincipal CustomUserDetails userDetails) {

    // 위드 등록 페이지에서 사용 할 카테고리 이름들을, 카테고리 서비스를 이용해 가지고 오기
    List<Category> categories = categoryService.getList();
    model.addAttribute("categories", categories);

    // 현재 사용자의 닉네임을 얻어옵니다.
    String nickname = userService.getNickNameById(userDetails.getId());
    model.addAttribute("nickname", nickname);

    return "with/reg";

  }

  @PostMapping("reg")
  public String reg(
          With with,
          // category-id의 체크박스 값들
          @RequestParam(name = "category-id", required = false) Long[] categoryIds,
          // with 대표 이미지 파일
          @RequestParam(name = "with-img-file", required = false) MultipartFile withImgFile,
          @RequestParam(name = "sido") String sido,
          @RequestParam(name = "sigungu") String sigungu,
          @AuthenticationPrincipal CustomUserDetails userDetails,
          HttpServletRequest request
  ) throws IOException {

    
    // sido와 sigungu를 공백으로 구분하여 location으로 결합
    String location = sido + " " + sigungu;
    with.setLocation(location);
    
    if(sido.equals("시/도"))
      with.setLocation("미정");

    //위드 이미지파일 이름
    //파일이 없을 때, 기본 이미지 적용
    String withImgName = "/image/with/default.png";

    //파일이 있을 떄, 파일을 로컬에 저장
    if (!withImgFile.isEmpty()) {

      withImgName = withImgFile.getOriginalFilename();

      String path = "/image/with";
      String realPath = request.getServletContext().getRealPath(path);

      File file = new File(realPath);
      if (!file.exists())
        file.mkdirs();

      File filePath = new File(realPath + File.separator + withImgName);

      withImgFile.transferTo(filePath);
    }

    Long userId = userDetails.getId();
    with.setWithRegId(userId); // 위드 등록 사용자의 ID 설정
//    with.setWithRegId(1L); // 위드 등록 사용자 id 임시 1L

    with.setImg("/image/with/" + withImgName);  //입력 받거나 , 받지 못 했을떄 이미지 이름 지정

    service.add(with);  // with 저장


    //WithCategory 테이블 등록
    Long withId = with.getId();   // 위에서  등록한 with ID 반환받기

    //withcategoryId 배열을 List<Long> 형태로 변환
    List<Long> withCategoryIdList = Arrays.asList(categoryIds);


    // WithCategory 객체 생성 후 값 지정
    WithCategory withCategory = new WithCategory();
    withCategory.setWithID(withId);
    withCategory.setCategoryId(withCategoryIdList);


    Long masterYn = 1L;

    memberService.join(userId, withId, masterYn);

    withCategoryService.add(withCategory.getWithID(), withCategory.getCategoryId());

    return "redirect:/with/list?m=3&p=1";


  }


  @PostMapping("withdraw")
  public String withdraw(
          @RequestParam(name = "with-id", required = true) Long withId
          , @AuthenticationPrincipal CustomUserDetails userDetails
  ) {


    Long userId = null;

    if (userDetails != null)
      userId = userDetails.getId();


    withMemberService.withdraw(withId, userId);

    return "redirect:/with/detail?m=3&id=" + withId;
  }

  @GetMapping("my-list")
  public String list(Model model, @AuthenticationPrincipal CustomUserDetails userDetails) {

    if (userDetails == null)
      return "with/list?m=3&p=1";

    Long userId = userDetails.getId();

    List<WithView> withList = service.getListByUserId(userId);
    model.addAttribute("withList", withList);

    return "with/my-list";
  }


}
