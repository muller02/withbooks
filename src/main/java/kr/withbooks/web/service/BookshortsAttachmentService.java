package kr.withbooks.web.service;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import kr.withbooks.web.entity.BookshortsAttachment;
import org.springframework.web.multipart.MultipartFile;

public interface BookshortsAttachmentService {


    void add(List<MultipartFile> fiels , HttpServletRequest request , Long shortsId);

    List<BookshortsAttachment> getListById(Long id);

    void delete(Long sid, List<String> imgPath, HttpServletRequest request);
}
