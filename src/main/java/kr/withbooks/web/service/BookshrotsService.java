package kr.withbooks.web.service;

import java.util.List;

import kr.withbooks.web.entity.Bookshorts;
import kr.withbooks.web.entity.BookshortsAttachment;
import kr.withbooks.web.entity.BookshortsView;

public interface BookshrotsService {

    void add(Bookshorts shorts);
    List<BookshortsView> getView(Long booId,Long userId, int page);
    List<BookshortsView> getView();
    List<BookshortsAttachment> getAttach();
    Bookshorts get(Long shortsId);
    void delete(Long shortsId);
    List<BookshortsView> getBestList();
    List<BookshortsView> getView(Long bookId, Long userId, Long lastShortsId);
    BookshortsView getById(Long shortsId, Long userId); 

    // admin/user
    List<BookshortsView> getByUserId(Long userid, Integer page);
    Integer getCount(Long userid);


    void edit(Long sid, String content);
}
