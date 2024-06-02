package kr.withbooks.web.service;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import kr.withbooks.web.entity.BookshortsAttachment;

public interface BookshortsAttachmentService {


    void add(BookshortsAttachment shortsAttachment);

    List<BookshortsAttachment> getListById(Long id);

    void delete(Long sid, List<String> imgPath, HttpServletRequest request);
}
