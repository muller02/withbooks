package kr.withbooks.web.controller;


import java.util.Enumeration;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
public class LoginController {

    @GetMapping("login")
    public  String login(HttpServletRequest request){

        
      

        return  "login/login";
    }

  

}