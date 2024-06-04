package kr.withbooks.web.repository;


import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.withbooks.web.entity.Bookshorts;
import kr.withbooks.web.entity.BookshortsView;

@Mapper
public interface BookshortsRepository {
    int save(Bookshorts shorts);

    Bookshorts findById(Long shortsId);

    void blindById(Long shortsId);

    void update(Long sid, String content);
}
