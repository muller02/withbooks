package kr.withbooks.web.service;

import java.util.List;

import kr.withbooks.web.entity.BookmarkView;

public interface BookmarkService {

    List<BookmarkView> getList(Integer p);
    
}
