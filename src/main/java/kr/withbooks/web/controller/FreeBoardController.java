package kr.withbooks.web.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.withbooks.web.entity.FreeBoardView;
import kr.withbooks.web.service.FreeBoardService;

@Controller
@RequestMapping("/freeboard")
public class FreeBoardController {

    @Autowired
    private FreeBoardService service;


    @GetMapping("/list")
    public  String list(
        @RequestParam(name="wid") Long withId
        , Model model){

        List<FreeBoardView> list = service.getListByWithId(withId);
        model.addAttribute("list", list);


        return  "/freeboard/list";
    }

    // @GetMapping("/detail")
    // public String detail(@RequestParam Long boardId){

    //     System.out.println("토토토 = ");

    //     return "/freeboard/detail";


    // }
}
