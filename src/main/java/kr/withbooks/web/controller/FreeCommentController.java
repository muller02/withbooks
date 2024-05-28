package kr.withbooks.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.withbooks.web.config.CustomUserDetails;
import kr.withbooks.web.service.FreeCommentService;

@Controller
@RequestMapping("/free-comment")
public class FreeCommentController {

    @Autowired
    private FreeCommentService freeCommentService;


     
    @PostMapping
    public String detail(
          @RequestParam(name="fid") Long freeBoardId
        , @RequestParam(name="wid") Long withId
        , @RequestParam(name="p") int page
        , @RequestParam(name="s") String sort
        , @RequestParam(name="m", required = false) int m
        , @RequestParam String comment
        , @RequestHeader("Referer") String referer
        , @AuthenticationPrincipal CustomUserDetails userDetails
    ){


      if(userDetails == null)
        return "로그인을 해 주세요";

      freeCommentService.reg(freeBoardId, userDetails.getId(), comment);


      String queryString = new StringBuilder()
                                .append("m=").append(m)
                                .append("&fid=").append(freeBoardId)
                                .append("&wid=").append(withId)
                                .append("&p=").append(page)
                                .append("&s=").append(sort)
                                .toString();

        
      return "redirect:/free-board/detail?" + queryString;
    }
}
