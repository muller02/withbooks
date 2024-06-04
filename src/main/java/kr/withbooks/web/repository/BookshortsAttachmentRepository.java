package kr.withbooks.web.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.withbooks.web.entity.BookshortsAttachment;

@Mapper
public interface BookshortsAttachmentRepository {
    void save(BookshortsAttachment shortsAttachment);
    List<BookshortsAttachment> findAll();

    List<BookshortsAttachment> findAllById(Long id);

    void remove(Long sid, String imgPath);
}
