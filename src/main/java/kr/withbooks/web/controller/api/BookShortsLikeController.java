package kr.withbooks.web.controller.api;

import kr.withbooks.web.config.CustomUserDetails;
import kr.withbooks.web.entity.ShortsLike;
import kr.withbooks.web.service.ShortsLikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shorts-like")
public class BookShortsLikeController {

    @Autowired
    private ShortsLikeService service;



    @GetMapping("/count")
    int count(@RequestParam(name = "si")Long shortsId){

       int count =  service.getCount(shortsId);

        System.out.println("count = " + count);

       return  count;
    }
    @GetMapping
    boolean isLiked(@RequestParam(name = "si") Long shortsId, @AuthenticationPrincipal CustomUserDetails userDetails){


        if(userDetails ==null){
            return false;
        }
        Long userId = null;

        if(userDetails != null)
            userId = userDetails.getId();;

        System.out.println("토마토 = "  +userId);

        ShortsLike shortsLike = new ShortsLike();
        shortsLike.setShortsId(shortsId);
        shortsLike.setUserId(userId);

        System.out.println("겟 = " + service.getLiked(shortsLike));

        return  service.getLiked(shortsLike);
    }


    @PostMapping
    public ShortsLike  add(@RequestParam(name = "si") Long shortsId, @AuthenticationPrincipal CustomUserDetails userDetails){
        System.out.println("Asdfsfd");



        System.out.println("포스트 요청 ");
        Long userId = null;
        if(userDetails != null)
            userId = userDetails.getId();;

        System.out.println("토마토 = "  +userId);

        ShortsLike shortsLike = new ShortsLike();
        shortsLike.setShortsId(shortsId);
        shortsLike.setUserId(userId);


        System.out.println("딜리트 = " + service.cancle(shortsLike));
        
        ShortsLike sl = service.add(shortsLike);

        return sl;

    }


    @DeleteMapping
    public int delete(@RequestParam(name = "si") Long shortsId, @AuthenticationPrincipal CustomUserDetails userDetails){

        System.out.println("딜리트 요청 ");

        Long userId = null;


        if(userDetails != null)
            userId = userDetails.getId();;

        System.out.println("토마토 = "  +userId);

        ShortsLike shortsLike = new ShortsLike();
        shortsLike.setShortsId(shortsId);
        shortsLike.setUserId(userId);


        System.out.println(service.cancle(shortsLike));

       return service.cancle(shortsLike);


    }

}
